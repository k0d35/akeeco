import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-timeline',
  imports: [CommonModule],
  template: `
    <ul class="tl">
      <li *ngFor="let i of items">
        <div class="dot"></div>
        <div class="content">
          <div class="line"><b>{{ i.title }}</b> <span>{{ i.time }}</span></div>
          <div class="sub" *ngIf="i.subtitle">{{ i.subtitle }}</div>
        </div>
      </li>
    </ul>
  `,
  styles: [`
    .tl{ list-style:none; margin:0; padding:0; display:grid; gap:10px; }
    li{ display:grid; grid-template-columns:16px 1fr; gap:10px; align-items:start; }
    .dot{ width:10px; height:10px; border-radius:999px; background:var(--gold); margin-top:4px; }
    .line{ display:flex; justify-content:space-between; gap:8px; }
    .line span{ color:var(--muted); font-size:12px; }
    .sub{ margin-top:3px; color:var(--muted); font-size:12px; }
  `]
})
export class TimelineComponent {
  @Input() items: Array<{ title: string; time: string; subtitle?: string }> = [];
}

