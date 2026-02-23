import { Injectable, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { buildTripWizardForm } from './trip-form.builder';
import { WizardStepKey } from './wizard.config';

type StepValidationStatus = Record<WizardStepKey, boolean>;

@Injectable({ providedIn: 'root' })
export class TripWizardStateService {
  private _form: FormGroup;
  private _stepValidationStatus = signal<StepValidationStatus>({
    customer: false,
    pickup: false,
    dropoff: false,
    schedule: false,
    pricing: false,
    assignment: true,
    billing: false,
    review: false,
  });

  draftId: string | null = null;
  draftVersion: number | null = null;

  constructor(private fb: FormBuilder) {
    this._form = buildTripWizardForm(this.fb);
    this.refreshStepValidationStatus();
    this._form.statusChanges.subscribe(() => this.refreshStepValidationStatus());
  }

  get form(): FormGroup { return this._form; }
  get stepValidationStatus(): StepValidationStatus { return this._stepValidationStatus(); }

  isStepValid(stepKey: WizardStepKey): boolean {
    return !!this._stepValidationStatus()[stepKey];
  }

  raw() { return this._form.getRawValue(); }

  reset() {
    this._form.reset();
    this.refreshStepValidationStatus();
    this.draftId = null;
    this.draftVersion = null;
  }

  patchFromDraft(value: any) {
    this._form.patchValue(value, { emitEvent: true });
    this.refreshStepValidationStatus();
  }

  private refreshStepValidationStatus() {
    const next: StepValidationStatus = {
      customer: this.groupValid('customer'),
      pickup: this.groupValid('pickup'),
      dropoff: this.groupValid('dropoff'),
      schedule: this.groupValid('schedule'),
      pricing: this.groupValid('pricing'),
      assignment: true,
      billing: this.groupValid('billing'),
      review: this._form.valid,
    };
    this._stepValidationStatus.set(next);
  }

  private groupValid(path: string): boolean {
    const g = this._form.get(path) as FormGroup | null;
    if (!g) return false;
    g.updateValueAndValidity({ emitEvent: false });
    return g.valid;
  }
}
