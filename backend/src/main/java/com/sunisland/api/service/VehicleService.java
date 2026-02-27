package com.sunisland.api.service;

import com.sunisland.api.domain.Vehicle;
import com.sunisland.api.dto.UpsertVehicleRequest;
import com.sunisland.api.exception.NotFoundException;
import com.sunisland.api.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleService {
  private final VehicleRepository vehicleRepository;

  public List<Vehicle> findActiveVehicles() {
    return vehicleRepository.findByActiveTrue();
  }

  public List<Vehicle> findAllVehicles() {
    return vehicleRepository.findAll();
  }

  public Vehicle createVehicle(UpsertVehicleRequest request) {
    Instant now = Instant.now();
    Vehicle vehicle = Vehicle.builder()
      .code(request.code())
      .classType(request.classType())
      .name(request.name())
      .seats(request.seats())
      .luggage(request.luggage())
      .amenities(request.amenities())
      .recommendedFor(request.recommendedFor())
      .active(request.active())
      .imageUrl(request.imageUrl())
      .createdAt(now)
      .updatedAt(now)
      .build();
    return vehicleRepository.save(vehicle);
  }

  public Vehicle updateVehicle(String id, UpsertVehicleRequest request) {
    Vehicle vehicle = vehicleRepository.findById(id)
      .orElseThrow(() -> new NotFoundException("Vehicle not found: " + id));
    vehicle.setCode(request.code());
    vehicle.setClassType(request.classType());
    vehicle.setName(request.name());
    vehicle.setSeats(request.seats());
    vehicle.setLuggage(request.luggage());
    vehicle.setAmenities(request.amenities());
    vehicle.setRecommendedFor(request.recommendedFor());
    vehicle.setActive(request.active());
    vehicle.setImageUrl(request.imageUrl());
    vehicle.setUpdatedAt(Instant.now());
    return vehicleRepository.save(vehicle);
  }
}

