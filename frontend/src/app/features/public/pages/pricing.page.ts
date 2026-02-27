import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PublicPricingService } from '../data/public-pricing.service';
import { EstimateBreakdown, VehicleClassApi } from '../data/public.models';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="heroSmall"><div class="container"><h1>Pricing</h1><p>Transparent fare logic with premium service standards.</p></div></section>
    <div class="container block">
      <div class="card p">
        <h3>How we calculate fares</h3>
        <p>Base fare + distance + time + optional add-ons + applicable fees/surge.</p>
      </div>
      <form class="card p" [formGroup]="form" (ngSubmit)="requestEstimate()">
        <h3>Estimate your trip</h3>
        <label class="fldLbl"><i class="bi bi-geo-alt"></i> Pickup</label>
        <input class="in" formControlName="pickup" placeholder="Pickup" />
        <label class="fldLbl"><i class="bi bi-sign-turn-right"></i> Drop-off</label>
        <input class="in" formControlName="dropoff" placeholder="Dropoff" />
        <label class="fldLbl"><i class="bi bi-calendar-date"></i> Pickup date and time</label>
        <input class="in" type="datetime-local" formControlName="pickupDateTime" />
        <label class="fldLbl"><i class="bi bi-truck"></i> Vehicle class</label>
        <select class="in" formControlName="vehicleClass">
          <option value="EXECUTIVE_SEDAN">Executive Sedan</option>
          <option value="LUXURY_SUV">Luxury SUV</option>
          <option value="VAN">Van</option>
          <option value="STRETCH_LIMO">Stretch Limo</option>
        </select>
        <button class="btn" type="submit" [disabled]="loading">{{ loading ? 'Calculating...' : 'Get Estimate' }}</button>
        <div class="price" *ngIf="estimate">Estimated: {{ estimate.total | currency:(estimate.currency || 'USD') }}</div>
        <small *ngIf="error" class="err">{{ error }}</small>
        <button class="btn secondary" type="button" (click)="continue()" [disabled]="form.invalid">Continue to Booking</button>
      </form>
    </div>
  `,
  styles: [`.heroSmall{ padding:60px 0 24px; background:linear-gradient(140deg,var(--color-ocean-900),var(--color-ocean-700)); color:#fff; } .block{ display:grid; gap:10px; margin-top:16px; } .p{ padding:14px; display:grid; gap:8px; } .fldLbl{ font-weight:800; font-size:13px; display:flex; align-items:center; gap:8px; color:var(--fg); } .price{ font-weight:900; } .err{ color:var(--danger); }`]
})
export class PricingPageComponent {
  private fb = inject(FormBuilder);
  private pricing = inject(PublicPricingService);
  private router = inject(Router);

  loading = false;
  error = '';
  estimate: EstimateBreakdown | null = null;

  form = this.fb.group({
    pickup: ['', Validators.required],
    dropoff: ['', Validators.required],
    pickupDateTime: ['', Validators.required],
    vehicleClass: ['EXECUTIVE_SEDAN' as VehicleClassApi, Validators.required],
  });

  requestEstimate() {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    this.loading = true;
    this.error = '';
    this.pricing.estimate({
      pickupAddress: v.pickup!,
      dropoffAddress: v.dropoff!,
      pickupDateTime: new Date(v.pickupDateTime!).toISOString(),
      vehicleClass: v.vehicleClass as VehicleClassApi,
      airportTransfer: String(v.pickup || '').toLowerCase().includes('airport') || String(v.dropoff || '').toLowerCase().includes('airport'),
      selectedAddons: []
    }).subscribe({
      next: (res) => { this.estimate = res; this.loading = false; },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Unable to calculate estimate right now.';
      }
    });
  }

  continue() {
    if (this.form.invalid) return;
    this.router.navigate(['/book'], { queryParams: this.form.value });
  }
}

