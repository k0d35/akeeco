import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { TripWizardStateService } from '../trip-wizard-state.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h2>Assignment (Optional)</h2>
    <div [formGroup]="fg" class="grid">
      <div>
        <label class="lbl">Assigned Driver ID</label>
        <input class="in" formControlName="assignedDriverId" placeholder="driverId..." />
      </div>
      <div>
        <label class="lbl">Assigned Vehicle ID</label>
        <input class="in" formControlName="assignedVehicleId" placeholder="vehicleId..." />
      </div>
      <div class="span2">
        <label class="lbl">Status</label>
        <select class="in" formControlName="status">
          <option value="INACTIVE">INACTIVE</option>
          <option value="ACTIVE">ACTIVE</option>
        </select>
      </div>
    </div>
  `,
  styles: [`
    .grid{ display:grid; gap:12px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .span2{ grid-column: span 2; }
    .lbl{ display:block; font-weight:900; margin: 8px 0 6px; }
    .in{ width:100%; padding:12px; border-radius:12px; border:1px solid var(--border); outline:none; }
    .in:focus{ border-color: var(--gold); box-shadow: 0 0 0 4px rgba(200,162,74,.15); }
    .in.ng-valid.ng-dirty, .in.ng-valid.ng-touched{ border-color: var(--ok); color: var(--ok); }
    .in.ng-valid.ng-dirty:focus, .in.ng-valid.ng-touched:focus{ border-color: var(--ok); box-shadow: 0 0 0 4px rgba(22,163,74,.18); }
    @media (max-width: 640px){
      .grid{ grid-template-columns: 1fr; }
      .span2{ grid-column: span 1; }
      .in{ padding:10px; }
      .lbl{ margin: 6px 0 5px; }
    }
  `]
})
export class AssignmentStepComponent {
  private state = inject(TripWizardStateService);
  fg: FormGroup = this.state.form.get('assignment') as FormGroup;
}
