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
    <h2>Schedule</h2>
    <div [formGroup]="fg" class="grid">
      <div>
        <label class="lbl">Pickup Date <span class="req">*</span></label>
        <input class="in" type="date" formControlName="pickupDate" presenceFocusTag="schedule.pickupDate"
               (focus)="presence.focus('schedule.pickupDate')" />
      </div>
      <div>
        <label class="lbl">Pickup Time <span class="req">*</span></label>
        <input class="in" type="time" formControlName="pickupTime" presenceFocusTag="schedule.pickupTime"
               (focus)="presence.focus('schedule.pickupTime')" />
      </div>
      <div>
        <label class="lbl">Passengers <span class="req">*</span></label>
        <input class="in" type="number" formControlName="passengers" min="1" max="20" />
      </div>
      <div>
        <label class="lbl">Luggage <span class="req">*</span></label>
        <input class="in" type="number" formControlName="luggageCount" min="0" max="30" />
      </div>
      <div class="span2">
        <label class="lbl">Special Requests</label>
        <textarea class="in" formControlName="specialRequests" rows="3"></textarea>
      </div>
    </div>
  `,
  styles: [`
    .grid{ display:grid; gap:12px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .span2{ grid-column: span 2; }
    .lbl{ display:block; font-weight:900; margin: 8px 0 6px; }
    .req{ color:#b42318; }
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
export class ScheduleStepComponent {
  private state = inject(TripWizardStateService);
  presence = inject(DraftPresenceService);
  fg: FormGroup = this.state.form.get('schedule') as FormGroup;
}
