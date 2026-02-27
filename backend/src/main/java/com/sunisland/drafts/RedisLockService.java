package com.sunisland.drafts;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RedisLockService implements LockService {
  private final StringRedisTemplate redis;

  private static final long TTL_SECONDS = 120;

  private String key(String draftId) { return "locks:draft:" + draftId; }

  @Override
  public DraftLock status(String draftId) {
    String v = redis.opsForValue().get(key(draftId));
    if (v == null) return null;
    return fromValue(v, draftId);
  }

  @Override
  public DraftLock acquire(String draftId, String userId, String userName) {
    String token = UUID.randomUUID().toString();
    String value = token + "|" + userId + "|" + userName + "|" + Instant.now().toString();

    Boolean ok = redis.opsForValue().setIfAbsent(key(draftId), value, TTL_SECONDS, TimeUnit.SECONDS);
    if (Boolean.TRUE.equals(ok)) {
      return DraftLock.builder()
        .token(token)
        .userId(userId)
        .userName(userName)
        .acquiredAt(Instant.now().toString())
        .ttlSeconds((int) TTL_SECONDS)
        .build();
    }

    // Already locked
    String existing = redis.opsForValue().get(key(draftId));
    return fromValue(existing, draftId);
  }

  @Override
  public DraftLock renew(String draftId, String token) {
    String existing = redis.opsForValue().get(key(draftId));
    if (existing == null) throw new IllegalStateException("No lock");
    DraftLock lock = fromValue(existing, draftId);
    if (lock == null || lock.getToken() == null || !lock.getToken().equals(token)) {
      throw new IllegalStateException("Invalid token");
    }
    redis.expire(key(draftId), TTL_SECONDS, TimeUnit.SECONDS);
    lock.setTtlSeconds((int) TTL_SECONDS);
    return lock;
  }

  @Override
  public boolean release(String draftId, String token) {
    String existing = redis.opsForValue().get(key(draftId));
    if (existing == null) return true;
    DraftLock lock = fromValue(existing, draftId);
    if (lock == null || lock.getToken() == null || !lock.getToken().equals(token)) return false;
    redis.delete(key(draftId));
    return true;
  }

  @Override
  public boolean forceRelease(String draftId) {
    String existing = redis.opsForValue().get(key(draftId));
    if (existing == null) return true;
    redis.delete(key(draftId));
    return true;
  }

  private DraftLock fromValue(String value, String draftId) {
    if (value == null) return null;
    String[] parts = value.split("\\|", 4);
    if (parts.length < 4) return null;
    Long ttl = redis.getExpire(key(draftId));
    return DraftLock.builder()
      .token(parts[0])
      .userId(parts[1])
      .userName(parts[2])
      .acquiredAt(parts[3])
      .ttlSeconds(ttl == null ? null : ttl.intValue())
      .build();
  }
}
