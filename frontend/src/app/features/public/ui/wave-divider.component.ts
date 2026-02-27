import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'si-wave-divider',
  template: `
    <div class="wave" [class.flip]="flip">
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0,64L60,53.3C120,43,240,21,360,21.3C480,21,600,43,720,58.7C840,75,960,85,1080,80C1200,75,1320,53,1380,42.7L1440,32V120H1380C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120H0Z"></path>
      </svg>
    </div>
  `,
  styles: [`
    .wave{ line-height:0; }
    svg{ width:100%; height:70px; display:block; }
    path{ fill:var(--color-cloud-0); }
    .flip{ transform:rotate(180deg); }
  `]
})
export class WaveDividerComponent {
  @Input() flip = false;
}

