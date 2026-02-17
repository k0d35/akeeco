package com.sunisland.ws;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class TenantPresenceEvent {
  public String tenantId;
  public String entityType; // TRIP or DRAFT
  public String entityId;

  public String userId;
  public String userName;

  public String type; // JOIN STEP FOCUS LEAVE PING
  public String stepKey;
  public String focusPath;

  public String at;
}
