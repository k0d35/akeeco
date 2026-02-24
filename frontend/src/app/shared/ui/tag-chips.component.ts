import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'tag-chips',
  imports: [CommonModule],
  template: `
    <div class="chips">
      <button type="button" *ngFor="let t of tags" class="pill" (click)="select.emit(t)">{{ t }}</button>
    </div>
  `,
  styles: [`.chips{ display:flex; gap:6px; flex-wrap:wrap; } button{ cursor:pointer; }`]
})
export class TagChipsComponent {
  @Input() tags: string[] = [];
  @Output() select = new EventEmitter<string>();
}

