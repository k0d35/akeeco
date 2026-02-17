package com.sunisland.ws;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.Instant;

@Controller
@RequiredArgsConstructor
public class TenantPresenceController {
  private final SimpMessagingTemplate messaging;

  @MessageMapping("/tenant/presence")
  public void tenantPresence(@Payload TenantPresenceEvent evt) {
    if (evt.userId == null) evt.userId = "u-demo-1";
    if (evt.userName == null) evt.userName = "Dispatcher Demo";
    evt.at = Instant.now().toString();
    if (evt.tenantId == null) evt.tenantId = "t-demo";
    messaging.convertAndSend("/topic/tenant/" + evt.tenantId + "/presence", evt);
  }
}
