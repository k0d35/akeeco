package com.sunisland.drafts;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class DraftLock {
  private String token;
  private String userId;
  private String userName;
  private String acquiredAt;
  private Integer ttlSeconds;
}
