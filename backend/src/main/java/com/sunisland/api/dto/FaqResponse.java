package com.sunisland.api.dto;

import com.sunisland.api.domain.FaqTopic;

import java.util.List;

public record FaqResponse(FaqTopic topic, List<FaqRow> items) {
  public record FaqRow(String question, String answer) {}
}

