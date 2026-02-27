import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PublicPricingService } from '../data/public-pricing.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="heroSmall"><div class="container"><h1>Pricing</h1><p>Transparent fare logic with premium service standards.</p></div></section>
    <div class="container block">
      <div class="card p">
        <h3>How we calculate fares</h3>
        <p>Base fare + distance + time + optional add-ons.</p>
        <p>Airport pickup note: flight tracking and grace waiting policy apply.</p>
      </div>
      <div class="card p">
        <h3>Vehicle Class Pricing (Mock)</h3>
        <table class="tbl"><tr><th>Class</th><th>Base</th><th>Per KM</th><th>Per Min</th></tr><tr><td>Executive Sedan</td><td>$35</td><td>$4.50</td><td>$0.55</td></tr><tr><td>Luxury SUV</td><td>$47</td><td>$6.10</td><td>$0.74</td></tr><tr><td>Van</td><td>$56</td><td>$7.20</td><td>$0.88</td></tr><tr><td>Stretch Limo</td><td>$84</td><td>$10.8</td><td>$1.32</td></tr></table>
      </div>
      <form class="card p" [formGroup]="form" (ngSubmit)="continue()">
        <h3>Estimate your trip</h3>
        <label class="fldLbl"><i class="bi bi-geo-alt"></i> Pickup</label>
        <input class="in" formControlName="pickup" placeholder="Pickup" />
        <label class="fldLbl"><i class="bi bi-sign-turn-right"></i> Drop-off</label>
        <input class="in" formControlName="dropoff" placeholder="Dropoff" />
        <label class="fldLbl"><i class="bi bi-calendar-date"></i> Pickup date and time</label>
        <input class="in" type="datetime-local" formControlName="pickupDateTime" />
        <label class="fldLbl"><i class="bi bi-truck"></i> Vehicle class</label>
        <select class="in" formControlName="vehicleClass"><option value="SEDAN">Executive Sedan</option><option value="SUV">Luxury SUV</option><option value="VAN">Van</option><option value="LIMO">Stretch Limo</option></select>
        <div class="price">Estimated: {{ estimate.total | currency:'USD' }}</div>
        <button class="btn" type="submit">Continue to Booking</button>
      </form>
    </div>
  `,
  styles: [`.heroSmall{ padding:60px 0 24px; background:linear-gradient(140deg,var(--color-ocean-900),var(--color-ocean-700)); color:#fff; } .block{ display:grid; gap:10px; margin-top:16px; } .p{ padding:14px; display:grid; gap:8px; } .fldLbl{ font-weight:800; font-size:13px; display:flex; align-items:center; gap:8px; color:var(--fg); } .tbl{ width:100%; border-collapse:collapse; } th,td{ border-top:1px solid var(--border); padding:8px; text-align:left; } th{ border-top:none; } .price{ font-weight:900; }`]
})
export class PricingPageComponent {
  private fb = inject(FormBuilder);
  private pricing = inject(PublicPricingService);
  private router = inject(Router);

  form = this.fb.group({
    pickup: ['', Validators.required],
    dropoff: ['', Validators.required],
    pickupDateTime: ['', Validators.required],
    vehicleClass: ['SEDAN', Validators.required],
  });

  get estimate() {
    return this.pricing.computeEstimate({
      vehicleClass: this.form.value.vehicleClass || 'SEDAN',
      distanceKm: 14,
      durationMin: 30,
      airportTransfer: String(this.form.value.pickup || '').toLowerCase().includes('airport') || String(this.form.value.dropoff || '').toLowerCase().includes('airport'),
      addOns: [],
    });
  }

  continue() {
    if (this.form.invalid) return;
    this.router.navigate(['/book'], { queryParams: this.form.value });
  }
}
