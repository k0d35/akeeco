package com.sunisland.api.dto;

import com.sunisland.api.domain.VehicleClassType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.OffsetDateTime;
import java.util.List;

public record CreateEstimateRequest(
  Double pickupLat,
  Double pickupLng,
  Double dropoffLat,
  Double dropoffLng,
  @NotBlank String pickupAddress,
  @NotBlank String dropoffAddress,
  @NotNull @Future OffsetDateTime pickupDateTime,
  @NotNull VehicleClassType vehicleClass,
  @Valid List<SelectedAddonRequest> selectedAddons,
  Boolean airportTransfer,
  Boolean eventTransfer
) {}

