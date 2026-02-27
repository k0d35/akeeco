import { Component, Input } from '@angular/core';
import { Testimonial } from '../data/public.models';

@Component({
  standalone: true,
  selector: 'testimonial-card',
  template: `
    <article class="card t">
      <div class="stars">★★★★★</div>
      <p>"{{ item.quote }}"</p>
      <div class="who">{{ item.name }} • {{ item.location }}</div>
    </article>
  `,
  styles: [`.t{ padding:14px; } .stars{ color:#f59e0b; } p{ color:var(--color-text-600); } .who{ font-weight:800; }`]
})
export class TestimonialCardComponent {
  @Input({ required: true }) item!: Testimonial;
}

