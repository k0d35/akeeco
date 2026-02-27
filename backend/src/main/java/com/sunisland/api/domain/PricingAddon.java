package com.sunisland.api.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PricingAddon {
  private AddonCode addonCode;
  private String label;
  private AddonPriceType priceType;
  private BigDecimal amount;
  private String unitLabel;
}

