import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingsService } from '../data/bookings.service';
import { StatusPillComponent } from '../../../shared/ui/status-pill.component';
import { ToastService } from '../../../shared/ui/toast.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, StatusPillComponent],
  template: `
    <div class="card filters">
      <input class="in" [(ngModel)]="q" placeholder="Search customer / phone / booking id" />
      <select class="in" [(ngModel)]="status">
        <option value="">All Statuses</option>
        <option *ngFor="let s of statuses" [value]="s">{{ s }}</option>
      </select>
      <label><input type="checkbox" [(ngModel)]="unassignedOnly" /> Unassigned only</label>
      <label><input type="checkbox" [(ngModel)]="vipOnly" /> VIP tag</label>
    </div>
    <div class="card tableWrap" tabindex="0" aria-label="Bookings table">
      <table class="tbl">
        <thead><tr><th>ID</th><th>Pickup</th><th>Customer</th><th>Service</th><th>Pickup → Dropoff</th><th>Vehicle</th><th>Driver</th><th>Status</th><th>Price</th><th>Actions</th></tr></thead>
        <tbody>
          <tr *ngFor="let b of filtered()">
            <td>{{ b.id }}</td>
            <td>{{ b.pickupTime | date:'short' }}</td>
            <td>{{ b.customerName }}</td>
            <td>{{ b.serviceType }}</td>
            <td>{{ b.pickupLocation }} → {{ b.dropoffLocation }}</td>
            <td>{{ b.assignedVehicleId || '—' }}</td>
            <td>{{ b.assignedDriverId || '—' }}</td>
            <td><status-pill [value]="b.status"></status-pill></td>
            <td>{{ b.finalPrice ?? b.estimatedPrice ?? 0 | currency:'USD' }}</td>
            <td><button class="btn secondary" (click)="view(b.id)">View</button></td>
          </tr>
        </tbody>
      </table>
      <div class="empty" *ngIf="filtered().length===0">No bookings found.</div>
    </div>
    <div class="bulk">
      <button class="btn secondary" (click)="bulk('assign')">Bulk Assign</button>
      <button class="btn secondary" (click)="bulk('confirm')">Bulk Confirm</button>
      <button class="btn" (click)="bulk('cancel')">Bulk Cancel</button>
    </div>
  `,
  styles: [`
    .filters{ padding:10px; display:flex; gap:8px; flex-wrap:wrap; align-items:center; }
    .tableWrap{ margin-top:10px; overflow:auto; }
    .tbl{ width:100%; border-collapse:collapse; min-width:1100px; }
    th,td{ padding:10px; border-top:1px solid var(--border); text-align:left; }
    th{ border-top:none; font-size:12px; color:var(--muted); }
    .bulk{ margin-top:10px; display:flex; gap:8px; }
    .empty{ padding:12px; color:var(--muted); }
  `]
})
export class StaffBookingsPageComponent {
  private svc = inject(BookingsService);
  private router = inject(Router);
  private toast = inject(ToastService);

  q = '';
  status = '';
  unassignedOnly = false;
  vipOnly = false;
  statuses = ['REQUESTED', 'CONFIRMED', 'ASSIGNED', 'EN_ROUTE', 'ARRIVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW'];

  filtered() {
    return this.svc.list().filter((b) => {
      if (this.status && b.status !== this.status) return false;
      if (this.unassignedOnly && (b.assignedDriverId && b.assignedVehicleId)) return false;
      if (this.vipOnly && !b.tags.includes('VIP')) return false;
      if (!this.q.trim()) return true;
      const q = this.q.toLowerCase();
      return [b.id, b.customerName, b.phone].join(' ').toLowerCase().includes(q);
    });
  }

  view(id: string) { this.router.navigate(['/staff/bookings', id]); }
  bulk(action: string) { this.toast.show(`${action} executed (mock).`, 'info'); }
}

