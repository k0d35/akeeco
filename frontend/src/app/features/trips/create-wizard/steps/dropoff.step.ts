import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { TripWizardStateService } from '../trip-wizard-state.service';
import { DraftPresenceService } from '../draft-presence.service';
import { PresenceFocusTagDirective } from '../presence-focus-tag.directive';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PresenceFocusTagDirective],
  template: `
    <h2>Drop-off</h2>
    <div [formGroup]="fg">
      <label class="lbl">Drop-off Address</label>
      <input class="in" formControlName="formatted" presenceFocusTag="dropoff.formatted"
             (focus)="presence.focus('dropoff.formatted')" placeholder="(Replace with Google Places Autocomplete)" />

      <div class="grid">
        <div>
          <label class="lbl">City</label>
          <input class="in" formControlName="city" presenceFocusTag="dropoff.city"
                 (focus)="presence.focus('dropoff.city')" />
        </div>
        <div>
          <label class="lbl">Major Intersection</label>
          <input class="in" formControlName="intersection" presenceFocusTag="dropoff.intersection"
                 (focus)="presence.focus('dropoff.intersection')" />
        </div>
      </div>

      <label class="lbl">Dwelling Type</label>
      <select class="in" formControlName="dwellingType" presenceFocusTag="dropoff.dwellingType"
              (focus)="presence.focus('dropoff.dwellingType')">
        <option value="">Select…</option>
        <option value="house">House</option>
        <option value="building">Building</option>
        <option value="unit">Unit</option>
        <option value="complex">Complex</option>
      </select>
    </div>
  `,
  styles: [`
    .grid{ display:grid; gap:12px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .lbl{ display:block; font-weight:900; margin: 8px 0 6px; }
    .in{ width:100%; padding:12px; border-radius:12px; border:1px solid var(--border); outline:none; }
    .in:focus{ border-color: var(--gold); box-shadow: 0 0 0 4px rgba(200,162,74,.15); }
    .in.ng-valid.ng-dirty, .in.ng-valid.ng-touched{ border-color: var(--ok); color: var(--ok); }
    .in.ng-valid.ng-dirty:focus, .in.ng-valid.ng-touched:focus{ border-color: var(--ok); box-shadow: 0 0 0 4px rgba(22,163,74,.18); }
    @media (max-width: 640px){
      .grid{ grid-template-columns: 1fr; }
      .in{ padding:10px; }
      .lbl{ margin: 6px 0 5px; }
    }
  `]
})
export class DropoffStepComponent {
  private state = inject(TripWizardStateService);
  presence = inject(DraftPresenceService);
  fg: FormGroup = this.state.form.get('dropoff') as FormGroup;
}
