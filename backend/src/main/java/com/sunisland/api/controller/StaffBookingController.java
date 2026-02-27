package com.sunisland.api.controller;

import com.sunisland.api.domain.Booking;
import com.sunisland.api.domain.BookingStatus;
import com.sunisland.api.dto.*;
import com.sunisland.api.service.BookingService;
import com.sunisland.api.util.CorrelationIdHolder;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/staff/bookings")
@RequiredArgsConstructor
public class StaffBookingController {
  private final BookingService bookingService;

  @GetMapping
  @Operation(summary = "List bookings for staff with optional filters.")
  @PreAuthorize("hasAnyRole('ADMIN','DISPATCH','DRIVER')")
  public ApiEnvelope<List<Booking>> list(
    @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime from,
    @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime to,
    @RequestParam(required = false) BookingStatus status,
    @RequestParam(required = false) Boolean unassignedOnly,
    @RequestParam(required = false) String serviceType
  ) {
    return ApiEnvelope.of(CorrelationIdHolder.get(), bookingService.listForStaff(from, to, status, unassignedOnly, serviceType));
  }

  @GetMapping("/{id}")
  @Operation(summary = "Get booking details by id.")
  @PreAuthorize("hasAnyRole('ADMIN','DISPATCH','DRIVER')")
  public ApiEnvelope<Booking> detail(@PathVariable String id) {
    return ApiEnvelope.of(CorrelationIdHolder.get(), bookingService.getById(id));
  }

  @PatchMapping("/{id}/status")
  @Operation(summary = "Update booking status with transition checks.")
  @PreAuthorize("hasAnyRole('ADMIN','DISPATCH')")
  public ApiEnvelope<BookingResponse> updateStatus(
    @PathVariable String id,
    @Valid @RequestBody UpdateBookingStatusRequest request,
    Authentication authentication
  ) {
    return ApiEnvelope.of(CorrelationIdHolder.get(), bookingService.updateStatus(id, request, authentication.getName()));
  }

  @PatchMapping("/{id}/assign")
  @Operation(summary = "Assign a vehicle/driver to booking.")
  @PreAuthorize("hasAnyRole('ADMIN','DISPATCH')")
  public ApiEnvelope<BookingResponse> assign(
    @PathVariable String id,
    @Valid @RequestBody AssignBookingRequest request,
    Authentication authentication
  ) {
    return ApiEnvelope.of(CorrelationIdHolder.get(), bookingService.assign(id, request, authentication.getName()));
  }

  @PatchMapping("/{id}/pricing")
  @Operation(summary = "Override final pricing total (ADMIN only).")
  @PreAuthorize("hasRole('ADMIN')")
  public ApiEnvelope<BookingResponse> overridePricing(
    @PathVariable String id,
    @Valid @RequestBody OverridePricingRequest request,
    Authentication authentication
  ) {
    return ApiEnvelope.of(CorrelationIdHolder.get(), bookingService.overrideFinalPricing(id, request, authentication.getName()));
  }

  @PostMapping("/{id}/notes")
  @Operation(summary = "Append internal staff note.")
  @PreAuthorize("hasAnyRole('ADMIN','DISPATCH')")
  public ApiEnvelope<BookingResponse> addNote(
    @PathVariable String id,
    @Valid @RequestBody AddBookingNoteRequest request,
    Authentication authentication
  ) {
    return ApiEnvelope.of(CorrelationIdHolder.get(), bookingService.addNote(id, request, authentication.getName()));
  }
}

