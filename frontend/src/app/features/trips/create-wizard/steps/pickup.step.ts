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
    <h2>Pickup</h2>
    <div [formGroup]="fg">
      <label class="lbl">Pickup Address</label>
      <input class="in" formControlName="formatted" presenceFocusTag="pickup.formatted"
             (focus)="presence.focus('pickup.formatted')" placeholder="(Replace with Google Places Autocomplete)" />

      <div class="grid">
        <div>
          <label class="lbl">City</label>
          <input class="in" formControlName="city" presenceFocusTag="pickup.city"
                 (focus)="presence.focus('pickup.city')" />
        </div>
        <div>
          <label class="lbl">Major Intersection</label>
          <input class="in" formControlName="intersection" presenceFocusTag="pickup.intersection"
                 (focus)="presence.focus('pickup.intersection')" />
        </div>
      </div>

      <label class="lbl">Dwelling Type</label>
      <select class="in" formControlName="dwellingType" presenceFocusTag="pickup.dwellingType"
              (focus)="presence.focus('pickup.dwellingType')">
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
  `]
})
export class PickupStepComponent {
  private state = inject(TripWizardStateService);
  presence = inject(DraftPresenceService);
  fg: FormGroup = this.state.form.get('pickup') as FormGroup;
}
