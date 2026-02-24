import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DataTableColumn {
  key: string;
  label: string;
}

@Component({
  standalone: true,
  selector: 'data-table',
  imports: [CommonModule],
  template: `
    <div class="tableWrap" tabindex="0" aria-label="Data table">
      <table class="tbl">
        <thead>
          <tr><th *ngFor="let c of columns">{{ c.label }}</th><th *ngIf="showActions">Actions</th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let r of rows">
            <td *ngFor="let c of columns">{{ r[c.key] }}</td>
            <td *ngIf="showActions"><button class="btn secondary" type="button" (click)="rowAction.emit(r)">View</button></td>
          </tr>
        </tbody>
      </table>
      <div class="empty" *ngIf="rows.length===0">No records found.</div>
    </div>
  `,
  styles: [`
    .tableWrap{ border:1px solid var(--border); border-radius:12px; overflow:auto; }
    .tbl{ width:100%; border-collapse:collapse; min-width:760px; }
    th,td{ padding:10px; text-align:left; border-top:1px solid var(--border); }
    thead th{ border-top:none; font-size:12px; color:var(--muted); font-weight:900; }
    .empty{ padding:12px; color:var(--muted); }
  `]
})
export class DataTableComponent {
  @Input() columns: DataTableColumn[] = [];
  @Input() rows: Record<string, any>[] = [];
  @Input() showActions = false;
  @Output() rowAction = new EventEmitter<any>();
}

