package com.sunisland.api.controller;

import com.sunisland.api.domain.Vehicle;
import com.sunisland.api.dto.ApiEnvelope;
import com.sunisland.api.dto.UpsertVehicleRequest;
import com.sunisland.api.service.VehicleService;
import com.sunisland.api.util.CorrelationIdHolder;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff/vehicles")
@RequiredArgsConstructor
public class StaffVehicleController {
  private final VehicleService vehicleService;

  @GetMapping
  @Operation(summary = "List all fleet vehicles.")
  @PreAuthorize("hasAnyRole('ADMIN','DISPATCH','DRIVER')")
  public ApiEnvelope<List<Vehicle>> list() {
    return ApiEnvelope.of(CorrelationIdHolder.get(), vehicleService.findAllVehicles());
  }

  @PostMapping
  @Operation(summary = "Create fleet vehicle (ADMIN).")
  @PreAuthorize("hasRole('ADMIN')")
  public ApiEnvelope<Vehicle> create(@Valid @RequestBody UpsertVehicleRequest request) {
    return ApiEnvelope.of(CorrelationIdHolder.get(), vehicleService.createVehicle(request));
  }

  @PatchMapping("/{id}")
  @Operation(summary = "Update fleet vehicle (ADMIN).")
  @PreAuthorize("hasRole('ADMIN')")
  public ApiEnvelope<Vehicle> patch(@PathVariable String id, @Valid @RequestBody UpsertVehicleRequest request) {
    return ApiEnvelope.of(CorrelationIdHolder.get(), vehicleService.updateVehicle(id, request));
  }
}

