package com.sunisland.drafts;

import lombok.*;
import java.time.Instant;
import java.util.Map;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class TripDraft {
  private String id;
  private boolean shared;
  private DraftStatus status;
  private Integer version;
  private Instant createdAt;
  private Instant updatedAt;

  private String customerName;
  private String customerPhone;
  private String pickupText;
  private String pickupDate;
  private String pickupTime;

  private Map<String, Object> formValue;
}
