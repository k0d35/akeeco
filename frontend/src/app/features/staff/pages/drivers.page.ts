import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DriversService } from '../data/drivers.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card tableWrap">
      <table class="tbl">
        <thead><tr><th>Name</th><th>Status</th><th>Availability</th><th>Vehicle</th><th>License Expiry</th><th>Actions</th></tr></thead>
        <tbody>
          <tr *ngFor="let d of svc.list()">
            <td>{{ d.name }}</td>
            <td>{{ d.status }}</td>
            <td><input type="checkbox" [ngModel]="d.availability" (ngModelChange)="toggle(d.id, $event)" /></td>
            <td>{{ d.assignedVehicleId || '—' }}</td>
            <td>{{ d.licenseExpiry }}</td>
            <td><button class="btn secondary" (click)="open(d.id)">View/Edit</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`.tableWrap{ overflow:auto; } .tbl{ width:100%; border-collapse:collapse; } th,td{ padding:10px; border-top:1px solid var(--border);} th{border-top:none;}`]
})
export class StaffDriversPageComponent {
  svc = inject(DriversService);
  private router = inject(Router);
  open(id: string) { this.router.navigate(['/staff/drivers', id]); }
  toggle(id: string, v: boolean) { this.svc.setAvailability(id, v); }
}

