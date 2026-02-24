import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PricingRulesService } from '../data/pricing-rules.service';
import { ToastService } from '../../../shared/ui/toast.service';
import { AuthService } from '../../../shared-data/auth/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card p">
      <h3>Pricing Rules</h3>
      <label>Base Fare <input class="in" type="number" [(ngModel)]="rules.baseFare" [disabled]="readonly" /></label>
      <label>Per KM <input class="in" type="number" [(ngModel)]="rules.perKm" [disabled]="readonly" /></label>
      <label>Per Minute <input class="in" type="number" [(ngModel)]="rules.perMinute" [disabled]="readonly" /></label>
      <label>Airport Fee <input class="in" type="number" [(ngModel)]="rules.airportFee" [disabled]="readonly" /></label>
      <button class="btn" [disabled]="readonly" (click)="save()">Save</button>
    </div>
    <div class="card p">
      <h3>Test Estimate</h3>
      <label>Distance KM <input class="in" type="number" [(ngModel)]="distance" /></label>
      <label>Minutes <input class="in" type="number" [(ngModel)]="minutes" /></label>
      <label>Vehicle
        <select class="in" [(ngModel)]="vehicle"><option>SEDAN</option><option>SUV</option><option>VAN</option></select>
      </label>
      <div><b>Estimate:</b> {{ estimate() | currency:'USD' }}</div>
    </div>
  `,
  styles: [`.p{ padding:12px; margin-bottom:10px; display:grid; gap:8px; }`]
})
export class StaffPricingPageComponent {
  private svc = inject(PricingRulesService);
  private toast = inject(ToastService);
  private auth = inject(AuthService);
  readonly = this.auth.user().role === 'DRIVER';
  rules = { ...this.svc.getRules() };
  distance = 12;
  minutes = 24;
  vehicle = 'SEDAN';

  save() { this.svc.updateRules(this.rules); this.toast.show('Pricing rules updated.', 'success'); }
  estimate() { return this.svc.computeEstimate(this.distance, this.minutes, this.vehicle); }
}

