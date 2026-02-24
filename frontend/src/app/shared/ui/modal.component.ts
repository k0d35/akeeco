import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-modal',
  imports: [CommonModule],
  template: `
    <div class="backdrop" *ngIf="open" (click)="close.emit()">
      <section class="modal card" (click)="$event.stopPropagation()" role="dialog" aria-modal="true">
        <header><h3>{{ title }}</h3><button type="button" (click)="close.emit()">×</button></header>
        <ng-content></ng-content>
      </section>
    </div>
  `,
  styles: [`
    .backdrop{ position:fixed; inset:0; background:rgba(0,0,0,.35); z-index:901; display:grid; place-items:center; }
    .modal{ width:min(820px,92vw); max-height:86vh; overflow:auto; padding:12px; }
    header{ display:flex; justify-content:space-between; align-items:center; }
    h3{ margin:0; }
    button{ border:0; background:transparent; font-size:20px; cursor:pointer; }
  `]
})
export class ModalComponent {
  @Input() open = false;
  @Input() title = '';
  @Output() close = new EventEmitter<void>();
}

