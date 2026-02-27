package com.sunisland.api.service;

import com.sunisland.api.domain.StaffRole;
import com.sunisland.api.dto.StaffLoginRequest;
import com.sunisland.api.dto.StaffLoginResponse;
import com.sunisland.api.exception.UnauthorizedException;
import com.sunisland.api.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
@RequiredArgsConstructor
public class StaffAuthService {
  private final JwtService jwtService;

  public StaffLoginResponse login(StaffLoginRequest request) {
    // Stub auth for now. Replace with real user store + password hashing.
    String username = request.username().trim().toLowerCase(Locale.ROOT);
    StaffRole role = resolveRole(username, request.password());
    String token = jwtService.issueToken(username, role);
    return new StaffLoginResponse(token, role, username);
  }

  private StaffRole resolveRole(String username, String password) {
    if (password == null || password.isBlank()) {
      throw new UnauthorizedException("Invalid credentials.");
    }
    if (username.startsWith("admin")) {
      return StaffRole.ADMIN;
    }
    if (username.startsWith("dispatch")) {
      return StaffRole.DISPATCH;
    }
    if (username.startsWith("driver")) {
      return StaffRole.DRIVER;
    }
    throw new UnauthorizedException("Unknown user. Use admin*/dispatch*/driver* usernames in dev mode.");
  }
}

