package com.sunisland.api.repository;

import com.sunisland.api.domain.PricingRuleSet;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface PricingRuleSetRepository extends MongoRepository<PricingRuleSet, String> {
  Optional<PricingRuleSet> findFirstByActiveTrue();
}

