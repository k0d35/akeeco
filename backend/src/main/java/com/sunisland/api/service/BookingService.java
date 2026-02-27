package com.sunisland.api.service;

import com.sunisland.api.config.BookingPolicyProperties;
import com.sunisland.api.domain.*;
import com.sunisland.api.dto.*;
import com.sunisland.api.exception.BadRequestException;
import com.sunisland.api.exception.ConflictException;
import com.sunisland.api.exception.NotFoundException;
import com.sunisland.api.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {
  private static final String CONFIRMATION_PREFIX = "SIT-";
  private static final String CONFIRMATION_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  private static final int MAX_CONFIRMATION_ATTEMPTS = 20;
  private static final SecureRandom SECURE_RANDOM = new SecureRandom();

  private final BookingRepository bookingRepository;
  private final PricingCalculatorService pricingCalculatorService;
  private final BookingPolicyProperties bookingPolicyProperties;
  private final BookingStatusTransitionService transitionService;
  private final BookingMapper bookingMapper;

  public BookingResponse createBooking(CreateBookingRequest request) {
    EstimateResponse estimate = pricingCalculatorService.calculate(
      request.pickupAddress(),
      request.dropoffAddress(),
      request.pickupLat(),
      request.pickupLng(),
      request.dropoffLat(),
      request.dropoffLng(),
      request.pickupDateTime(),
      request.vehicleClass(),
      request.selectedAddons(),
      request.airportTransfer(),
      false
    );

    String confirmationCode = generateUniqueConfirmationCode();
    String manageToken = generateToken();
    String tokenHash = sha256(manageToken);
    Instant now = Instant.now();

    Booking booking = Booking.builder()
      .confirmationCode(confirmationCode)
      .manageTokenHash(tokenHash)
      .status(BookingStatus.REQUESTED)
      .pickupAddress(request.pickupAddress())
      .dropoffAddress(request.dropoffAddress())
      .pickupLat(request.pickupLat())
      .pickupLng(request.pickupLng())
      .dropoffLat(request.dropoffLat())
      .dropoffLng(request.dropoffLng())
      .pickupDateTime(request.pickupDateTime())
      .roundTrip(request.roundTrip())
      .returnDateTime(request.returnDateTime())
      .airportTransfer(request.airportTransfer())
      .flightNumber(request.flightNumber())
      .airline(request.airline())
      .terminal(request.terminal())
      .airportDirection(request.airportDirection())
      .firstName(request.firstName())
      .lastName(request.lastName())
      .email(request.email())
      .phone(request.phone())
      .whatsApp(request.whatsApp())
      .notesToDriver(request.notesToDriver())
      .vehicleClass(request.vehicleClass())
      .selectedAddons(toSelectedAddons(request.selectedAddons()))
      .estimate(toDomainEstimate(estimate))
      .paymentMode(request.paymentMode())
      // TODO: replace with provider payment intent ID + webhook verified status after Stripe/processor integration.
      .paymentTokenRef(request.paymentTokenRef())
      .paymentStatus(request.paymentMode() == PaymentMode.PAY_NOW ? PaymentStatus.AUTHORIZED : PaymentStatus.UNPAID)
      .createdAt(now)
      .updatedAt(now)
      .statusHistory(new ArrayList<>(List.of(StatusHistoryEntry.builder()
        .timestamp(now)
        .fromStatus(null)
        .toStatus(BookingStatus.REQUESTED)
        .actor(StatusActor.GUEST)
        .note("Booking created")
        .build())))
      .staffNotes(new ArrayList<>())
      .build();

    bookingRepository.save(booking);
    return bookingMapper.toResponse(booking, manageToken);
  }

  public BookingResponse getManageBooking(String confirmationCode, String token) {
    Booking booking = getByConfirmation(confirmationCode);
    validateManageToken(booking, token);
    return bookingMapper.toResponse(booking, null);
  }

  public BookingResponse updatePickupTime(UpdateBookingTimeRequest request) {
    Booking booking = getByConfirmation(request.confirmationCode());
    validateManageToken(booking, request.token());
    ensureChangeWindowAllowed(booking.getPickupDateTime());

    if (booking.isRoundTrip() && request.newReturnDateTime() == null) {
      throw new BadRequestException("newReturnDateTime is required for round-trip bookings.");
    }

    booking.setPickupDateTime(request.newPickupDateTime());
    if (booking.isRoundTrip()) {
      booking.setReturnDateTime(request.newReturnDateTime());
    }
    EstimateResponse updatedEstimate = pricingCalculatorService.calculate(
      booking.getPickupAddress(),
      booking.getDropoffAddress(),
      booking.getPickupLat(),
      booking.getPickupLng(),
      booking.getDropoffLat(),
      booking.getDropoffLng(),
      booking.getPickupDateTime(),
      booking.getVehicleClass(),
      booking.getSelectedAddons() == null ? List.of() : booking.getSelectedAddons().stream()
        .map(sa -> new SelectedAddonRequest(sa.getAddonCode(), sa.getQuantity()))
        .toList(),
      booking.isAirportTransfer(),
      false
    );
    booking.setEstimate(toDomainEstimate(updatedEstimate));
    booking.setUpdatedAt(Instant.now());
    appendHistory(booking, booking.getStatus(), booking.getStatus(), StatusActor.GUEST, "Guest updated pickup time");
    bookingRepository.save(booking);
    return bookingMapper.toResponse(booking, null);
  }

  public BookingResponse cancelBooking(CancelBookingRequest request) {
    Booking booking = getByConfirmation(request.confirmationCode());
    validateManageToken(booking, request.token());
    ensureCancelWindowAllowed(booking.getPickupDateTime());
    if (isTerminalStatus(booking.getStatus())) {
      throw new ConflictException("Booking cannot be cancelled in status " + booking.getStatus());
    }
    transitionService.assertTransition(booking.getStatus(), BookingStatus.CANCELLED);
    BookingStatus previous = booking.getStatus();
    booking.setStatus(BookingStatus.CANCELLED);
    booking.setUpdatedAt(Instant.now());
    appendHistory(booking, previous, BookingStatus.CANCELLED, StatusActor.GUEST, nonBlank(request.reason(), "Cancelled by guest"));
    bookingRepository.save(booking);
    return bookingMapper.toResponse(booking, null);
  }

  public List<Booking> listForStaff(
    OffsetDateTime from,
    OffsetDateTime to,
    BookingStatus status,
    Boolean unassignedOnly,
    String serviceType
  ) {
    List<Booking> bookings;
    if (from != null && to != null) {
      bookings = bookingRepository.findByPickupDateTimeBetween(from, to);
    } else if (status != null) {
      bookings = bookingRepository.findByStatus(status);
    } else {
      bookings = bookingRepository.findAll();
    }
    return bookings.stream()
      .filter(b -> status == null || b.getStatus() == status)
      .filter(b -> unassignedOnly == null || !unassignedOnly || b.getAssignedVehicleId() == null)
      .filter(b -> matchesServiceType(b, serviceType))
      .sorted(Comparator.comparing(Booking::getPickupDateTime))
      .toList();
  }

  public Booking getById(String bookingId) {
    return bookingRepository.findById(bookingId)
      .orElseThrow(() -> new NotFoundException("Booking not found: " + bookingId));
  }

  public BookingResponse updateStatus(String bookingId, UpdateBookingStatusRequest request, String actorName) {
    Booking booking = getById(bookingId);
    transitionService.assertTransition(booking.getStatus(), request.status());
    BookingStatus previous = booking.getStatus();
    booking.setStatus(request.status());
    booking.setUpdatedAt(Instant.now());
    appendHistory(booking, previous, request.status(), StatusActor.STAFF, nonBlank(request.note(), "Updated by " + actorName));
    bookingRepository.save(booking);
    return bookingMapper.toResponse(booking, null);
  }

  public BookingResponse assign(String bookingId, AssignBookingRequest request, String actorName) {
    Booking booking = getById(bookingId);
    if (booking.getAssignedVehicleId() != null && !booking.getAssignedVehicleId().equals(request.assignVehicleId())) {
      throw new ConflictException("Booking already has an assigned vehicle.");
    }
    booking.setAssignedVehicleId(request.assignVehicleId());
    booking.setAssignedDriverId(request.assignDriverId());
    if (booking.getStatus() == BookingStatus.CONFIRMED) {
      transitionService.assertTransition(booking.getStatus(), BookingStatus.ASSIGNED);
      BookingStatus previous = booking.getStatus();
      booking.setStatus(BookingStatus.ASSIGNED);
      appendHistory(booking, previous, BookingStatus.ASSIGNED, StatusActor.STAFF, "Assigned by " + actorName);
    }
    booking.setUpdatedAt(Instant.now());
    bookingRepository.save(booking);
    return bookingMapper.toResponse(booking, null);
  }

  public BookingResponse overrideFinalPricing(String bookingId, OverridePricingRequest request, String actorName) {
    Booking booking = getById(bookingId);
    booking.setFinalTotal(request.finalTotal());
    booking.setUpdatedAt(Instant.now());
    appendHistory(booking, booking.getStatus(), booking.getStatus(), StatusActor.STAFF,
      nonBlank(request.note(), "Final total updated by " + actorName));
    bookingRepository.save(booking);
    return bookingMapper.toResponse(booking, null);
  }

  public BookingResponse addNote(String bookingId, AddBookingNoteRequest request, String actorName) {
    Booking booking = getById(bookingId);
    if (booking.getStaffNotes() == null) {
      booking.setStaffNotes(new ArrayList<>());
    }
    booking.getStaffNotes().add(BookingNote.builder()
      .createdAt(Instant.now())
      .author(actorName)
      .text(request.note())
      .build());
    booking.setUpdatedAt(Instant.now());
    bookingRepository.save(booking);
    return bookingMapper.toResponse(booking, null);
  }

  private boolean matchesServiceType(Booking booking, String serviceType) {
    if (serviceType == null || serviceType.isBlank()) {
      return true;
    }
    return switch (serviceType.trim().toUpperCase(Locale.ROOT)) {
      case "AIRPORT" -> booking.isAirportTransfer();
      case "NON_AIRPORT" -> !booking.isAirportTransfer();
      default -> true;
    };
  }

  private Booking getByConfirmation(String confirmationCode) {
    return bookingRepository.findByConfirmationCode(confirmationCode)
      .orElseThrow(() -> new NotFoundException("Booking not found for confirmation code " + confirmationCode));
  }

  private List<SelectedAddon> toSelectedAddons(List<SelectedAddonRequest> selectedAddons) {
    if (selectedAddons == null) {
      return List.of();
    }
    return selectedAddons.stream()
      .map(x -> new SelectedAddon(x.addonCode(), x.quantity()))
      .collect(Collectors.toList());
  }

  private BookingEstimate toDomainEstimate(EstimateResponse response) {
    return BookingEstimate.builder()
      .distanceKm(response.distanceKm())
      .durationMinutes(response.durationMinutes())
      .baseFare(response.baseFare())
      .distanceFare(response.distanceFare())
      .timeFare(response.timeFare())
      .addonsTotal(response.addonsTotal())
      .surgeMultiplier(response.surgeMultiplier())
      .feesTotal(response.feesTotal())
      .total(response.total())
      .currency(response.currency())
      .build();
  }

  private void ensureChangeWindowAllowed(OffsetDateTime pickup) {
    OffsetDateTime cutoff = pickup.minusHours(bookingPolicyProperties.changeWindowHours());
    if (!OffsetDateTime.now().isBefore(cutoff)) {
      throw new ConflictException("Changes are only allowed at least "
        + bookingPolicyProperties.changeWindowHours() + " hours before pickup.");
    }
  }

  private void ensureCancelWindowAllowed(OffsetDateTime pickup) {
    OffsetDateTime cutoff = pickup.minusHours(bookingPolicyProperties.cancelWindowHours());
    if (!OffsetDateTime.now().isBefore(cutoff)) {
      throw new ConflictException("Cancellation is only allowed at least "
        + bookingPolicyProperties.cancelWindowHours() + " hours before pickup.");
    }
  }

  private void validateManageToken(Booking booking, String rawToken) {
    if (!sha256(rawToken).equals(booking.getManageTokenHash())) {
      throw new BadRequestException("Invalid manage token.");
    }
  }

  private void appendHistory(Booking booking, BookingStatus from, BookingStatus to, StatusActor actor, String note) {
    if (booking.getStatusHistory() == null) {
      booking.setStatusHistory(new ArrayList<>());
    }
    booking.getStatusHistory().add(StatusHistoryEntry.builder()
      .timestamp(Instant.now())
      .fromStatus(from)
      .toStatus(to)
      .actor(actor)
      .note(note)
      .build());
  }

  private boolean isTerminalStatus(BookingStatus status) {
    return status == BookingStatus.COMPLETED || status == BookingStatus.CANCELLED || status == BookingStatus.NO_SHOW;
  }

  private String generateUniqueConfirmationCode() {
    for (int i = 0; i < MAX_CONFIRMATION_ATTEMPTS; i++) {
      String candidate = CONFIRMATION_PREFIX + randomAlphaNumeric(6);
      if (!bookingRepository.existsByConfirmationCode(candidate)) {
        return candidate;
      }
    }
    throw new ConflictException("Unable to generate unique confirmation code.");
  }

  private String randomAlphaNumeric(int length) {
    StringBuilder builder = new StringBuilder(length);
    for (int i = 0; i < length; i++) {
      builder.append(CONFIRMATION_CHARS.charAt(SECURE_RANDOM.nextInt(CONFIRMATION_CHARS.length())));
    }
    return builder.toString();
  }

  private String generateToken() {
    byte[] bytes = new byte[36];
    SECURE_RANDOM.nextBytes(bytes);
    return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
  }

  private String sha256(String value) {
    try {
      MessageDigest digest = MessageDigest.getInstance("SHA-256");
      byte[] hash = digest.digest(value.getBytes(StandardCharsets.UTF_8));
      StringBuilder builder = new StringBuilder(hash.length * 2);
      for (byte b : hash) {
        builder.append(String.format("%02x", b));
      }
      return builder.toString();
    } catch (Exception ex) {
      throw new IllegalStateException("Unable to hash token.");
    }
  }

  private String nonBlank(String value, String fallback) {
    return value == null || value.isBlank() ? fallback : value;
  }
}
