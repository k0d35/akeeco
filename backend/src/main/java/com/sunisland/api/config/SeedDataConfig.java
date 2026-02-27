package com.sunisland.api.config;

import com.sunisland.api.domain.*;
import com.sunisland.api.repository.FaqTopicRepository;
import com.sunisland.api.repository.PricingRuleSetRepository;
import com.sunisland.api.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Configuration
@RequiredArgsConstructor
public class SeedDataConfig {
  private final VehicleRepository vehicleRepository;
  private final PricingRuleSetRepository pricingRuleSetRepository;
  private final FaqTopicRepository faqTopicRepository;

  @Bean
  ApplicationRunner seedDataRunner() {
    return args -> {
      seedVehicles();
      seedPricingRules();
      seedFaqs();
    };
  }

  private void seedVehicles() {
    upsertVehicle("EXEC_SEDAN_01", VehicleClassType.EXECUTIVE_SEDAN, "Executive Sedan", 3, 3,
      List.of("Leather seats", "WiFi", "Water"), List.of(RecommendedForTag.AIRPORT, RecommendedForTag.VIP));
    upsertVehicle("LUX_SUV_01", VehicleClassType.LUXURY_SUV, "Luxury SUV", 6, 5,
      List.of("Premium sound", "Climate zones", "WiFi"), List.of(RecommendedForTag.AIRPORT, RecommendedForTag.GROUP));
    upsertVehicle("VAN_01", VehicleClassType.VAN, "Comfort Van", 10, 10,
      List.of("Large cargo hold", "USB charging"), List.of(RecommendedForTag.GROUP, RecommendedForTag.EVENTS));
    upsertVehicle("LIMO_01", VehicleClassType.STRETCH_LIMO, "Stretch Limo", 8, 4,
      List.of("Mood lighting", "Privacy divider", "Refreshment bar"), List.of(RecommendedForTag.VIP, RecommendedForTag.EVENTS));
  }

  private void upsertVehicle(
    String code,
    VehicleClassType classType,
    String name,
    int seats,
    int luggage,
    List<String> amenities,
    List<RecommendedForTag> tags
  ) {
    Vehicle vehicle = vehicleRepository.findByCode(code).orElseGet(Vehicle::new);
    if (vehicle.getCreatedAt() == null) {
      vehicle.setCreatedAt(Instant.now());
    }
    vehicle.setCode(code);
    vehicle.setClassType(classType);
    vehicle.setName(name);
    vehicle.setSeats(seats);
    vehicle.setLuggage(luggage);
    vehicle.setAmenities(amenities);
    vehicle.setRecommendedFor(tags);
    vehicle.setActive(true);
    vehicle.setUpdatedAt(Instant.now());
    vehicleRepository.save(vehicle);
  }

  private void seedPricingRules() {
    if (pricingRuleSetRepository.findFirstByActiveTrue().isPresent()) {
      return;
    }
    PricingRuleSet rules = PricingRuleSet.builder()
      .active(true)
      .currency("USD")
      .baseFareByClass(Map.of(
        VehicleClassType.EXECUTIVE_SEDAN, new BigDecimal("35.00"),
        VehicleClassType.LUXURY_SUV, new BigDecimal("55.00"),
        VehicleClassType.VAN, new BigDecimal("70.00"),
        VehicleClassType.STRETCH_LIMO, new BigDecimal("120.00")
      ))
      .perKmByClass(Map.of(
        VehicleClassType.EXECUTIVE_SEDAN, new BigDecimal("1.90"),
        VehicleClassType.LUXURY_SUV, new BigDecimal("2.50"),
        VehicleClassType.VAN, new BigDecimal("3.20"),
        VehicleClassType.STRETCH_LIMO, new BigDecimal("4.50")
      ))
      .perMinuteByClass(Map.of(
        VehicleClassType.EXECUTIVE_SEDAN, new BigDecimal("0.60"),
        VehicleClassType.LUXURY_SUV, new BigDecimal("0.90"),
        VehicleClassType.VAN, new BigDecimal("1.20"),
        VehicleClassType.STRETCH_LIMO, new BigDecimal("2.00")
      ))
      .airportFee(new BigDecimal("12.00"))
      .eventFee(new BigDecimal("18.00"))
      .addons(List.of(
        new PricingAddon(AddonCode.EXTRA_STOP, "Extra Stop", AddonPriceType.FIXED, new BigDecimal("15.00"), null),
        new PricingAddon(AddonCode.CHILD_SEAT, "Child Seat", AddonPriceType.PER_UNIT, new BigDecimal("8.00"), "seat"),
        new PricingAddon(AddonCode.MEET_GREET, "Meet & Greet", AddonPriceType.FIXED, new BigDecimal("20.00"), null),
        new PricingAddon(AddonCode.LUGGAGE_ASSIST, "Luggage Assist", AddonPriceType.FIXED, new BigDecimal("12.00"), null),
        new PricingAddon(AddonCode.WAITING_BUFFER, "Waiting Buffer", AddonPriceType.PER_UNIT, new BigDecimal("10.00"), "15min")
      ))
      .surgeRules(List.of(
        new SurgeRule("Weekend Evenings", Set.of(DayOfWeek.FRIDAY, DayOfWeek.SATURDAY), LocalTime.of(18, 0), LocalTime.of(23, 59), new BigDecimal("1.25")),
        new SurgeRule("Morning Peak", Set.of(DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY),
          LocalTime.of(6, 30), LocalTime.of(9, 30), new BigDecimal("1.15"))
      ))
      .updatedAt(Instant.now())
      .build();
    pricingRuleSetRepository.save(rules);
  }

  private void seedFaqs() {
    upsertFaq(FaqTopic.AIRPORT, List.of(
      new FaqItem("Do you monitor flight delays?", "Yes, airport transfer reservations include flight monitoring."),
      new FaqItem("How early should I book?", "We recommend booking at least 24 hours before pickup.")
    ));
    upsertFaq(FaqTopic.TOURS, List.of(
      new FaqItem("Can I customize private tours?", "Yes, custom itineraries are available on request."),
      new FaqItem("Are refreshments included?", "Light refreshments are available for selected packages.")
    ));
    upsertFaq(FaqTopic.CORPORATE, List.of(
      new FaqItem("Do you offer invoicing?", "Yes, approved corporate accounts can be invoiced."),
      new FaqItem("Can we set preferred drivers?", "We can flag preferred drivers where operationally possible.")
    ));
    upsertFaq(FaqTopic.EVENTS, List.of(
      new FaqItem("Do you support weddings and conferences?", "Yes, event transportation packages are available."),
      new FaqItem("Can we coordinate multi-vehicle dispatch?", "Yes, dispatch can coordinate staggered pickups.")
    ));
  }

  private void upsertFaq(FaqTopic topic, List<FaqItem> items) {
    FaqTopicDocument doc = faqTopicRepository.findByTopic(topic).orElseGet(FaqTopicDocument::new);
    doc.setTopic(topic);
    doc.setItems(items);
    faqTopicRepository.save(doc);
  }
}

