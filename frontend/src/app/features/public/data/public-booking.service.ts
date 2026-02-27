import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PublicBooking } from './public.models';

const BOOKINGS_KEY = 'bookings';
const QUEUE_KEY = 'public_bookings_queue';
const DRAFT_KEY = 'public_booking_draft';

@Injectable({ providedIn: 'root' })
export class PublicBookingService {
  private subject = new BehaviorSubject<PublicBooking[]>(this.loadBookings());
  bookings$ = this.subject.asObservable();

  list(): PublicBooking[] { return this.subject.value; }

  saveDraft(v: any): void {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(v));
  }

  loadDraft<T = any>(): T | null {
    try { return JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null') as T | null; } catch { return null; }
  }

  clearDraft(): void { localStorage.removeItem(DRAFT_KEY); }

  create(payload: Omit<PublicBooking, 'id' | 'confirmationCode' | 'createdAt' | 'status'>): PublicBooking {
    const next: PublicBooking = {
      ...payload,
      id: `PUB-${Math.floor(100000 + Math.random() * 900000)}`,
      confirmationCode: Math.random().toString(36).slice(2, 8).toUpperCase(),
      createdAt: new Date().toISOString(),
      status: 'CONFIRMED',
    };
    const rows = [next, ...this.subject.value];
    this.subject.next(rows);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(rows));
    this.pushToStaffQueue(next);
    this.clearDraft();
    // TODO: Replace with POST /api/public/bookings
    return next;
  }

  getByConfirmation(code: string): PublicBooking | undefined {
    const q = code.trim().toUpperCase();
    return this.subject.value.find(b => b.confirmationCode === q);
    // TODO: Replace with GET /api/public/bookings/manage?code=
  }

  updatePickupTime(code: string, pickupDate: string, pickupTime: string): boolean {
    let changed = false;
    const rows = this.subject.value.map((b) => {
      if (b.confirmationCode !== code.trim().toUpperCase()) return b;
      changed = true;
      return { ...b, pickupDate, pickupTime };
    });
    if (!changed) return false;
    this.subject.next(rows);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(rows));
    // TODO: Replace with PATCH /api/public/bookings/{confirmationCode}/pickup-time
    return true;
  }

  cancel(code: string): boolean {
    let changed = false;
    const rows = this.subject.value.map((b) => {
      if (b.confirmationCode !== code.trim().toUpperCase()) return b;
      changed = true;
      return { ...b, status: 'CANCELLED' as const };
    });
    if (!changed) return false;
    this.subject.next(rows);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(rows));
    // TODO: Replace with PATCH /api/public/bookings/{confirmationCode}/cancel
    return true;
  }

  private loadBookings(): PublicBooking[] {
    try { return JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]') as PublicBooking[]; } catch { return []; }
  }

  private pushToStaffQueue(booking: PublicBooking): void {
    const queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]') as any[];
    queue.push({
      id: booking.id,
      createdAt: booking.createdAt,
      customerName: `${booking.firstName} ${booking.lastName}`.trim(),
      email: booking.email,
      phone: booking.phone,
      serviceType: booking.airportTransfer ? 'AIRPORT' : 'TOUR',
      pickupLocation: booking.pickupAddress,
      dropoffLocation: booking.dropoffAddress,
      pickupTime: `${booking.pickupDate}T${booking.pickupTime}:00`,
      passengers: 1,
      luggage: 0,
      vehicleTypeRequested: booking.vehicleClass,
      estimatedPrice: booking.estimate,
      notes: booking.notes || '',
    });
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  }
}

