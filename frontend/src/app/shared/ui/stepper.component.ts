import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface StepperStep {
  key: string;
  label: string;
  route: string;
  optional?: boolean;
  complete?: boolean;
}

@Component({
  standalone: true,
  selector: 'ui-stepper',
  imports: [CommonModule],
  template: `
    <nav class="stepper">
      <div class="step"
           *ngFor="let s of steps"
           [class.active]="s.key===activeKey"
           [class.complete]="s.complete"
           (click)="stepClick.emit(s)">
        <div class="left">
          <div class="dot"></div>
          <div>
            <div class="label">{{ s.label }} <span class="opt" *ngIf="s.optional">optional</span></div>
          </div>
        </div>
        <div class="right">
          <span class="chk" *ngIf="s.complete">✓</span>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .stepper{ background:#fff; border:1px solid var(--border); border-radius: 14px; padding:10px; display:grid; gap:6px; }
    .step{ padding:10px; border-radius: 12px; border:1px solid transparent; cursor:pointer;
           display:flex; justify-content: space-between; align-items:center; }
    .step:hover{ border-color: var(--border); }
    .step.active{ border-color: var(--gold); background: var(--gold-weak); }
    .step.complete .dot{ background: var(--gold); }
    .left{ display:flex; gap:10px; align-items:flex-start; }
    .dot{ width:10px; height:10px; border-radius:999px; background: var(--fg); margin-top:6px; }
    .label{ font-weight: 900; }
    .opt{ margin-left: 8px; font-size:11px; color: var(--muted); font-weight:800; }
    .chk{ font-weight: 900; }

    @media (max-width: 640px){
      .step{ padding:9px; }
      .label{ font-size:14px; }
      .opt{ display:block; margin-left:0; margin-top:2px; }
    }
  `]
})
export class StepperComponent {
  @Input({ required: true }) steps: StepperStep[] = [];
  @Input({ required: true }) activeKey = '';
  @Output() stepClick = new EventEmitter<StepperStep>();
}
