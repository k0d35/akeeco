import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FleetVehicle } from './models';
import { genId, loadLocal, saveLocal } from './storage.util';

const KEY = 'staff_fleet_v1';

const SEED: FleetVehicle[] = [
  { id: 'veh-1', name: 'Mercedes S-Class #12', type: 'SEDAN', seats: 3, luggage: 2, features: ['WiFi', 'Water'], active: true, maintenanceStatus: 'OK', lastServiceDate: '2026-01-08', imageUrl: 'https://placehold.co/600x360' },
  { id: 'veh-2', name: 'Cadillac Escalade #4', type: 'SUV', seats: 6, luggage: 5, features: ['Child Seat', 'WiFi'], active: true, maintenanceStatus: 'OK', lastServiceDate: '2026-01-14', imageUrl: 'https://placehold.co/600x360' },
  { id: 'veh-3', name: 'Executive Sprinter #2', type: 'VAN', seats: 10, luggage: 10, features: ['Cooler', 'USB Charging'], active: true, maintenanceStatus: 'NEEDS_SERVICE', lastServiceDate: '2025-11-20', imageUrl: 'https://placehold.co/600x360' },
];

@Injectable({ providedIn: 'root' })
export class FleetService {
  private subject = new BehaviorSubject<FleetVehicle[]>(loadLocal(KEY, SEED));
  list$ = this.subject.asObservable();

  list(): FleetVehicle[] { return this.subject.value; }
  getById(id: string): FleetVehicle | undefined { return this.subject.value.find(v => v.id === id); }

  create(input: Omit<FleetVehicle, 'id'>): FleetVehicle {
    const next = { ...input, id: genId('veh') };
    const rows = [next, ...this.subject.value];
    this.persist(rows);
    // TODO: Replace with POST /api/fleet
    return next;
  }

  update(id: string, patch: Partial<FleetVehicle>): void {
    const rows = this.subject.value.map(v => v.id === id ? { ...v, ...patch } : v);
    this.persist(rows);
    // TODO: Replace with PATCH /api/fleet/{id}
  }

  deactivate(id: string): void {
    this.update(id, { active: false });
    // TODO: Replace with POST /api/fleet/{id}/deactivate
  }

  private persist(rows: FleetVehicle[]): void {
    this.subject.next(rows);
    saveLocal(KEY, rows);
  }
}

