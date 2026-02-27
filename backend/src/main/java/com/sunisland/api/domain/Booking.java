package com.sunisland.api.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "bookings")
public class Booking {
  @Id
  private String id;
  @Indexed(unique = true)
  private String confirmationCode;
  @JsonIgnore
  private String manageTokenHash;
  @Indexed
  private BookingStatus status;
  private String pickupAddress;
  private String dropoffAddress;
  private Double pickupLat;
  private Double pickupLng;
  private Double dropoffLat;
  private Double dropoffLng;
  @Indexed
  private OffsetDateTime pickupDateTime;
  private boolean roundTrip;
  private OffsetDateTime returnDateTime;
  private boolean airportTransfer;
  private String flightNumber;
  private String airline;
  private String terminal;
  private AirportDirection airportDirection;
  private String firstName;
  private String lastName;
  private String email;
  private String phone;
  private String whatsApp;
  private String notesToDriver;
  private VehicleClassType vehicleClass;
  private String assignedVehicleId;
  private String assignedDriverId;
  private BookingEstimate estimate;
  private List<SelectedAddon> selectedAddons;
  private BigDecimal finalTotal;
  private PaymentMode paymentMode;
  private String paymentTokenRef; // TODO: replace with payment intent/customer object when gateway is integrated.
  private PaymentStatus paymentStatus;
  private Instant createdAt;
  private Instant updatedAt;
  private List<StatusHistoryEntry> statusHistory;
  private List<BookingNote> staffNotes;
}
