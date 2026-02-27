package com.sunisland.api.security;

import com.sunisland.api.domain.StaffRole;

public record JwtPrincipal(String username, StaffRole role) {}

