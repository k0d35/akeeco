import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'si-hero',
  imports: [CommonModule],
  template: `
    <section class="hero">
      <div class="overlay"></div>
      <div class="container inner">
        <div class="copy">
          <h1>{{ title }}</h1>
          <p>{{ subtitle }}</p>
          <div class="actions"><ng-content select="[hero-actions]"></ng-content></div>
        </div>
        <div class="media card">
          <div class="ph">Premium Visual Placeholder</div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero{ position:relative; background:linear-gradient(140deg, var(--color-ocean-900), var(--color-ocean-700) 45%, var(--color-ocean-500)); color:#fff; padding:110px 0 72px; overflow:hidden; }
    .overlay{ position:absolute; inset:0; background:radial-gradient(circle at top right, rgba(255,193,7,.22), transparent 40%); }
    .inner{ position:relative; display:grid; gap:22px; grid-template-columns:1.15fr .85fr; align-items:center; }
    h1{ margin:0; font-size:clamp(32px, 5vw, 56px); line-height:1.1; font-family: 'Playfair Display', Georgia, serif; }
    p{ margin:12px 0 0; font-size:18px; color:rgba(255,255,255,.92); max-width:640px; }
    .actions{ margin-top:20px; display:flex; gap:10px; flex-wrap:wrap; }
    .media{ border-radius:16px; min-height:280px; display:grid; place-items:center; background:rgba(255,255,255,.2); }
    .ph{ font-weight:800; color:#e2e8f0; }
    @media (max-width:900px){ .inner{ grid-template-columns:1fr; } }
  `]
})
export class HeroComponent {
  @Input() title = '';
  @Input() subtitle = '';
}

