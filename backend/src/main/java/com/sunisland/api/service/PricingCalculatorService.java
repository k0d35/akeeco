package com.sunisland.api.service;

import com.sunisland.api.domain.*;
import com.sunisland.api.dto.CreateEstimateRequest;
import com.sunisland.api.dto.EstimateResponse;
import com.sunisland.api.dto.SelectedAddonRequest;
import com.sunisland.api.exception.BadRequestException;
import com.sunisland.api.exception.NotFoundException;
import com.sunisland.api.repository.PricingRuleSetRepository;
import com.sunisland.api.util.DistanceUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PricingCalculatorService {
  private final PricingRuleSetRepository pricingRuleSetRepository;

  public PricingRuleSet getActiveRuleSet() {
    return pricingRuleSetRepository.findFirstByActiveTrue()
      .orElseThrow(() -> new NotFoundException("No active pricing rule set found."));
  }

  public EstimateResponse estimate(CreateEstimateRequest request) {
    return calculate(
      request.pickupAddress(),
      request.dropoffAddress(),
      request.pickupLat(),
      request.pickupLng(),
      request.dropoffLat(),
      request.dropoffLng(),
      request.pickupDateTime(),
      request.vehicleClass(),
      request.selectedAddons(),
      Boolean.TRUE.equals(request.airportTransfer()),
      Boolean.TRUE.equals(request.eventTransfer())
    );
  }

  public EstimateResponse calculate(
    String pickupAddress,
    String dropoffAddress,
    Double pickupLat,
    Double pickupLng,
    Double dropoffLat,
    Double dropoffLng,
    OffsetDateTime pickupDateTime,
    VehicleClassType classType,
    List<SelectedAddonRequest> selectedAddons,
    boolean airportTransfer,
    boolean eventTransfer
  ) {
    PricingRuleSet rules = getActiveRuleSet();

    BigDecimal distanceKm = BigDecimal.valueOf(resolveDistanceKm(
      pickupAddress, dropoffAddress, pickupLat, pickupLng, dropoffLat, dropoffLng
    ));
    int durationMinutes = resolveDurationMinutes(distanceKm.doubleValue());

    BigDecimal baseFare = findByClass(rules.getBaseFareByClass(), classType, "base fare");
    BigDecimal perKm = findByClass(rules.getPerKmByClass(), classType, "per-km rate");
    BigDecimal perMinute = findByClass(rules.getPerMinuteByClass(), classType, "per-minute rate");

    BigDecimal distanceFare = perKm.multiply(distanceKm);
    BigDecimal timeFare = perMinute.multiply(BigDecimal.valueOf(durationMinutes));
    BigDecimal addonsTotal = calculateAddonsTotal(selectedAddons, rules.getAddons());
    BigDecimal fees = BigDecimal.ZERO;
    if (airportTransfer && rules.getAirportFee() != null) {
      fees = fees.add(rules.getAirportFee());
    }
    if (eventTransfer && rules.getEventFee() != null) {
      fees = fees.add(rules.getEventFee());
    }
    BigDecimal surgeMultiplier = resolveSurgeMultiplier(pickupDateTime, rules.getSurgeRules());
    BigDecimal subtotal = baseFare.add(distanceFare).add(timeFare).add(addonsTotal).add(fees);
    BigDecimal total = subtotal.multiply(surgeMultiplier);

    return new EstimateResponse(
      distanceKm.setScale(2, RoundingMode.HALF_UP),
      durationMinutes,
      money(baseFare),
      money(distanceFare),
      money(timeFare),
      money(addonsTotal),
      surgeMultiplier.setScale(2, RoundingMode.HALF_UP),
      money(fees),
      money(total),
      rules.getCurrency()
    );
  }

  private double resolveDistanceKm(
    String pickupAddress,
    String dropoffAddress,
    Double pickupLat,
    Double pickupLng,
    Double dropoffLat,
    Double dropoffLng
  ) {
    if (pickupLat != null && pickupLng != null && dropoffLat != null && dropoffLng != null) {
      return Math.max(1.0, DistanceUtils.haversineKm(pickupLat, pickupLng, dropoffLat, dropoffLng));
    }
    // TODO: replace with Google Maps Distance Matrix or Places routes for accurate road distance.
    int heuristic = (pickupAddress + dropoffAddress).replaceAll("\\s+", "").length();
    return Math.max(3.0, heuristic * 0.35);
  }

  private int resolveDurationMinutes(double distanceKm) {
    double avgUrbanKph = 30.0;
    return Math.max(12, (int) Math.round((distanceKm / avgUrbanKph) * 60));
  }

  private BigDecimal resolveSurgeMultiplier(OffsetDateTime pickupDateTime, List<SurgeRule> rules) {
    if (rules == null || rules.isEmpty()) {
      return BigDecimal.ONE;
    }
    DayOfWeek day = pickupDateTime.getDayOfWeek();
    LocalTime time = pickupDateTime.toLocalTime();
    return rules.stream()
      .filter(rule -> rule.getDaysOfWeek() != null && rule.getDaysOfWeek().contains(day))
      .filter(rule -> isWithin(time, rule.getStartTime(), rule.getEndTime()))
      .map(SurgeRule::getMultiplier)
      .max(BigDecimal::compareTo)
      .orElse(BigDecimal.ONE);
  }

  private boolean isWithin(LocalTime time, LocalTime start, LocalTime end) {
    if (start == null || end == null) {
      return false;
    }
    if (end.isAfter(start) || end.equals(start)) {
      return !time.isBefore(start) && !time.isAfter(end);
    }
    return !time.isBefore(start) || !time.isAfter(end);
  }

  private BigDecimal calculateAddonsTotal(List<SelectedAddonRequest> selected, List<PricingAddon> addons) {
    if (selected == null || selected.isEmpty()) {
      return BigDecimal.ZERO;
    }
    List<PricingAddon> safeAddons = Optional.ofNullable(addons).orElse(Collections.emptyList());
    BigDecimal total = BigDecimal.ZERO;
    for (SelectedAddonRequest selectedAddon : selected) {
      PricingAddon pricingAddon = safeAddons.stream()
        .filter(a -> a.getAddonCode() == selectedAddon.addonCode())
        .findFirst()
        .orElseThrow(() -> new BadRequestException("Unknown addon: " + selectedAddon.addonCode()));
      BigDecimal lineAmount = pricingAddon.getAmount();
      if (pricingAddon.getPriceType() == AddonPriceType.PER_UNIT) {
        lineAmount = lineAmount.multiply(BigDecimal.valueOf(selectedAddon.quantity()));
      }
      total = total.add(lineAmount);
    }
    return total;
  }

  private BigDecimal findByClass(Map<VehicleClassType, BigDecimal> map, VehicleClassType classType, String field) {
    if (map == null || !map.containsKey(classType)) {
      throw new BadRequestException("Pricing " + field + " is missing for class " + classType);
    }
    return map.get(classType);
  }

  private BigDecimal money(BigDecimal value) {
    return value.setScale(2, RoundingMode.HALF_UP);
  }
}

