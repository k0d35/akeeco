import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnalyticsService } from '../data/analytics.service';
import { BookingsService } from '../data/bookings.service';
import { DriversService } from '../data/drivers.service';
import { KpiCardComponent } from '../../../shared/ui/kpi-card.component';
import { ToastService } from '../../../shared/ui/toast.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, KpiCardComponent],
  template: `
    <section class="kpis">
      <kpi-card label="New Requests (Today)" [value]="k.newRequests"></kpi-card>
      <kpi-card label="Upcoming (24h)" [value]="k.upcoming24h"></kpi-card>
      <kpi-card label="Unassigned" [value]="k.unassigned"></kpi-card>
      <kpi-card label="Active Trips" [value]="k.activeTrips"></kpi-card>
      <kpi-card label="Completed Today" [value]="k.completedToday"></kpi-card>
      <kpi-card label="Cancelled Today" [value]="k.cancelledToday"></kpi-card>
    </section>
    <section class="row">
      <article class="card p">
        <h3>Next Pickups</h3>
        <div *ngFor="let b of nextPickups">{{ b.pickupTime | date:'shortTime' }} • {{ b.customerName }} • {{ b.pickupLocation }}</div>
      </article>
      <article class="card p">
        <h3>Unassigned Queue</h3>
        <div *ngFor="let b of unassigned">{{ b.id }} • {{ b.customerName }}</div>
      </article>
      <article class="card p">
        <h3>Drivers On Duty</h3>
        <div *ngFor="let d of onDuty">{{ d.name }} • {{ d.status }}</div>
      </article>
    </section>
    <section class="actions">
      <a class="btn" routerLink="/staff/bookings">Create Booking</a>
      <button class="btn secondary" type="button" (click)="assignNext()">Assign Next</button>
      <button class="btn secondary" type="button" (click)="sync()">Sync Public Queue</button>
      <button class="btn gold" type="button" (click)="exportToday()">Export Today</button>
    </section>
  `,
  styles: [`
    .kpis{ display:grid; gap:10px; grid-template-columns:repeat(6,minmax(0,1fr)); }
    .row{ margin-top:12px; display:grid; gap:10px; grid-template-columns:repeat(3,minmax(0,1fr)); }
    .p{ padding:12px; display:grid; gap:6px; }
    .actions{ margin-top:12px; display:flex; gap:8px; flex-wrap:wrap; }
    @media (max-width:1100px){ .kpis{ grid-template-columns:repeat(3,1fr);} .row{ grid-template-columns:1fr; } }
  `]
})
export class StaffDashboardPageComponent {
  private analytics = inject(AnalyticsService);
  private bookingsService = inject(BookingsService);
  private driversService = inject(DriversService);
  private toast = inject(ToastService);

  k = this.analytics.computeKpis();
  nextPickups = this.bookingsService.list().sort((a, b) => a.pickupTime.localeCompare(b.pickupTime)).slice(0, 8);
  unassigned = this.bookingsService.list().filter(b => !b.assignedDriverId || !b.assignedVehicleId).slice(0, 8);
  onDuty = this.driversService.list().filter(d => d.availability);

  assignNext() { this.toast.show('Bulk assign assistant is mock-only in this build.', 'info'); }
  exportToday() { this.toast.show('Export generated (mock).', 'success'); }
  sync() {
    const n = this.bookingsService.importPublicQueue();
    this.toast.show(n ? `Imported ${n} public bookings.` : 'No public bookings to import.', 'info');
  }
}

