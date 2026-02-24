import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { TripWizardStateService } from '../trip-wizard-state.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h2>Billing</h2>
    <div [formGroup]="fg">
      <label class="lbl">Billing Name</label>
      <input class="in" formControlName="billingName" />

      <div formGroupName="billingAddress" class="grid">
        <div class="span2">
          <label class="lbl">Address Line 1 <span class="req">*</span></label>
          <input class="in" formControlName="line1" />
        </div>
        <div class="span2">
          <label class="lbl">Address Line 2</label>
          <input class="in" formControlName="line2" />
        </div>
        <div>
          <label class="lbl">City <span class="req">*</span></label>
          <input class="in" formControlName="city" />
        </div>
        <div>
          <label class="lbl">Parish <span class="req">*</span></label>
          <input class="in" formControlName="parish" />
        </div>
      </div>

      <label class="lbl">Payment Method <span class="req">*</span></label>
      <select class="in" formControlName="paymentMethod">
        <option value="CARD">Card (tokenized)</option>
        <option value="CASH">Cash</option>
        <option value="INVOICE">Invoice</option>
      </select>

      <div class="note">
        <b>Security note:</b> Raw card number/CVV must never be stored in drafts. Use token fields only.
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
    .note{ margin-top: 10px; padding: 10px; border:1px solid var(--border); border-radius:12px; background:#fff; color: var(--muted); }
    @media (max-width: 640px){
      .grid{ grid-template-columns: 1fr; }
      .span2{ grid-column: span 1; }
      .in{ padding:10px; }
      .lbl{ margin: 6px 0 5px; }
    }
  `]
})
export class BillingStepComponent {
  private state = inject(TripWizardStateService);
  fg: FormGroup = this.state.form.get('billing') as FormGroup;
}
