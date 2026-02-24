import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-drawer',
  imports: [CommonModule],
  template: `
    <div class="backdrop" *ngIf="open" (click)="close.emit()">
      <aside class="drawer card" (click)="$event.stopPropagation()">
        <header><h3>{{ title }}</h3><button type="button" (click)="close.emit()">×</button></header>
        <ng-content></ng-content>
      </aside>
    </div>
  `,
  styles: [`
    .backdrop{ position:fixed; inset:0; background:rgba(0,0,0,.2); z-index:900; }
    .drawer{ position:absolute; top:0; right:0; width:min(520px,95vw); height:100vh; border-radius:0; padding:14px; overflow:auto; }
    header{ display:flex; justify-content:space-between; align-items:center; }
    h3{ margin:0; }
    button{ border:0; background:transparent; font-size:20px; cursor:pointer; }
  `]
})
export class DrawerComponent {
  @Input() open = false;
  @Input() title = '';
  @Output() close = new EventEmitter<void>();
}

