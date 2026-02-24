import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FleetService } from '../data/fleet.service';
import { BookingsService } from '../data/bookings.service';
import { ToastService } from '../../../shared/ui/toast.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <ng-container *ngIf="vehicle as v">
      <div class="card p">
        <h3>{{ v.name }}</h3>
        <label>Type <input class="in" [(ngModel)]="v.type" /></label>
        <label>Seats <input class="in" type="number" [(ngModel)]="v.seats" /></label>
        <label>Luggage <input class="in" type="number" [(ngModel)]="v.luggage" /></label>
        <label>Maintenance
          <select class="in" [(ngModel)]="v.maintenanceStatus"><option>OK</option><option>NEEDS_SERVICE</option><option>IN_SERVICE</option></select>
        </label>
        <div class="row">
          <button class="btn" (click)="save()">Save</button>
          <button class="btn secondary" (click)="deactivate()">Deactivate</button>
        </div>
      </div>
      <div class="card p">
        <h3>Upcoming bookings using this vehicle</h3>
        <div *ngFor="let b of upcoming">{{ b.id }} • {{ b.customerName }} • {{ b.pickupTime | date:'short' }}</div>
      </div>
    </ng-container>
  `,
  styles: [`.p{ padding:12px; margin-bottom:10px; display:grid; gap:8px; } .row{ display:flex; gap:8px; }`]
})
export class StaffFleetDetailPageComponent {
  private route = inject(ActivatedRoute);
  private fleet = inject(FleetService);
  private bookings = inject(BookingsService);
  private toast = inject(ToastService);
  vehicle = this.fleet.getById(this.route.snapshot.paramMap.get('id') || '');
  upcoming = this.bookings.list().filter(b => b.assignedVehicleId === this.vehicle?.id);

  save() {
    if (!this.vehicle) return;
    this.fleet.update(this.vehicle.id, this.vehicle);
    this.toast.show('Vehicle updated.', 'success');
  }
  deactivate() {
    if (!this.vehicle) return;
    this.fleet.deactivate(this.vehicle.id);
    this.vehicle = this.fleet.getById(this.vehicle.id);
    this.toast.show('Vehicle deactivated.', 'info');
  }
}

