import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingsService } from '../data/bookings.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card p">
      <h3>Dispatch Day Timeline</h3>
      <label>Date <input class="in" type="date" [(ngModel)]="date" /></label>
      <div class="row" *ngFor="let b of rows()">
        <div>{{ b.pickupTime | date:'shortTime' }}</div>
        <div><b>{{ b.customerName }}</b> • {{ b.pickupLocation }} → {{ b.dropoffLocation }}</div>
      </div>
    </div>
  `,
  styles: [`.p{ padding:12px; } .row{ display:grid; grid-template-columns:90px 1fr; gap:10px; border-top:1px solid var(--border); padding:8px 0; }`]
})
export class StaffDispatchCalendarPageComponent {
  private svc = inject(BookingsService);
  date = new Date().toISOString().slice(0, 10);
  rows() { return this.svc.list().filter(b => b.pickupTime.slice(0, 10) === this.date).sort((a, b) => a.pickupTime.localeCompare(b.pickupTime)); }
}

