import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'si-button',
  imports: [CommonModule],
  template: `<button class="si-btn" [class.secondary]="variant==='secondary'" [class.tertiary]="variant==='tertiary'" [attr.aria-label]="ariaLabel || null"><ng-content></ng-content></button>`,
  styles: [`
    .si-btn{ border:0; border-radius:12px; padding:11px 16px; font-weight:800; cursor:pointer; background:var(--color-sun-500); color:#18222f; box-shadow:0 10px 25px rgba(255,193,7,.25); transition:transform .18s ease, box-shadow .18s ease; }
    .si-btn:hover{ transform:translateY(-1px); box-shadow:0 16px 28px rgba(2,132,199,.18); }
    .si-btn.secondary{ background:#fff; border:1px solid var(--color-ocean-700); color:var(--color-ocean-700); box-shadow:none; }
    .si-btn.tertiary{ background:transparent; color:var(--color-ocean-700); box-shadow:none; padding-left:0; padding-right:0; }
  `]
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'tertiary' = 'primary';
  @Input() ariaLabel = '';
}

