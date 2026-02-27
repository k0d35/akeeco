package com.sunisland.api.dto;

import java.time.Instant;

public record ApiEnvelope<T>(Instant timestamp, String correlationId, T data) {
  public static <T> ApiEnvelope<T> of(String correlationId, T data) {
    return new ApiEnvelope<>(Instant.now(), correlationId, data);
  }
}

