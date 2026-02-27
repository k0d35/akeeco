import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaqItem } from '../data/public.models';

@Component({
  standalone: true,
  selector: 'faq-accordion',
  imports: [CommonModule],
  template: `
    <details *ngFor="let f of items" class="card faq">
      <summary>{{ f.q }}</summary>
      <p>{{ f.a }}</p>
    </details>
  `,
  styles: [`.faq{ padding:12px; margin-bottom:8px; } summary{ font-weight:800; cursor:pointer; } p{ color:var(--color-text-600); }`]
})
export class FaqAccordionComponent {
  @Input() items: FaqItem[] = [];
}

