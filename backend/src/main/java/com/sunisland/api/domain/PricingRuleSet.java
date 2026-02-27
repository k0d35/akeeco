package com.sunisland.api.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "pricing_rule_sets")
public class PricingRuleSet {
  @Id
  private String id;
  private boolean active;
  private String currency;
  private Map<VehicleClassType, BigDecimal> baseFareByClass;
  private Map<VehicleClassType, BigDecimal> perKmByClass;
  private Map<VehicleClassType, BigDecimal> perMinuteByClass;
  private BigDecimal airportFee;
  private BigDecimal eventFee;
  private List<PricingAddon> addons;
  private List<SurgeRule> surgeRules;
  @LastModifiedDate
  private Instant updatedAt;
}

