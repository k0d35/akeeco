package com.sunisland.api.controller;

import com.sunisland.api.dto.ApiEnvelope;
import com.sunisland.api.util.CorrelationIdHolder;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/staff/drivers")
public class StaffDriverController {

  @GetMapping("/stub")
  @Operation(summary = "Phase 2 placeholder for real driver module.")
  @PreAuthorize("hasAnyRole('ADMIN','DISPATCH','DRIVER')")
  public ApiEnvelope<Map<String, String>> stub() {
    // TODO: implement real driver app features (driver profile, availability, live location, job acceptance).
    return ApiEnvelope.of(CorrelationIdHolder.get(), Map.of(
      "message", "Driver module is planned for phase 2."
    ));
  }
}

