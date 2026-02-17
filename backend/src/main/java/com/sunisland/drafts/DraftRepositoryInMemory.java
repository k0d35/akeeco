package com.sunisland.drafts;

import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Repository
public class DraftRepositoryInMemory {
  private final Map<String, TripDraft> store = new ConcurrentHashMap<>();

  public TripDraft create(boolean shared) {
    String id = "D" + UUID.randomUUID().toString().replace("-", "").substring(0, 10).toUpperCase();
    Instant now = Instant.now();
    TripDraft d = TripDraft.builder()
      .id(id)
      .shared(shared)
      .status(DraftStatus.ACTIVE)
      .version(1)
      .createdAt(now)
      .updatedAt(now)
      .formValue(new HashMap<>())
      .build();
    store.put(id, d);
    return d;
  }

  public Optional<TripDraft> get(String id) { return Optional.ofNullable(store.get(id)); }

  public List<TripDraft> list(DraftStatus status) {
    return store.values().stream()
      .filter(d -> d.getStatus() == status)
      .sorted(Comparator.comparing(TripDraft::getUpdatedAt).reversed())
      .collect(Collectors.toList());
  }

  public List<TripDraft> search(DraftStatus status, String name, String phone, String pickup) {
    String n = name == null ? null : name.toLowerCase();
    String p = phone == null ? null : phone.toLowerCase();
    String pk = pickup == null ? null : pickup.toLowerCase();
    return store.values().stream()
      .filter(d -> d.getStatus() == status)
      .filter(d -> n == null || (d.getCustomerName() != null && d.getCustomerName().toLowerCase().contains(n)))
      .filter(d -> p == null || (d.getCustomerPhone() != null && d.getCustomerPhone().toLowerCase().contains(p)))
      .filter(d -> pk == null || (d.getPickupText() != null && d.getPickupText().toLowerCase().contains(pk)))
      .sorted(Comparator.comparing(TripDraft::getUpdatedAt).reversed())
      .collect(Collectors.toList());
  }

  public TripDraft save(String id, Integer expectedVersion, Map<String, Object> formValue) {
    TripDraft existing = store.get(id);
    if (existing == null) throw new NoSuchElementException("Draft not found");

    // Simple optimistic concurrency
    if (expectedVersion != null && existing.getVersion() != null && !expectedVersion.equals(existing.getVersion())) {
      throw new DraftConflictException("Version conflict: expected " + expectedVersion + " but found " + existing.getVersion());
    }

    existing.setFormValue(formValue);
    existing.setUpdatedAt(Instant.now());
    existing.setVersion((existing.getVersion() == null ? 0 : existing.getVersion()) + 1);

    // convenience summary fields
    Map<String, Object> cust = valueMap(formValue, "customer");
    Map<String, Object> pickup = valueMap(formValue, "pickup");
    Map<String, Object> sched = valueMap(formValue, "schedule");

    existing.setCustomerName(join(
      str(cust.get("firstName")),
      str(cust.get("lastName"))
    ).trim());
    existing.setCustomerPhone(str(cust.get("phone")));
    existing.setPickupText(str(pickup.get("formatted")));
    existing.setPickupDate(str(sched.get("pickupDate")));
    existing.setPickupTime(str(sched.get("pickupTime")));

    return existing;
  }

  public boolean delete(String id) { return store.remove(id) != null; }

  public boolean submit(String id) {
    TripDraft d = store.get(id);
    if (d == null) return false;
    d.setStatus(DraftStatus.SUBMITTED);
    d.setUpdatedAt(Instant.now());
    d.setVersion((d.getVersion() == null ? 0 : d.getVersion()) + 1);
    return true;
  }

  private static Map<String, Object> valueMap(Map<String, Object> root, String key) {
    Object v = root == null ? null : root.get(key);
    if (v instanceof Map<?, ?>) {
      @SuppressWarnings("unchecked")
      Map<String, Object> mm = (Map<String, Object>) v;
      return mm;
    }
    return new HashMap<>();
  }

  private static String str(Object o) { return o == null ? null : String.valueOf(o); }
  private static String join(String a, String b) { return (a == null ? "" : a) + " " + (b == null ? "" : b); }
}
