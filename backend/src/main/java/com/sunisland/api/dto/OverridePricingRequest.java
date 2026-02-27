package com.sunisland.api.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record OverridePricingRequest(
  @NotNull @DecimalMin("0.00") BigDecimal finalTotal,
  String note
) {}

