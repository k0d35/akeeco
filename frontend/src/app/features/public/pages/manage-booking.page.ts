import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PublicBookingService } from '../data/public-booking.service';
import { PublicBooking } from '../data/public.models';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="heroSmall"><div class="container"><h1>Manage Booking</h1><p>Use your confirmation code and secure token.</p></div></section>
    <div class="container block">
      <div class="card p">
        <input class="in" [(ngModel)]="code" placeholder="Confirmation code" />
        <input class="in" [(ngModel)]="token" placeholder="Manage token" />
        <button class="btn" (click)="lookup()" [disabled]="loading">{{ loading ? 'Loading...' : 'Find Booking' }}</button>
        <small *ngIf="error" class="err">{{ error }}</small>
      </div>
      <div class="card p" *ngIf="booking; else noMatch">
        <h3>{{ booking.confirmationCode }} - {{ booking.status }}</h3>
        <p>{{ booking.pickupAddress }} -> {{ booking.dropoffAddress }}</p>
        <label>Pickup Date <input class="in" type="date" [(ngModel)]="pickupDate" /></label>
        <label>Pickup Time <input class="in" type="time" [(ngModel)]="pickupTime" /></label>
        <div class="row">
          <button class="btn secondary" [disabled]="loading || !canUpdatePickup()" (click)="update()">Update Pickup Time</button>
          <button class="btn" [disabled]="loading || booking.status === 'CANCELLED'" (click)="cancel()">Cancel Booking</button>
        </div>
        <small *ngIf="!canUpdatePickup()">Pickup changes are blocked close to pickup based on policy window.</small>
        <small *ngIf="message">{{ message }}</small>
      </div>
      <ng-template #noMatch><div class="card p muted">No booking loaded yet.</div></ng-template>
    </div>
  `,
  styles: [`.heroSmall{ padding:52px 0 22px; background:linear-gradient(140deg,var(--color-ocean-900),var(--color-ocean-700)); color:#fff; } .block{ margin-top:14px; display:grid; gap:10px; } .p{ padding:14px; display:grid; gap:8px; } .row{ display:flex; gap:8px; flex-wrap:wrap; } .muted{ color:var(--color-text-600); } .err{ color:var(--danger); }`]
})
export class ManageBookingPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private svc = inject(PublicBookingService);

  code = '';
  token = '';
  booking: PublicBooking | null = null;
  pickupDate = '';
  pickupTime = '';
  loading = false;
  error = '';
  message = '';

  ngOnInit(): void {
    const c = this.route.snapshot.queryParamMap.get('code');
    const t = this.route.snapshot.queryParamMap.get('token');
    if (c) this.code = c;
    if (t) this.token = t;
    if (this.code && this.token) this.lookup();
  }

  lookup() {
    this.error = '';
    this.message = '';
    this.loading = true;
    this.svc.getByManageToken(this.code.trim(), this.token.trim()).subscribe({
      next: (booking) => {
        this.booking = booking;
        const dt = new Date(booking.pickupDateTime);
        this.pickupDate = dt.toISOString().slice(0, 10);
        this.pickupTime = dt.toISOString().slice(11, 16);
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.booking = null;
        this.error = err?.error?.message || 'Booking not found for that code/token.';
      }
    });
  }

  update() {
    if (!this.booking) return;
    this.error = '';
    this.message = '';
    this.loading = true;
    this.svc.updatePickupTime({
      confirmationCode: this.booking.confirmationCode,
      token: this.token.trim(),
      newPickupDateTime: new Date(`${this.pickupDate}T${this.pickupTime}:00`).toISOString(),
    }).subscribe({
      next: (booking) => {
        this.booking = booking;
        this.loading = false;
        this.message = 'Pickup time updated.';
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Unable to update pickup time.';
      }
    });
  }

  cancel() {
    if (!this.booking) return;
    this.error = '';
    this.message = '';
    this.loading = true;
    this.svc.cancel({
      confirmationCode: this.booking.confirmationCode,
      token: this.token.trim(),
      reason: 'Cancelled by guest from manage page'
    }).subscribe({
      next: (booking) => {
        this.booking = booking;
        this.loading = false;
        this.message = 'Booking cancelled.';
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Unable to cancel booking.';
      }
    });
  }

  canUpdatePickup(): boolean {
    if (!this.booking) return false;
    const when = new Date(this.booking.pickupDateTime).getTime();
    return when - Date.now() > 6 * 60 * 60 * 1000;
  }
}

