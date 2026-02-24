import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Booking, BookingStatus, StatusHistoryEntry } from './models';
import { genId, loadLocal, saveLocal } from './storage.util';
import { AuthService } from '../../../shared-data/auth/auth.service';

const KEY = 'staff_bookings_v1';
const PUBLIC_QUEUE_KEY = 'public_bookings_queue';

const now = Date.now();
const hoursFromNow = (h: number) => new Date(now + h * 60 * 60 * 1000).toISOString();

const SEED: Booking[] = [
  {
    id: 'BK-1001', createdAt: hoursFromNow(-4), updatedAt: hoursFromNow(-1),
    customerName: 'Daniel Thompson', email: 'daniel@example.com', phone: '(876) 554-9012',
    serviceType: 'AIRPORT', pickupLocation: 'MBJ Airport Terminal 2', dropoffLocation: 'Half Moon Resort',
    pickupTime: hoursFromNow(2), passengers: 2, luggage: 3, vehicleTypeRequested: 'SUV',
    assignedDriverId: 'drv-2', assignedVehicleId: 'veh-2', estimatedPrice: 128, finalPrice: 128,
    notes: 'VIP arrival. Meet at arrivals gate.', status: 'ASSIGNED',
    statusHistory: [{ timestamp: hoursFromNow(-2), user: 'Dispatch Lead', from: 'CONFIRMED', to: 'ASSIGNED' }],
    tags: ['VIP'],
  },
  {
    id: 'BK-1002', createdAt: hoursFromNow(-6), updatedAt: hoursFromNow(-3),
    customerName: 'Monique Campbell', email: 'monique@example.com', phone: '(876) 311-0440',
    serviceType: 'EVENT', pickupLocation: 'S Hotel Montego Bay', dropoffLocation: 'Montego Bay Convention Centre',
    pickupTime: hoursFromNow(4), passengers: 3, luggage: 1, vehicleTypeRequested: 'SEDAN',
    estimatedPrice: 64, notes: 'Wedding guest transfer.', status: 'CONFIRMED',
    statusHistory: [{ timestamp: hoursFromNow(-3), user: 'Dispatch Lead', from: 'REQUESTED', to: 'CONFIRMED' }],
    tags: ['LATE_NIGHT'],
  },
  {
    id: 'BK-1003', createdAt: hoursFromNow(-1), updatedAt: hoursFromNow(-1),
    customerName: 'Acme Corporate', email: 'ops@acme.com', phone: '(876) 601-2100',
    serviceType: 'CORPORATE', pickupLocation: 'Hilton Rose Hall', dropoffLocation: 'Sangster Intl. Airport',
    pickupTime: hoursFromNow(10), passengers: 1, vehicleTypeRequested: 'SEDAN',
    estimatedPrice: 74, status: 'REQUESTED', statusHistory: [], tags: [],
  },
];

@Injectable({ providedIn: 'root' })
export class BookingsService {
  private subject = new BehaviorSubject<Booking[]>(loadLocal(KEY, SEED));
  bookings$ = this.subject.asObservable();

  constructor(private auth: AuthService) {
    this.importPublicQueue();
  }

  list(): Booking[] { return this.subject.value; }
  getById(id: string): Booking | undefined { return this.subject.value.find(b => b.id === id); }

  create(input: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'>): Booking {
    const next: Booking = {
      ...input,
      id: `BK-${Math.floor(Math.random() * 9000 + 1000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statusHistory: [],
    };
    this.persist([next, ...this.subject.value]);
    // TODO: Replace with POST /api/bookings
    return next;
  }

  update(id: string, patch: Partial<Booking>): void {
    const rows = this.subject.value.map(b => b.id === id ? { ...b, ...patch, updatedAt: new Date().toISOString() } : b);
    this.persist(rows);
    // TODO: Replace with PATCH /api/bookings/{id}
  }

  assignDriverVehicle(id: string, driverId?: string, vehicleId?: string): void {
    this.update(id, { assignedDriverId: driverId, assignedVehicleId: vehicleId, status: 'ASSIGNED' });
    this.setStatus(id, 'ASSIGNED', 'Assignment updated');
    // TODO: Replace with PATCH /api/bookings/{id}/assignment
  }

  setStatus(id: string, next: BookingStatus, note?: string): void {
    const rows = this.subject.value.map((b) => {
      if (b.id !== id) return b;
      const entry: StatusHistoryEntry = {
        timestamp: new Date().toISOString(),
        user: this.auth.user().name,
        from: b.status,
        to: next,
        note,
      };
      return { ...b, status: next, updatedAt: new Date().toISOString(), statusHistory: [entry, ...b.statusHistory] };
    });
    this.persist(rows);
    // TODO: Replace with PATCH /api/bookings/{id}/status
  }

  addNote(id: string, note: string): void {
    const b = this.getById(id);
    if (!b) return;
    this.update(id, { notes: [b.notes || '', note].filter(Boolean).join('\n') });
    // TODO: Replace with POST /api/bookings/{id}/notes
  }

  addTag(id: string, tag: string): void {
    const b = this.getById(id);
    if (!b) return;
    const tags = Array.from(new Set([...(b.tags || []), tag]));
    this.update(id, { tags });
    // TODO: Replace with POST /api/bookings/{id}/tags
  }

  importPublicQueue(): number {
    const raw = loadLocal<any[]>(PUBLIC_QUEUE_KEY, []);
    if (!raw.length) return 0;
    const imported = raw.map((q, i) => ({
      id: q.id || `BK-PUB-${i + 1}`,
      createdAt: q.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customerName: q.customerName || 'Public Website Request',
      email: q.email || '',
      phone: q.phone || '',
      serviceType: q.serviceType || 'AIRPORT',
      pickupLocation: q.pickup || q.pickupLocation || '',
      dropoffLocation: q.dropoff || q.dropoffLocation || '',
      pickupTime: q.pickupTime || new Date().toISOString(),
      passengers: Number(q.passengers || 1),
      luggage: Number(q.luggage || 0),
      vehicleTypeRequested: q.vehicleTypeRequested || 'SEDAN',
      estimatedPrice: q.estimatedPrice,
      finalPrice: q.finalPrice,
      notes: q.notes || 'Imported from public website queue.',
      status: 'REQUESTED' as BookingStatus,
      statusHistory: [],
      tags: ['WEBSITE'],
    })) as Booking[];

    this.persist([...imported, ...this.subject.value]);
    localStorage.removeItem(PUBLIC_QUEUE_KEY);
    return imported.length;
  }

  private persist(rows: Booking[]): void {
    this.subject.next(rows);
    saveLocal(KEY, rows);
  }
}

