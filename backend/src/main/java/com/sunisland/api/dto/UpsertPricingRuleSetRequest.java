package com.sunisland.api.dto;

import com.sunisland.api.domain.PricingAddon;
import com.sunisland.api.domain.SurgeRule;
import com.sunisland.api.domain.VehicleClassType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public record UpsertPricingRuleSetRequest(
  boolean active,
  @NotBlank String currency,
  @NotNull Map<VehicleClassType, BigDecimal> baseFareByClass,
  @NotNull Map<VehicleClassType, BigDecimal> perKmByClass,
  @NotNull Map<VehicleClassType, BigDecimal> perMinuteByClass,
  BigDecimal airportFee,
  BigDecimal eventFee,
  @Valid List<PricingAddon> addons,
  @Valid List<SurgeRule> surgeRules
) {}

