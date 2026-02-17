export interface DraftLockDto {
  token?: string | null;
  userId?: string | null;
  userName?: string | null;
  acquiredAt?: string | null;
  ttlSeconds?: number | null;
}

export const GQL_LOCK_STATUS = `
query LockStatus($draftId: ID!) {
  draftLockStatus(draftId: $draftId) { token userId userName acquiredAt ttlSeconds }
}
`;

export const GQL_LOCK_ACQUIRE = `
mutation Acquire($draftId: ID!) {
  acquireDraftLock(draftId: $draftId) { token userId userName acquiredAt ttlSeconds }
}
`;

export const GQL_LOCK_RENEW = `
mutation Renew($draftId: ID!, $token: String!) {
  renewDraftLock(draftId: $draftId, token: $token) { token userId userName acquiredAt ttlSeconds }
}
`;

export const GQL_LOCK_RELEASE = `
mutation Release($draftId: ID!, $token: String!) {
  releaseDraftLock(draftId: $draftId, token: $token)
}
`;
