import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { TripWizardStateService } from '../trip-wizard-state.service';
import { DraftPresenceService } from '../draft-presence.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h2>Pricing</h2>
    <div [formGroup]="fg" class="grid">
      <div>
        <label class="lbl">Service Type</label>
        <select class="in" formControlName="serviceType" (focus)="presence.focus('pricing.serviceType')">
          <option value="EXEC">Executive Sedan</option>
          <option value="SUV">Luxury SUV</option>
          <option value="VAN">Premium Van</option>
        </select>
      </div>
      <div>
        <label class="lbl">Surge</label>
        <input class="in" type="number" formControlName="surgeMultiplier" min="1" step="0.1" />
      </div>
      <div>
        <label class="lbl">Base Fare</label>
        <input class="in" type="number" formControlName="baseFare" min="0" />
      </div>
      <div>
        <label class="lbl">Discount</label>
        <input class="in" type="number" formControlName="discount" min="0" />
      </div>
      <div class="span2">
        <label class="lbl">Total</label>
        <input class="in" type="number" formControlName="total" min="0" />
      </div>
      <div class="span2">
        <label class="lbl">Quote Notes</label>
        <textarea class="in" formControlName="quoteNotes" rows="3"></textarea>
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
export class PricingStepComponent {
  private state = inject(TripWizardStateService);
  presence = inject(DraftPresenceService);
  fg: FormGroup = this.state.form.get('pricing') as FormGroup;
}
