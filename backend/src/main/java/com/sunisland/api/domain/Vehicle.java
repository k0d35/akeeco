package com.sunisland.api.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "vehicles")
public class Vehicle {
  @Id
  private String id;
  @Indexed(unique = true)
  private String code;
  private VehicleClassType classType;
  private String name;
  private int seats;
  private int luggage;
  private List<String> amenities;
  private List<RecommendedForTag> recommendedFor;
  private boolean active;
  private String imageUrl;
  private Instant createdAt;
  @LastModifiedDate
  private Instant updatedAt;
}

