import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'skeleton-loader',
  imports: [CommonModule],
  template: `<div class="sk" [style.height.px]="height"></div>`,
  styles: [`.sk{ width:100%; border-radius:12px; background:linear-gradient(90deg,#e2e8f0 20%,#f8fafc 50%,#e2e8f0 80%); background-size:200% 100%; animation:sh 1.2s linear infinite; } @keyframes sh{ from{background-position:200% 0;} to{background-position:-200% 0;} }`]
})
export class SkeletonLoaderComponent {
  @Input() height = 120;
}

