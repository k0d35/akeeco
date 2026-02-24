import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingsService } from '../data/bookings.service';
import { BookingStatus } from '../data/models';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="board">
      <section class="col card" *ngFor="let s of statuses">
        <h3>{{ s }}</h3>
        <article class="item" *ngFor="let b of byStatus(s)">
          <div><b>{{ b.customerName }}</b> • {{ b.pickupTime | date:'shortTime' }}</div>
          <div>{{ b.pickupLocation }} → {{ b.dropoffLocation }}</div>
          <div class="row">
            <button class="btn secondary" type="button" (click)="advance(b.id, s)">Move →</button>
          </div>
        </article>
      </section>
    </div>
  `,
  styles: [`
    .board{ display:grid; gap:8px; grid-template-columns:repeat(7,minmax(220px,1fr)); overflow:auto; }
    .col{ padding:10px; min-height:300px; }
    .item{ border:1px solid var(--border); border-radius:10px; padding:8px; margin-bottom:8px; background:#fff; }
    .row{ margin-top:6px; }
  `]
})
export class StaffDispatchBoardPageComponent {
  private svc = inject(BookingsService);
  statuses: BookingStatus[] = ['REQUESTED', 'CONFIRMED', 'ASSIGNED', 'EN_ROUTE', 'ARRIVED', 'COMPLETED', 'CANCELLED'];

  byStatus(status: BookingStatus) { return this.svc.list().filter(b => b.status === status); }
  advance(id: string, status: BookingStatus) {
    const i = this.statuses.indexOf(status);
    const next = this.statuses[Math.min(this.statuses.length - 1, i + 1)];
    this.svc.setStatus(id, next);
  }
}

