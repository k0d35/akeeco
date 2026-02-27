package com.sunisland.api.dto;

import com.sunisland.api.domain.BookingStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateBookingStatusRequest(
  @NotNull BookingStatus status,
  String note
) {}

