import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'si-steps',
  imports: [CommonModule],
  template: `
    <div class="steps">
      <article *ngFor="let s of steps; let i = index" class="card step">
        <span class="idx">{{ i + 1 }}</span>
        <h3>{{ s.title }}</h3>
        <p>{{ s.text }}</p>
      </article>
    </div>
  `,
  styles: [`.steps{ display:grid; gap:10px; grid-template-columns:repeat(3, minmax(0,1fr)); } .step{ padding:14px; } .idx{ display:inline-flex; width:28px; height:28px; border-radius:999px; align-items:center; justify-content:center; background:var(--color-ocean-700); color:#fff; font-weight:900; } h3{ margin:8px 0 4px; } p{ margin:0; color:var(--color-text-600);} @media (max-width:900px){ .steps{ grid-template-columns:1fr; }}`]
})
export class StepsComponent {
  @Input() steps: Array<{ title: string; text: string }> = [];
}

