import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingsService } from '../data/bookings.service';
import { AuthService } from '../../../shared-data/auth/auth.service';
import { DriversService } from '../data/drivers.service';
import { ToastService } from '../../../shared/ui/toast.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card p">
      <h3>My Jobs</h3>
      <label><input type="checkbox" [checked]="available" (change)="setAvailability($event)" /> On Duty</label>
    </div>
    <article class="card p" *ngFor="let j of jobs">
      <h4>{{ j.pickupTime | date:'shortTime' }} • {{ j.customerName }}</h4>
      <div>{{ j.pickupLocation }} → {{ j.dropoffLocation }}</div>
      <div>{{ j.notes }}</div>
      <div class="row">
        <button class="btn secondary" (click)="status(j.id,'ASSIGNED')">Accept</button>
        <button class="btn secondary" (click)="status(j.id,'EN_ROUTE')">En Route</button>
        <button class="btn secondary" (click)="status(j.id,'ARRIVED')">Arrived</button>
        <button class="btn gold" (click)="status(j.id,'COMPLETED')">Completed</button>
      </div>
    </article>
  `,
  styles: [`.p{ padding:12px; margin-bottom:10px; } .row{ margin-top:8px; display:flex; gap:8px; flex-wrap:wrap; }`]
})
export class StaffMyJobsPageComponent {
  private auth = inject(AuthService);
  private bookings = inject(BookingsService);
  private drivers = inject(DriversService);
  private toast = inject(ToastService);
  private me = this.auth.user();

  jobs = this.bookings.list().filter(b => b.assignedDriverId === this.me.id || this.me.role === 'DRIVER');
  get available() { return !!this.drivers.getById(this.me.id)?.availability; }

  setAvailability(e: Event) {
    const on = (e.target as HTMLInputElement).checked;
    this.drivers.setAvailability(this.me.id, on);
    this.toast.show(`Availability ${on ? 'enabled' : 'disabled'}.`, 'info');
  }
  status(id: string, s: any) { this.bookings.setStatus(id, s); this.toast.show(`Job ${id} marked ${s}.`, 'success'); }
}

