package com.sunisland.api.dto;

import com.sunisland.api.domain.AddonCode;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record SelectedAddonRequest(
  @NotNull AddonCode addonCode,
  @Min(1) int quantity
) {}

