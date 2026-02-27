import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { Booking, BookingStatus, StatusHistoryEntry } from './models';
import { environment } from '../../../../environments/environment';

interface ApiEnvelope<T> {
  data: T;
}

interface ApiBooking {
  id: string;
  status: BookingStatus;
  pickupAddress: string;
  dropoffAddress: string;
  pickupDateTime: string;
  airportTransfer: boolean;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notesToDriver?: string;
  vehicleClass?: string;
  assignedVehicleId?: string;
  assignedDriverId?: string;
  estimate?: { total?: number };
  finalTotal?: number;
  statusHistory?: Array<{ timestamp: string; fromStatus: BookingStatus | null; toStatus: BookingStatus; actor: string; note?: string }>;
  flightNumber?: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class BookingsService {
  private readonly baseUrl = `${environment.apiBaseUrl}/api/staff/bookings`;
  private subject = new BehaviorSubject<Booking[]>([]);
  bookings$ = this.subject.asObservable();
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  list(): Booking[] { return this.subject.value; }
  getById(id: string): Booking | undefined { return this.subject.value.find(b => b.id === id); }

  refresh(filters?: { status?: string; unassignedOnly?: boolean }) {
    this.loadingSubject.next(true);
    let params = new HttpParams();
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.unassignedOnly) params = params.set('unassignedOnly', 'true');
    this.http.get<ApiEnvelope<ApiBooking[]>>(this.baseUrl, { params }).pipe(
      map((res) => (res.data ?? []).map((b) => this.mapBooking(b))),
      tap((rows) => this.subject.next(rows)),
      catchError(() => {
        this.subject.next([]);
        return of([]);
      }),
      tap(() => this.loadingSubject.next(false))
    ).subscribe();
  }

  fetchById(id: string): Observable<Booking | null> {
    return this.http.get<ApiEnvelope<ApiBooking>>(`${this.baseUrl}/${id}`).pipe(
      map((res) => this.mapBooking(res.data)),
      tap((row) => {
        const rows = this.subject.value;
        const idx = rows.findIndex((r) => r.id === row.id);
        if (idx >= 0) {
          rows[idx] = row;
          this.subject.next([...rows]);
        } else {
          this.subject.next([row, ...rows]);
        }
      }),
      map((row) => row as Booking),
      catchError(() => of(null))
    );
  }

  assignDriverVehicle(id: string, driverId?: string, vehicleId?: string): Observable<boolean> {
    return this.http.patch<ApiEnvelope<ApiBooking>>(`${this.baseUrl}/${id}/assign`, {
      assignVehicleId: vehicleId || '',
      assignDriverId: driverId || null,
    }).pipe(
      map((res) => this.mapBooking(res.data)),
      tap((updated) => this.upsertCache(updated)),
      map(() => true),
      catchError(() => of(false))
    );
  }

  setStatus(id: string, next: BookingStatus, note?: string): Observable<boolean> {
    return this.http.patch<ApiEnvelope<ApiBooking>>(`${this.baseUrl}/${id}/status`, { status: next, note: note || null }).pipe(
      map((res) => this.mapBooking(res.data)),
      tap((updated) => this.upsertCache(updated)),
      map(() => true),
      catchError(() => of(false))
    );
  }

  addNote(id: string, note: string): Observable<boolean> {
    return this.http.post<ApiEnvelope<ApiBooking>>(`${this.baseUrl}/${id}/notes`, { note }).pipe(
      map((res) => this.mapBooking(res.data)),
      tap((updated) => this.upsertCache(updated)),
      map(() => true),
      catchError(() => of(false))
    );
  }

  addTag(id: string, tag: string): void {
    const b = this.getById(id);
    if (!b) return;
    const tags = Array.from(new Set([...(b.tags || []), tag]));
    this.upsertCache({ ...b, tags });
  }

  importPublicQueue(): number {
    // Backend-backed flow no longer uses a local public queue import.
    this.refresh();
    return 0;
  }

  private upsertCache(updated: Booking) {
    const rows = this.subject.value;
    const idx = rows.findIndex((r) => r.id === updated.id);
    if (idx >= 0) {
      rows[idx] = updated;
      this.subject.next([...rows]);
      return;
    }
    this.subject.next([updated, ...rows]);
  }

  private mapBooking(src: ApiBooking): Booking {
    const statusHistory: StatusHistoryEntry[] = (src.statusHistory || []).map((h) => ({
      timestamp: h.timestamp,
      user: h.actor,
      from: h.fromStatus,
      to: h.toStatus,
      note: h.note,
    }));
    return {
      id: src.id,
      createdAt: src.createdAt,
      updatedAt: src.updatedAt,
      customerName: `${src.firstName || ''} ${src.lastName || ''}`.trim() || 'Guest',
      email: src.email || '',
      phone: src.phone || '',
      serviceType: src.airportTransfer ? 'AIRPORT' : 'TOUR',
      pickupLocation: src.pickupAddress || '',
      dropoffLocation: src.dropoffAddress || '',
      pickupTime: src.pickupDateTime,
      flightNumber: src.flightNumber,
      passengers: 1,
      vehicleTypeRequested: src.vehicleClass || 'EXECUTIVE_SEDAN',
      assignedDriverId: src.assignedDriverId,
      assignedVehicleId: src.assignedVehicleId,
      estimatedPrice: src.estimate?.total,
      finalPrice: src.finalTotal,
      notes: src.notesToDriver,
      status: src.status,
      statusHistory,
      tags: [],
    };
  }
}
