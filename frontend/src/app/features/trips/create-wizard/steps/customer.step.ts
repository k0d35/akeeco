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
    <h2>Customer</h2>
    <div [formGroup]="fg" class="grid">
      <div>
        <label class="lbl">First name</label>
        <input class="in" formControlName="firstName" presenceFocusTag="customer.firstName"
               (focus)="presence.focus('customer.firstName')" />
      </div>
      <div>
        <label class="lbl">Last name</label>
        <input class="in" formControlName="lastName" presenceFocusTag="customer.lastName"
               (focus)="presence.focus('customer.lastName')" />
      </div>
      <div>
        <label class="lbl">Phone (10 digits)</label>
        <input class="in" formControlName="phone" presenceFocusTag="customer.phone"
               (focus)="presence.focus('customer.phone')" />
      </div>
      <div>
        <label class="lbl">Email</label>
        <input class="in" formControlName="email" presenceFocusTag="customer.email"
               (focus)="presence.focus('customer.email')" />
      </div>
      <div class="span2">
        <label class="lbl">Company (optional)</label>
        <input class="in" formControlName="companyName" presenceFocusTag="customer.companyName"
               (focus)="presence.focus('customer.companyName')" />
      </div>
      <div class="span2">
        <label class="lbl">Notes</label>
        <textarea class="in" formControlName="notes" rows="3"></textarea>
      </div>
    </div>
  `,
  styles: [`
    .grid{ display:grid; gap:12px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .span2{ grid-column: span 2; }
    .lbl{ display:block; font-weight:900; margin: 8px 0 6px; }
    .in{ width:100%; padding:12px; border-radius:12px; border:1px solid var(--border); outline:none; }
    .in:focus{ border-color: var(--gold); box-shadow: 0 0 0 4px rgba(200,162,74,.15); }
  `]
})
export class CustomerStepComponent {
  private state = inject(TripWizardStateService);
  presence = inject(DraftPresenceService);
  fg: FormGroup = this.state.form.get('customer') as FormGroup;
}
