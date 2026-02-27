package com.sunisland.api.controller;

import com.sunisland.api.domain.FaqTopic;
import com.sunisland.api.domain.Vehicle;
import com.sunisland.api.dto.*;
import com.sunisland.api.service.BookingService;
import com.sunisland.api.service.PricingCalculatorService;
import com.sunisland.api.service.PublicContentService;
import com.sunisland.api.service.VehicleService;
import com.sunisland.api.util.CorrelationIdHolder;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {
  private final PricingCalculatorService pricingCalculatorService;
  private final BookingService bookingService;
  private final VehicleService vehicleService;
  private final PublicContentService publicContentService;

  @PostMapping("/estimate")
  @Operation(summary = "Create a public fare estimate.")
  public ApiEnvelope<EstimateResponse> estimate(@Valid @RequestBody CreateEstimateRequest request) {
    return ApiEnvelope.of(CorrelationIdHolder.get(), pricingCalculatorService.estimate(request));
  }

  @PostMapping("/bookings")
  @Operation(summary = "Create a public booking request and return one-time manage token.")
  public ApiEnvelope<BookingResponse> createBooking(@Valid @RequestBody CreateBookingRequest request) {
    return ApiEnvelope.of(CorrelationIdHolder.get(), bookingService.createBooking(request));
  }

  @GetMapping("/bookings/manage")
  @Operation(summary = "View booking using confirmation code + magic token.")
  public ApiEnvelope<BookingResponse> manageGet(
    @RequestParam("code") String code,
    @RequestParam("token") String token
  ) {
    return ApiEnvelope.of(CorrelationIdHolder.get(), bookingService.getManageBooking(code, token));
  }

  @PatchMapping("/bookings/manage/time")
  @Operation(summary = "Update booking pickup/return time using magic token.")
  public ApiEnvelope<BookingResponse> manageUpdateTime(@Valid @RequestBody UpdateBookingTimeRequest request) {
    return ApiEnvelope.of(CorrelationIdHolder.get(), bookingService.updatePickupTime(request));
  }

  @PostMapping("/bookings/manage/cancel")
  @Operation(summary = "Cancel booking using magic token.")
  public ApiEnvelope<BookingResponse> manageCancel(@Valid @RequestBody CancelBookingRequest request) {
    return ApiEnvelope.of(CorrelationIdHolder.get(), bookingService.cancelBooking(request));
  }

  @GetMapping("/vehicles")
  @Operation(summary = "Get active public fleet.")
  public ApiEnvelope<List<Vehicle>> vehicles() {
    return ApiEnvelope.of(CorrelationIdHolder.get(), vehicleService.findActiveVehicles());
  }

  @GetMapping("/content/faqs")
  @Operation(summary = "Get public FAQ content by topic.")
  public ApiEnvelope<FaqResponse> faqs(@RequestParam("topic") String topic) {
    FaqTopic parsed = FaqTopic.valueOf(topic.trim().toUpperCase());
    return ApiEnvelope.of(CorrelationIdHolder.get(), publicContentService.getFaqByTopic(parsed));
  }
}
