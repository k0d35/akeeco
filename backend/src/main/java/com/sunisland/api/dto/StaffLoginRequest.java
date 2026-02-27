package com.sunisland.api.dto;

import jakarta.validation.constraints.NotBlank;

public record StaffLoginRequest(
  @NotBlank String username,
  @NotBlank String password
) {}

