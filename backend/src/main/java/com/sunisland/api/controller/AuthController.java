package com.sunisland.api.controller;

import com.sunisland.api.dto.ApiEnvelope;
import com.sunisland.api.dto.StaffLoginRequest;
import com.sunisland.api.dto.StaffLoginResponse;
import com.sunisland.api.service.StaffAuthService;
import com.sunisland.api.util.CorrelationIdHolder;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
  private final StaffAuthService staffAuthService;

  @PostMapping("/login")
  @Operation(summary = "Staff login endpoint (dev-mode mock auth + JWT).")
  public ApiEnvelope<StaffLoginResponse> login(@Valid @RequestBody StaffLoginRequest request) {
    return ApiEnvelope.of(CorrelationIdHolder.get(), staffAuthService.login(request));
  }
}

