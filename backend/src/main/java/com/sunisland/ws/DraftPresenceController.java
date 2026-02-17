package com.sunisland.ws;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.Instant;

@Controller
@RequiredArgsConstructor
public class DraftPresenceController {
  private final SimpMessagingTemplate messaging;

  @MessageMapping("/drafts/{draftId}/presence")
  public void presence(@DestinationVariable String draftId, @Payload DraftPresenceEvent evt) {
    // demo identity fallback
    if (evt.userId == null) evt.userId = "u-demo-1";
    if (evt.userName == null) evt.userName = "Dispatcher Demo";
    evt.draftId = draftId;
    evt.at = Instant.now().toString();

    messaging.convertAndSend("/topic/drafts/" + draftId + "/presence", evt);
  }
}
