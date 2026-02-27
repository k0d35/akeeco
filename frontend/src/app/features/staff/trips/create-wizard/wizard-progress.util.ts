import { AbstractControl, FormArray, FormGroup, Validators } from '@angular/forms';
import { WizardStepKey } from './wizard.config';

export function computeProgressPercent(form: FormGroup, stepKey: WizardStepKey) {
  if (stepKey === 'review') return form.valid ? 100 : 0;

  const stats = { required: 0, complete: 0 };
  const stepGroup = form.get(stepKey);
  if (!stepGroup) return 0;

  collectRequiredControlStats(stepGroup, stats);
  if (stats.required === 0) return 100;
  return Math.round((stats.complete / stats.required) * 100);
}

function collectRequiredControlStats(control: AbstractControl, stats: { required: number; complete: number }) {
  if (control instanceof FormGroup) {
    Object.values(control.controls).forEach((c) => collectRequiredControlStats(c, stats));
    return;
  }

  if (control instanceof FormArray) {
    control.controls.forEach((c) => collectRequiredControlStats(c, stats));
    return;
  }

  const hasRequired =
    control.hasValidator?.(Validators.required) ||
    control.hasValidator?.(Validators.requiredTrue);

  if (!hasRequired) return;
  stats.required += 1;
  if (control.valid) stats.complete += 1;
}
