import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'wiz-nav',
  template: `
    <div class="nav">
      <div class="left">
        <button class="btn secondary" (click)="saveExit.emit()">Save as draft</button>
      </div>

      <div class="mid">
        <div class="bar"><div class="fill" [style.width.%]="progressPercent"></div></div>
        <div class="hint" [class.ready]="stepReady">{{ progressHint }}</div>
      </div>

      <div class="right">
        <button class="btn secondary" [disabled]="!canBack" (click)="back.emit()">Back</button>
        <button class="btn" [class.ready]="canNext" *ngIf="!isLastStep" [disabled]="!canNext" (click)="next.emit()">Next</button>
        <button class="btn gold" [class.ready]="canSubmit" *ngIf="isLastStep" [disabled]="!canSubmit" (click)="submit.emit()">Submit Trip</button>
      </div>
    </div>

    <div class="block" *ngIf="blockedMessage">{{ blockedMessage }}</div>
  `,
  styles: [`
    .nav{ display:grid; grid-template-columns: 1fr 1.2fr 1fr; gap: 12px; align-items:center; }
    .mid{ text-align:center; }
    .bar{ height:10px; background:#F1F2F4; border-radius:999px; overflow:hidden; }
    .fill{ height:100%; background: var(--gold); }
    .hint{ margin-top:6px; color: var(--muted); font-size: 12px; font-weight:700; }
    .hint.ready{ color: var(--ok); }
    .left{ display:flex; justify-content:flex-start; }
    .right{ display:flex; justify-content:flex-end; gap:10px; }
    .btn.ready{ background:#fff; border-color: var(--ok); color: var(--ok); }
    .block{ margin-top: 10px; color: var(--danger); font-weight:900; }

    @media (max-width: 900px){
      .nav{ grid-template-columns: 1fr; gap:10px; }
      .mid{ order: -1; text-align:left; }
      .left, .right{ justify-content:flex-start; flex-wrap:wrap; }
    }

    @media (max-width: 640px){
      .right{ display:grid; grid-template-columns: repeat(2, minmax(0, 1fr)); width:100%; gap:8px; }
      .left{ width:100%; }
      .left .btn{ width:100%; }
      .right .btn{ width:100%; }
      .hint{ font-size:11px; }
    }
  `]
})
export class WizardNavComponent {
  @Input() progressPercent = 0;
  @Input() progressHint = '';
  @Input() stepReady = false;
  @Input() blockedMessage: string | null = null;

  @Input() canBack = true;
  @Input() canNext = true;
  @Input() canSubmit = false;
  @Input() isLastStep = false;

  @Output() saveExit = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();
}
