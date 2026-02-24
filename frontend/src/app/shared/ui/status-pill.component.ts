import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'status-pill',
  imports: [CommonModule],
  template: `<span class="pill" [class]="klass">{{ value }}</span>`,
  styles: [`
    .pill{ display:inline-block; padding:4px 10px; border-radius:999px; font-size:11px; font-weight:900; border:1px solid var(--border); background:#fff; }
    .green{ color:#166534; border-color:#86efac; background:#f0fdf4; }
    .amber{ color:#92400e; border-color:#fcd34d; background:#fffbeb; }
    .blue{ color:#1e40af; border-color:#93c5fd; background:#eff6ff; }
    .red{ color:#991b1b; border-color:#fca5a5; background:#fef2f2; }
    .gray{ color:#374151; }
  `]
})
export class StatusPillComponent {
  @Input() value = '';

  get klass(): string {
    const v = this.value.toUpperCase();
    if (['COMPLETED', 'ACTIVE'].includes(v)) return 'green';
    if (['REQUESTED', 'CONFIRMED', 'ARRIVED', 'IN_PROGRESS'].includes(v)) return 'amber';
    if (['ASSIGNED', 'EN_ROUTE'].includes(v)) return 'blue';
    if (['CANCELLED', 'NO_SHOW', 'IN_SERVICE'].includes(v)) return 'red';
    return 'gray';
  }
}

