package com.sunisland.api.service;

import com.sunisland.api.domain.PricingRuleSet;
import com.sunisland.api.dto.UpsertPricingRuleSetRequest;
import com.sunisland.api.exception.NotFoundException;
import com.sunisland.api.repository.PricingRuleSetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class PricingRuleSetService {
  private final PricingRuleSetRepository pricingRuleSetRepository;

  public PricingRuleSet getActive() {
    return pricingRuleSetRepository.findFirstByActiveTrue()
      .orElseThrow(() -> new NotFoundException("No active pricing rule set found."));
  }

  public PricingRuleSet upsert(UpsertPricingRuleSetRequest request) {
    PricingRuleSet existing = pricingRuleSetRepository.findFirstByActiveTrue().orElse(null);
    PricingRuleSet target = existing == null ? new PricingRuleSet() : existing;
    target.setActive(request.active());
    target.setCurrency(request.currency());
    target.setBaseFareByClass(request.baseFareByClass());
    target.setPerKmByClass(request.perKmByClass());
    target.setPerMinuteByClass(request.perMinuteByClass());
    target.setAirportFee(request.airportFee());
    target.setEventFee(request.eventFee());
    target.setAddons(request.addons());
    target.setSurgeRules(request.surgeRules());
    target.setUpdatedAt(Instant.now());
    return pricingRuleSetRepository.save(target);
  }
}

