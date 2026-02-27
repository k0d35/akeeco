package com.sunisland.api.dto;

import com.sunisland.api.domain.BookingStatus;
import com.sunisland.api.domain.PaymentMode;
import com.sunisland.api.domain.PaymentStatus;
import com.sunisland.api.domain.SelectedAddon;
import com.sunisland.api.domain.VehicleClassType;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

public record BookingResponse(
  String id,
  String confirmationCode,
  String manageToken,
  String manageUrl,
  BookingStatus status,
  String pickupAddress,
  String dropoffAddress,
  OffsetDateTime pickupDateTime,
  boolean roundTrip,
  OffsetDateTime returnDateTime,
  String firstName,
  String lastName,
  String email,
  String phone,
  VehicleClassType vehicleClass,
  EstimateResponse estimate,
  List<SelectedAddon> selectedAddons,
  BigDecimal finalTotal,
  PaymentMode paymentMode,
  PaymentStatus paymentStatus
) {}

