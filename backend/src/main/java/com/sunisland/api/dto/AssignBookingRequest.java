package com.sunisland.api.dto;

import jakarta.validation.constraints.NotBlank;

public record AssignBookingRequest(
  @NotBlank String assignVehicleId,
  String assignDriverId
) {}

