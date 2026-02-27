package com.sunisland.api.dto;

import java.math.BigDecimal;

public record EstimateResponse(
  BigDecimal distanceKm,
  int durationMinutes,
  BigDecimal baseFare,
  BigDecimal distanceFare,
  BigDecimal timeFare,
  BigDecimal addonsTotal,
  BigDecimal surgeMultiplier,
  BigDecimal feesTotal,
  BigDecimal total,
  String currency
) {}

