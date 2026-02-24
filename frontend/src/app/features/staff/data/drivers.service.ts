import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Driver } from './models';
import { genId, loadLocal, saveLocal } from './storage.util';

const KEY = 'staff_drivers_v1';

const SEED: Driver[] = [
  { id: 'drv-1', name: 'Andre Williams', phone: '(876) 312-1044', email: 'andre@company.com', role: 'DRIVER', status: 'ACTIVE', availability: true, assignedVehicleId: 'veh-1', licenseExpiry: '2027-04-30' },
  { id: 'drv-2', name: 'Marlon Brown', phone: '(876) 779-0064', email: 'marlon@company.com', role: 'DRIVER', status: 'ON_TRIP', availability: true, assignedVehicleId: 'veh-2', licenseExpiry: '2026-12-01' },
  { id: 'drv-3', name: 'Kenroy Smith', phone: '(876) 519-2002', email: 'kenroy@company.com', role: 'DRIVER', status: 'OFF_DUTY', availability: false, assignedVehicleId: 'veh-3', licenseExpiry: '2028-02-10' },
];

@Injectable({ providedIn: 'root' })
export class DriversService {
  private subject = new BehaviorSubject<Driver[]>(loadLocal(KEY, SEED));
  list$ = this.subject.asObservable();

  list(): Driver[] { return this.subject.value; }
  getById(id: string): Driver | undefined { return this.subject.value.find(d => d.id === id); }

  create(input: Omit<Driver, 'id' | 'role'>): Driver {
    const next: Driver = { ...input, id: genId('drv'), role: 'DRIVER' };
    const rows = [next, ...this.subject.value];
    this.persist(rows);
    // TODO: Replace with POST /api/drivers
    return next;
  }

  update(id: string, patch: Partial<Driver>): void {
    const rows = this.subject.value.map(d => d.id === id ? { ...d, ...patch } : d);
    this.persist(rows);
    // TODO: Replace with PATCH /api/drivers/{id}
  }

  setAvailability(id: string, availability: boolean): void {
    this.update(id, {
      availability,
      status: availability ? 'ACTIVE' : 'OFF_DUTY',
    });
    // TODO: Replace with PATCH /api/drivers/{id}/availability
  }

  private persist(rows: Driver[]): void {
    this.subject.next(rows);
    saveLocal(KEY, rows);
  }
}

