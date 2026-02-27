package com.sunisland.api.repository;

import com.sunisland.api.domain.Booking;
import com.sunisland.api.domain.BookingStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends MongoRepository<Booking, String> {
  Optional<Booking> findByConfirmationCode(String confirmationCode);
  boolean existsByConfirmationCode(String confirmationCode);
  List<Booking> findByPickupDateTimeBetween(OffsetDateTime from, OffsetDateTime to);
  List<Booking> findByStatus(BookingStatus status);
}

