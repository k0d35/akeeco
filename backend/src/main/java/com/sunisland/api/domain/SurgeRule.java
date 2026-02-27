package com.sunisland.api.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SurgeRule {
  private String name;
  private Set<DayOfWeek> daysOfWeek;
  private LocalTime startTime;
  private LocalTime endTime;
  private BigDecimal multiplier;
}

