import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PublicBookingService } from '../data/public-booking.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="heroSmall"><div class="container"><h1>Manage Booking</h1><p>Use your confirmation code to review or update your booking.</p></div></section>
    <div class="container block">
      <div class="card p">
        <input class="in" [(ngModel)]="code" placeholder="Confirmation code" />
        <button class="btn" (click)="lookup()">Find Booking</button>
      </div>
      <div class="card p" *ngIf="booking; else noMatch">
        <h3>{{ booking.confirmationCode }} • {{ booking.status }}</h3>
        <p>{{ booking.pickupAddress }} → {{ booking.dropoffAddress }}</p>
        <label>Pickup Date <input class="in" type="date" [(ngModel)]="booking.pickupDate" /></label>
        <label>Pickup Time <input class="in" type="time" [(ngModel)]="booking.pickupTime" /></label>
        <div class="row">
          <button class="btn secondary" [disabled]="!canUpdatePickup()" (click)="update()">Update Pickup Time</button>
          <button class="btn" (click)="cancel()">Cancel Booking</button>
        </div>
        <small *ngIf="!canUpdatePickup()">Pickup time changes are available only more than 4 hours before pickup.</small>
        <p>Need help? <a href="https://wa.me/18765550132">WhatsApp Support</a></p>
      </div>
      <ng-template #noMatch><div class="card p muted">No booking loaded yet.</div></ng-template>
    </div>
  `,
  styles: [`.heroSmall{ padding:52px 0 22px; background:linear-gradient(140deg,var(--color-ocean-900),var(--color-ocean-700)); color:#fff; } .block{ margin-top:14px; display:grid; gap:10px; } .p{ padding:14px; display:grid; gap:8px; } .row{ display:flex; gap:8px; flex-wrap:wrap; } .muted{ color:var(--color-text-600); }`]
})
export class ManageBookingPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private svc = inject(PublicBookingService);
  code = '';
  booking = this.svc.list()[0];

  ngOnInit(): void {
    const c = this.route.snapshot.queryParamMap.get('code');
    if (c) { this.code = c; this.lookup(); }
  }
  lookup() { this.booking = this.svc.getByConfirmation(this.code) as any; }
  update() { if (this.booking) this.svc.updatePickupTime(this.booking.confirmationCode, this.booking.pickupDate, this.booking.pickupTime); }
  cancel() { if (this.booking) { this.svc.cancel(this.booking.confirmationCode); this.lookup(); } }
  canUpdatePickup(): boolean {
    if (!this.booking) return false;
    const when = new Date(`${this.booking.pickupDate}T${this.booking.pickupTime}:00`).getTime();
    return when - Date.now() > 4 * 60 * 60 * 1000;
  }
}
