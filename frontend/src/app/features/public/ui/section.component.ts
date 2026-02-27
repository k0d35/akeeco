import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'si-section',
  imports: [CommonModule],
  template: `<section class="si-section" [class.alt]="alt"><ng-content></ng-content></section>`,
  styles: [`
    .si-section{ padding:72px 0; background:transparent; }
    .si-section.alt{ background:linear-gradient(180deg, rgba(240,249,255,.9), rgba(255,255,255,.96)); }
  `]
})
export class SectionComponent {
  @Input() alt = false;
}

