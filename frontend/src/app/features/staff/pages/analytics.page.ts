import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../data/analytics.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card p">
      <h3>Revenue</h3>
      <div *ngFor="let r of revenue">{{ r.label }}: {{ r.value | currency:'USD' }}</div>
    </div>
    <div class="card p">
      <h3>Trips by Service Type</h3>
      <div *ngFor="let r of breakdown">
        <div class="line"><span>{{ r.label }}</span><b>{{ r.value }}</b></div>
        <div class="bar"><span [style.width.%]="r.value * 18"></span></div>
      </div>
    </div>
  `,
  styles: [`.p{ padding:12px; margin-bottom:10px; } .line{ display:flex; justify-content:space-between; } .bar{ background:#eef2f7; height:8px; border-radius:999px; } .bar span{ display:block; height:100%; background:var(--gold); border-radius:999px;}`]
})
export class StaffAnalyticsPageComponent {
  private svc = inject(AnalyticsService);
  revenue = this.svc.revenueSeries();
  breakdown = this.svc.serviceTypeBreakdown();
}

