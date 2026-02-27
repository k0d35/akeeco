package com.sunisland.drafts;

public interface LockService {
  DraftLock status(String draftId);
  DraftLock acquire(String draftId, String userId, String userName);
  DraftLock renew(String draftId, String token);
  boolean release(String draftId, String token);
  boolean forceRelease(String draftId);
}
