package com.sunisland.api.dto;

import com.sunisland.api.validation.ValidManageTokenPayload;
import jakarta.validation.constraints.NotBlank;

@ValidManageTokenPayload
public record CancelBookingRequest(
  @NotBlank String confirmationCode,
  @NotBlank String token,
  String reason
) {}

