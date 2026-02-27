package com.sunisland.api.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingEstimate {
  private BigDecimal distanceKm;
  private int durationMinutes;
  private BigDecimal baseFare;
  private BigDecimal distanceFare;
  private BigDecimal timeFare;
  private BigDecimal addonsTotal;
  private BigDecimal surgeMultiplier;
  private BigDecimal feesTotal;
  private BigDecimal total;
  private String currency;
}

