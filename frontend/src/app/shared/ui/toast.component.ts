import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';

@Component({
  standalone: true,
  selector: 'app-toast',
  imports: [CommonModule],
  template: `
    <div class="wrap" aria-live="polite" aria-label="Notifications">
      <div class="toast" *ngFor="let t of svc.toasts$ | async" [class.ok]="t.kind==='success'" [class.err]="t.kind==='error'">
        <span>{{ t.text }}</span>
        <button type="button" (click)="svc.dismiss(t.id)" aria-label="Dismiss">×</button>
      </div>
    </div>
  `,
  styles: [`
    .wrap{ position:fixed; right:16px; top:16px; z-index:1000; display:grid; gap:8px; width:min(360px, 90vw); }
    .toast{ display:flex; justify-content:space-between; align-items:center; gap:10px; border:1px solid var(--border); background:#fff; border-radius:10px; padding:10px 12px; box-shadow:0 8px 24px rgba(0,0,0,.1); }
    .toast.ok{ border-color: rgba(22,163,74,.4); }
    .toast.err{ border-color: rgba(185,28,28,.4); }
    button{ border:0; background:transparent; font-size:18px; line-height:1; cursor:pointer; }
  `]
})
export class ToastComponent {
  svc = inject(ToastService);
}

