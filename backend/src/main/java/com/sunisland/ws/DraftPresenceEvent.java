package com.sunisland.ws;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class DraftPresenceEvent {
  public String tenantId;
  public String draftId;
  public String userId;
  public String userName;

  public String type;      // JOIN STEP FOCUS LEAVE PING
  public String stepKey;
  public String focusPath;

  public String at;
}
