import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'date-range-picker',
  imports: [CommonModule, FormsModule],
  template: `
    <label class="wrap">
      <span>From</span>
      <input class="in" type="date" [(ngModel)]="from" (ngModelChange)="emit()" />
    </label>
    <label class="wrap">
      <span>To</span>
      <input class="in" type="date" [(ngModel)]="to" (ngModelChange)="emit()" />
    </label>
  `,
  styles: [`.wrap{ display:grid; gap:4px; font-size:12px; color:var(--muted); }`]
})
export class DateRangePickerComponent {
  @Input() from = '';
  @Input() to = '';
  @Output() changed = new EventEmitter<{ from: string; to: string }>();
  emit() { this.changed.emit({ from: this.from, to: this.to }); }
}

