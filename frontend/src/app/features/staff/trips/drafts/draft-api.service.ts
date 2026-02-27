import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { GraphqlClient } from '../../../../core/api/graphql-client.service';
import {
  DraftStatus,
  TripDraftDto,
  GQL_CREATE_DRAFT,
  GQL_SAVE_DRAFT,
  GQL_LIST_MINE,
  GQL_LIST_ALL,
  GQL_GET_DRAFT,
  GQL_DELETE_DRAFT,
  GQL_SUBMIT_DRAFT,
  GQL_SEARCH_DRAFTS,
} from './drafts.gql';

@Injectable({ providedIn: 'root' })
export class DraftApiService {
  private gql = inject(GraphqlClient);

  create(shared = false): Observable<TripDraftDto> {
    return this.gql.request<{ createTripDraft: TripDraftDto }>(GQL_CREATE_DRAFT, { input: { shared } })
      .pipe(map(r => r.createTripDraft));
  }

  get(id: string): Observable<TripDraftDto> {
    return this.gql.request<{ tripDraft: TripDraftDto }>(GQL_GET_DRAFT, { id })
      .pipe(map(r => r.tripDraft));
  }

  save(id: string, expectedVersion: number | null | undefined, formValue: any): Observable<TripDraftDto> {
    return this.gql.request<{ saveTripDraft: TripDraftDto }>(GQL_SAVE_DRAFT, { input: { id, expectedVersion, formValue } })
      .pipe(map(r => r.saveTripDraft));
  }

  listMine(status: DraftStatus = 'ACTIVE'): Observable<TripDraftDto[]> {
    return this.gql.request<{ tripDraftsMine: TripDraftDto[] }>(GQL_LIST_MINE, { status })
      .pipe(map(r => r.tripDraftsMine ?? []));
  }

  listAll(status: DraftStatus = 'ACTIVE'): Observable<TripDraftDto[]> {
    return this.gql.request<{ tripDraftsAll: TripDraftDto[] }>(GQL_LIST_ALL, { status })
      .pipe(map(r => r.tripDraftsAll ?? []));
  }

  search(args: { status: DraftStatus; name?: string | null; phone?: string | null; pickup?: string | null }): Observable<TripDraftDto[]> {
    return this.gql.request<{ tripDraftSearch: TripDraftDto[] }>(GQL_SEARCH_DRAFTS, args)
      .pipe(map(r => r.tripDraftSearch ?? []));
  }

  delete(id: string): Observable<boolean> {
    return this.gql.request<{ deleteTripDraft: boolean }>(GQL_DELETE_DRAFT, { id })
      .pipe(map(r => !!r.deleteTripDraft));
  }

  submit(id: string): Observable<boolean> {
    return this.gql.request<{ submitTripDraft: boolean }>(GQL_SUBMIT_DRAFT, { id })
      .pipe(map(r => !!r.submitTripDraft));
  }
}
