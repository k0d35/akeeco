import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'si-hero',
  imports: [CommonModule],
  template: `
    <section class="hero" [style.--hero-bg]="heroBg || 'var(--bg-hero-home)'">
      <div class="overlay"></div>
      <div class="container inner">
        <div class="copy">
          <h1>{{ title }}</h1>
          <p>{{ subtitle }}</p>
          <div class="actions"><ng-content select="[hero-actions]"></ng-content></div>
        </div>
        <div class="media card">
          <img *ngIf="mediaSrc; else placeholder" [src]="mediaSrc" [alt]="mediaAlt" />
          <ng-template #placeholder><div class="ph">Premium Visual Placeholder</div></ng-template>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero{
      position:relative;
      background-image: linear-gradient(140deg, rgba(17,17,17,.72), rgba(31,31,31,.56) 45%, rgba(58,58,58,.5)), var(--hero-bg);
      background-size: cover;
      background-position: center;
      color:#fff;
      padding:110px 0 72px;
      overflow:hidden;
    }
    .overlay{ position:absolute; inset:0; background:radial-gradient(circle at top right, rgba(255,193,7,.22), transparent 40%); }
    .inner{ position:relative; display:grid; gap:22px; grid-template-columns:1.15fr .85fr; align-items:center; }
    h1{ margin:0; font-size:clamp(32px, 5vw, 56px); line-height:1.1; font-family: 'Playfair Display', Georgia, serif; }
    p{ margin:12px 0 0; font-size:18px; color:rgba(255,255,255,.92); max-width:640px; }
    .actions{ margin-top:20px; display:flex; gap:10px; flex-wrap:wrap; }
    .media{ border-radius:16px; min-height:280px; display:grid; place-items:center; background:rgba(255,255,255,.15); overflow:hidden; }
    .media img{ width:100%; height:100%; object-fit:cover; display:block; }
    .ph{ font-weight:800; color:#e2e8f0; }
    @media (max-width:900px){ .inner{ grid-template-columns:1fr; } }
  `]
})
export class HeroComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() heroBg = '';
  @Input() mediaSrc = '';
  @Input() mediaAlt = '';
}

