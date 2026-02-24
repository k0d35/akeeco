import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FleetService } from '../data/fleet.service';
import { StatusPillComponent } from '../../../shared/ui/status-pill.component';

@Component({
  standalone: true,
  imports: [CommonModule, StatusPillComponent],
  template: `
    <div class="card tableWrap">
      <table class="tbl">
        <thead><tr><th>Name</th><th>Type</th><th>Seats/Luggage</th><th>Maintenance</th><th>Active</th><th>Actions</th></tr></thead>
        <tbody>
          <tr *ngFor="let v of svc.list()">
            <td>{{ v.name }}</td><td>{{ v.type }}</td><td>{{ v.seats }}/{{ v.luggage }}</td>
            <td><status-pill [value]="v.maintenanceStatus"></status-pill></td>
            <td>{{ v.active ? 'Yes':'No' }}</td>
            <td><button class="btn secondary" (click)="open(v.id)">Edit</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`.tableWrap{ overflow:auto; } .tbl{ width:100%; border-collapse:collapse; } th,td{ padding:10px; border-top:1px solid var(--border);} th{border-top:none;}`]
})
export class StaffFleetPageComponent {
  svc = inject(FleetService);
  private router = inject(Router);
  open(id: string) { this.router.navigate(['/staff/fleet', id]); }
}

