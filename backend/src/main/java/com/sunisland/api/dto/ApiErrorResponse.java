package com.sunisland.api.dto;

import java.time.Instant;
import java.util.Map;

public record ApiErrorResponse(
  Instant timestamp,
  int status,
  String error,
  String message,
  String correlationId,
  Map<String, String> fieldErrors
) {}

