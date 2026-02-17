import { FormGroup } from '@angular/forms';
import { WizardStepDef } from './wizard.config';

export function computeProgressPercent(form: FormGroup, defs: WizardStepDef[]) {
  const required = defs.filter(d => !d.optional);
  const complete = required.filter(d => d.isComplete(form)).length;
  return Math.round((complete / required.length) * 100);
}
