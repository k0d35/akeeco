package com.sunisland.api.dto;

import com.sunisland.api.validation.ValidManageTokenPayload;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.OffsetDateTime;

@ValidManageTokenPayload
public record UpdateBookingTimeRequest(
  @NotBlank String confirmationCode,
  @NotBlank String token,
  @NotNull @Future OffsetDateTime newPickupDateTime,
  OffsetDateTime newReturnDateTime
) {}

