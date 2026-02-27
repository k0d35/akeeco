import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiEnvelope, PublicBooking, VehicleClassApi } from './public.models';

const DRAFT_KEY = 'public_booking_draft';

type AddonCode = 'EXTRA_STOP' | 'CHILD_SEAT' | 'MEET_GREET' | 'LUGGAGE_ASSIST' | 'WAITING_BUFFER';

export interface CreateBookingPayload {
  pickupAddress: string;
  dropoffAddress: string;
  pickupDateTime: string;
  roundTrip: boolean;
  returnDateTime?: string;
  airportTransfer: boolean;
  flightNumber?: string;
  airline?: string;
  terminal?: string;
  airportDirection?: 'ARRIVING' | 'DEPARTING';
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  whatsApp?: string;
  notesToDriver?: string;
  vehicleClass: VehicleClassApi;
  selectedAddons: Array<{ addonCode: AddonCode; quantity: number }>;
  paymentMode: 'PAY_NOW' | 'PAY_ON_ARRIVAL';
  paymentTokenRef?: string;
}

export interface UpdateBookingTimePayload {
  confirmationCode: string;
  token: string;
  newPickupDateTime: string;
  newReturnDateTime?: string;
}

export interface CancelBookingPayload {
  confirmationCode: string;
  token: string;
  reason?: string;
}

@Injectable({ providedIn: 'root' })
export class PublicBookingService {
  private readonly baseUrl = `${environment.apiBaseUrl}/api/public`;

  constructor(private readonly http: HttpClient) {}

  saveDraft(v: unknown): void {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(v));
  }

  loadDraft<T = unknown>(): T | null {
    try {
      return JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null') as T | null;
    } catch {
      return null;
    }
  }

  clearDraft(): void {
    localStorage.removeItem(DRAFT_KEY);
  }

  create(payload: CreateBookingPayload): Observable<PublicBooking> {
    return this.http.post<ApiEnvelope<PublicBooking>>(`${this.baseUrl}/bookings`, payload).pipe(
      map((res) => res.data)
    );
  }

  getByManageToken(code: string, token: string): Observable<PublicBooking> {
    return this.http.get<ApiEnvelope<PublicBooking>>(`${this.baseUrl}/bookings/manage`, {
      params: { code, token }
    }).pipe(map((res) => res.data));
  }

  updatePickupTime(payload: UpdateBookingTimePayload): Observable<PublicBooking> {
    return this.http.patch<ApiEnvelope<PublicBooking>>(`${this.baseUrl}/bookings/manage/time`, payload).pipe(
      map((res) => res.data)
    );
  }

  cancel(payload: CancelBookingPayload): Observable<PublicBooking> {
    return this.http.post<ApiEnvelope<PublicBooking>>(`${this.baseUrl}/bookings/manage/cancel`, payload).pipe(
      map((res) => res.data)
    );
  }
}

