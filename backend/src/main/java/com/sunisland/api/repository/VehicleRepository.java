package com.sunisland.api.repository;

import com.sunisland.api.domain.Vehicle;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface VehicleRepository extends MongoRepository<Vehicle, String> {
  Optional<Vehicle> findByCode(String code);
  List<Vehicle> findByActiveTrue();
}

