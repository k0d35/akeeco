package com.sunisland.api.dto;

import com.sunisland.api.domain.StaffRole;

public record StaffLoginResponse(
  String token,
  StaffRole role,
  String username
) {}

