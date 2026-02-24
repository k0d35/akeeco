import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DriversService } from '../data/drivers.service';
import { FleetService } from '../data/fleet.service';
import { BookingsService } from '../data/bookings.service';
import { ToastService } from '../../../shared/ui/toast.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <ng-container *ngIf="driver as d">
      <div class="card p">
        <h3>{{ d.name }}</h3>
        <label>Phone <input class="in" [(ngModel)]="d.phone" /></label>
        <label>Email <input class="in" [(ngModel)]="d.email" /></label>
        <label>Assigned Vehicle
          <select class="in" [(ngModel)]="d.assignedVehicleId"><option value="">None</option><option *ngFor="let v of fleet" [value]="v.id">{{ v.name }}</option></select>
        </label>
        <label>Notes <textarea class="in" [(ngModel)]="d.notes"></textarea></label>
        <button class="btn" (click)="save()">Save</button>
      </div>
      <div class="card p">
        <h3>Upcoming jobs</h3>
        <div *ngFor="let b of jobs">{{ b.id }} • {{ b.pickupTime | date:'short' }} • {{ b.pickupLocation }}</div>
      </div>
    </ng-container>
  `,
  styles: [`.p{ padding:12px; margin-bottom:10px; display:grid; gap:8px; }`]
})
export class StaffDriverDetailPageComponent {
  private route = inject(ActivatedRoute);
  private drivers = inject(DriversService);
  private bookings = inject(BookingsService);
  private toast = inject(ToastService);
  fleet = inject(FleetService).list();
  driver = this.drivers.getById(this.route.snapshot.paramMap.get('id') || '');
  jobs = this.bookings.list().filter(b => b.assignedDriverId === this.driver?.id);

  save() {
    if (!this.driver) return;
    this.drivers.update(this.driver.id, this.driver);
    this.toast.show('Driver updated.', 'success');
  }
}

