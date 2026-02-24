import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'kpi-card',
  imports: [CommonModule],
  template: `
    <article class="card kpi">
      <div class="label">{{ label }}</div>
      <div class="value">{{ value }}</div>
    </article>
  `,
  styles: [`
    .kpi{ padding:14px; }
    .label{ font-size:12px; font-weight:800; color:var(--muted); }
    .value{ margin-top:6px; font-size:30px; font-weight:900; }
  `]
})
export class KpiCardComponent {
  @Input() label = '';
  @Input() value: string | number = 0;
}

