package com.sunisland.api.dto;

import com.sunisland.api.domain.AirportDirection;
import com.sunisland.api.domain.PaymentMode;
import com.sunisland.api.domain.VehicleClassType;
import com.sunisland.api.validation.ValidCreateBookingRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.OffsetDateTime;
import java.util.List;

@ValidCreateBookingRequest
public record CreateBookingRequest(
  @NotBlank String pickupAddress,
  @NotBlank String dropoffAddress,
  Double pickupLat,
  Double pickupLng,
  Double dropoffLat,
  Double dropoffLng,
  @NotNull @Future OffsetDateTime pickupDateTime,
  boolean roundTrip,
  OffsetDateTime returnDateTime,
  boolean airportTransfer,
  String flightNumber,
  String airline,
  String terminal,
  AirportDirection airportDirection,
  @NotBlank String firstName,
  @NotBlank String lastName,
  @Email @NotBlank String email,
  @NotBlank String phone,
  String whatsApp,
  String notesToDriver,
  @NotNull VehicleClassType vehicleClass,
  @Valid List<SelectedAddonRequest> selectedAddons,
  @NotNull PaymentMode paymentMode,
  String paymentTokenRef
) {}

