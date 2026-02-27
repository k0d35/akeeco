import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { GraphqlClient } from '../../../../core/api/graphql-client.service';
import { DraftLockDto, GQL_LOCK_ACQUIRE, GQL_LOCK_FORCE_RELEASE, GQL_LOCK_RENEW, GQL_LOCK_RELEASE, GQL_LOCK_STATUS } from './draft-lock.gql';

@Injectable({ providedIn: 'root' })
export class DraftLockApiService {
  private gql = inject(GraphqlClient);

  status(draftId: string): Observable<DraftLockDto | null> {
    return this.gql.request<{ draftLockStatus: DraftLockDto | null }>(GQL_LOCK_STATUS, { draftId })
      .pipe(map(r => r.draftLockStatus));
  }
  acquire(draftId: string, userId: string, userName: string): Observable<DraftLockDto> {
    return this.gql.request<{ acquireDraftLock: DraftLockDto }>(GQL_LOCK_ACQUIRE, { draftId, userId, userName })
      .pipe(map(r => r.acquireDraftLock));
  }
  renew(draftId: string, token: string): Observable<DraftLockDto> {
    return this.gql.request<{ renewDraftLock: DraftLockDto }>(GQL_LOCK_RENEW, { draftId, token })
      .pipe(map(r => r.renewDraftLock));
  }
  release(draftId: string, token: string): Observable<boolean> {
    return this.gql.request<{ releaseDraftLock: boolean }>(GQL_LOCK_RELEASE, { draftId, token })
      .pipe(map(r => !!r.releaseDraftLock));
  }

  forceRelease(draftId: string): Observable<boolean> {
    return this.gql.request<{ forceReleaseDraftLock: boolean }>(GQL_LOCK_FORCE_RELEASE, { draftId })
      .pipe(map(r => !!r.forceReleaseDraftLock));
  }
}
