import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'confirm-dialog',
  imports: [CommonModule],
  template: `
    <div class="backdrop" *ngIf="open" (click)="cancel.emit()">
      <div class="dialog card" (click)="$event.stopPropagation()" role="dialog" aria-modal="true" aria-label="Confirm action">
        <h3>{{ title }}</h3>
        <p>{{ message }}</p>
        <div class="actions">
          <button class="btn secondary" type="button" (click)="cancel.emit()">Cancel</button>
          <button class="btn" type="button" (click)="confirm.emit()">Confirm</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .backdrop{ position:fixed; inset:0; background:rgba(15,23,42,.35); display:grid; place-items:center; z-index:900; }
    .dialog{ width:min(480px, 90vw); padding:16px; }
    h3{ margin:0 0 8px; }
    p{ margin:0; color:var(--muted); }
    .actions{ margin-top:14px; display:flex; justify-content:flex-end; gap:8px; }
  `]
})
export class ConfirmDialogComponent {
  @Input() open = false;
  @Input() title = 'Confirm';
  @Input() message = 'Are you sure?';
  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();
}

