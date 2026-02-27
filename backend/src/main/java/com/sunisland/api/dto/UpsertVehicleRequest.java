package com.sunisland.api.dto;

import com.sunisland.api.domain.RecommendedForTag;
import com.sunisland.api.domain.VehicleClassType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record UpsertVehicleRequest(
  @NotBlank String code,
  @NotNull VehicleClassType classType,
  @NotBlank String name,
  @Min(1) int seats,
  @Min(0) int luggage,
  List<String> amenities,
  List<RecommendedForTag> recommendedFor,
  boolean active,
  String imageUrl
) {}

