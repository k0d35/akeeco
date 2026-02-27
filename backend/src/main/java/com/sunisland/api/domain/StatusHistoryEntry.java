package com.sunisland.api.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatusHistoryEntry {
  private Instant timestamp;
  private BookingStatus fromStatus;
  private BookingStatus toStatus;
  private StatusActor actor;
  private String note;
}

