import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { buildTripWizardForm } from './trip-form.builder';

@Injectable({ providedIn: 'root' })
export class TripWizardStateService {
  private _form: FormGroup;

  draftId: string | null = null;
  draftVersion: number | null = null;

  constructor(private fb: FormBuilder) {
    this._form = buildTripWizardForm(this.fb);
  }

  get form(): FormGroup { return this._form; }

  raw() { return this._form.getRawValue(); }

  reset() { this._form.reset(); this.draftId = null; this.draftVersion = null; }

  patchFromDraft(value: any) { this._form.patchValue(value, { emitEvent: true }); }
}
