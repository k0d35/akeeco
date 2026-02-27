package com.sunisland.api.service;

import com.sunisland.api.domain.BookingStatus;
import com.sunisland.api.exception.ConflictException;
import org.springframework.stereotype.Service;

import java.util.EnumMap;
import java.util.EnumSet;
import java.util.Map;
import java.util.Set;

@Service
public class BookingStatusTransitionService {
  private final Map<BookingStatus, Set<BookingStatus>> allowed = new EnumMap<>(BookingStatus.class);

  public BookingStatusTransitionService() {
    allowed.put(BookingStatus.REQUESTED, EnumSet.of(BookingStatus.CONFIRMED, BookingStatus.CANCELLED));
    allowed.put(BookingStatus.CONFIRMED, EnumSet.of(BookingStatus.ASSIGNED, BookingStatus.CANCELLED));
    allowed.put(BookingStatus.ASSIGNED, EnumSet.of(BookingStatus.EN_ROUTE, BookingStatus.CANCELLED));
    allowed.put(BookingStatus.EN_ROUTE, EnumSet.of(BookingStatus.ARRIVED));
    allowed.put(BookingStatus.ARRIVED, EnumSet.of(BookingStatus.COMPLETED, BookingStatus.NO_SHOW));
    allowed.put(BookingStatus.COMPLETED, EnumSet.noneOf(BookingStatus.class));
    allowed.put(BookingStatus.CANCELLED, EnumSet.noneOf(BookingStatus.class));
    allowed.put(BookingStatus.NO_SHOW, EnumSet.noneOf(BookingStatus.class));
  }

  public void assertTransition(BookingStatus from, BookingStatus to) {
    if (from == to) {
      return;
    }
    if (!allowed.getOrDefault(from, Set.of()).contains(to)) {
      throw new ConflictException("Invalid status transition from " + from + " to " + to);
    }
  }
}

