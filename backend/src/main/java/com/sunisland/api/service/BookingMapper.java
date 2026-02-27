package com.sunisland.api.service;

import com.sunisland.api.config.AppProperties;
import com.sunisland.api.domain.Booking;
import com.sunisland.api.domain.BookingEstimate;
import com.sunisland.api.dto.BookingResponse;
import com.sunisland.api.dto.EstimateResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BookingMapper {
  private final AppProperties appProperties;

  public BookingResponse toResponse(Booking booking, String manageToken) {
    String manageUrl = null;
    if (manageToken != null && !manageToken.isBlank()) {
      String baseUrl = appProperties.publicBaseUrl() == null || appProperties.publicBaseUrl().isBlank()
        ? "http://localhost:8081"
        : appProperties.publicBaseUrl();
      manageUrl = baseUrl + "/manage-booking?code=" + booking.getConfirmationCode() + "&token=" + manageToken;
    }
    return new BookingResponse(
      booking.getId(),
      booking.getConfirmationCode(),
      manageToken,
      manageUrl,
      booking.getStatus(),
      booking.getPickupAddress(),
      booking.getDropoffAddress(),
      booking.getPickupDateTime(),
      booking.isRoundTrip(),
      booking.getReturnDateTime(),
      booking.getFirstName(),
      booking.getLastName(),
      booking.getEmail(),
      booking.getPhone(),
      booking.getVehicleClass(),
      toEstimate(booking.getEstimate()),
      booking.getSelectedAddons(),
      booking.getFinalTotal(),
      booking.getPaymentMode(),
      booking.getPaymentStatus()
    );
  }

  private EstimateResponse toEstimate(BookingEstimate estimate) {
    if (estimate == null) {
      return null;
    }
    return new EstimateResponse(
      estimate.getDistanceKm(),
      estimate.getDurationMinutes(),
      estimate.getBaseFare(),
      estimate.getDistanceFare(),
      estimate.getTimeFare(),
      estimate.getAddonsTotal(),
      estimate.getSurgeMultiplier(),
      estimate.getFeesTotal(),
      estimate.getTotal(),
      estimate.getCurrency()
    );
  }
}
