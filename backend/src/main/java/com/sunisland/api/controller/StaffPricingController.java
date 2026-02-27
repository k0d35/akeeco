package com.sunisland.api.controller;

import com.sunisland.api.domain.PricingRuleSet;
import com.sunisland.api.dto.ApiEnvelope;
import com.sunisland.api.dto.UpsertPricingRuleSetRequest;
import com.sunisland.api.service.PricingRuleSetService;
import com.sunisland.api.util.CorrelationIdHolder;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/staff/pricing-rules")
@RequiredArgsConstructor
public class StaffPricingController {
  private final PricingRuleSetService pricingRuleSetService;

  @GetMapping
  @Operation(summary = "Get active pricing rule set.")
  @PreAuthorize("hasAnyRole('ADMIN','DISPATCH')")
  public ApiEnvelope<PricingRuleSet> getActive() {
    return ApiEnvelope.of(CorrelationIdHolder.get(), pricingRuleSetService.getActive());
  }

  @PatchMapping
  @Operation(summary = "Update active pricing rule set (ADMIN).")
  @PreAuthorize("hasRole('ADMIN')")
  public ApiEnvelope<PricingRuleSet> patch(@Valid @RequestBody UpsertPricingRuleSetRequest request) {
    return ApiEnvelope.of(CorrelationIdHolder.get(), pricingRuleSetService.upsert(request));
  }
}

