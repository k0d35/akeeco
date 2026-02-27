import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'si-card',
  template: `<article class="si-card"><ng-content></ng-content></article>`,
  styles: [`
    .si-card{ background:var(--color-cloud-0); border:1px solid rgba(15,23,42,.08); border-radius:16px; box-shadow:0 12px 28px rgba(15,23,42,.08); padding:16px; }
  `]
})
export class CardComponent {}

