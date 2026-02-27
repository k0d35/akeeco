package com.sunisland.drafts;

import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.*;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.Map;

@Controller
@RequiredArgsConstructor
public class DraftGraphqlController {

  private final DraftRepositoryInMemory repo;
  private final LockService lockService;

  // Queries
  @QueryMapping
  public TripDraft tripDraft(@Argument String id) {
    return repo.get(id).orElse(null);
  }

  @QueryMapping
  public List<TripDraft> tripDraftsMine(@Argument DraftStatus status) {
    // demo: no real auth; return all
    return repo.list(status);
  }

  @QueryMapping
  public List<TripDraft> tripDraftsAll(@Argument DraftStatus status) {
    return repo.list(status);
  }

  @QueryMapping
  public List<TripDraft> tripDraftSearch(@Argument DraftStatus status,
                                        @Argument String name,
                                        @Argument String phone,
                                        @Argument String pickup) {
    return repo.search(status, name, phone, pickup);
  }

  // Mutations
  @MutationMapping
  public TripDraft createTripDraft(@Argument("input") Map<String, Object> input) {
    boolean shared = Boolean.TRUE.equals(input.get("shared"));
    return repo.create(shared);
  }

  @MutationMapping
  public TripDraft saveTripDraft(@Argument("input") Map<String, Object> input) {
    String id = (String) input.get("id");
    Integer expectedVersion = input.get("expectedVersion") == null ? null : Integer.valueOf(String.valueOf(input.get("expectedVersion")));
    @SuppressWarnings("unchecked")
    Map<String, Object> formValue = (Map<String, Object>) input.get("formValue");
    return repo.save(id, expectedVersion, formValue);
  }

  @MutationMapping
  public boolean deleteTripDraft(@Argument String id) { return repo.delete(id); }

  @MutationMapping
  public boolean submitTripDraft(@Argument String id) { return repo.submit(id); }

  // Locks
  @QueryMapping
  public DraftLock draftLockStatus(@Argument String draftId) { return lockService.status(draftId); }

  @MutationMapping
  public DraftLock acquireDraftLock(@Argument String draftId,
                                    @Argument String userId,
                                    @Argument String userName) {
    return lockService.acquire(draftId, userId, userName);
  }

  @MutationMapping
  public DraftLock renewDraftLock(@Argument String draftId, @Argument String token) { return lockService.renew(draftId, token); }

  @MutationMapping
  public boolean releaseDraftLock(@Argument String draftId, @Argument String token) { return lockService.release(draftId, token); }

  @MutationMapping
  public boolean forceReleaseDraftLock(@Argument String draftId) { return lockService.forceRelease(draftId); }
}
