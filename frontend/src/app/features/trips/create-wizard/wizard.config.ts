import { FormGroup } from '@angular/forms';

export type WizardStepKey =
  | 'customer' | 'pickup' | 'dropoff' | 'schedule'
  | 'pricing' | 'assignment' | 'billing' | 'review';

export interface WizardStepDef {
  key: WizardStepKey;
  label: string;
  route: string;
  optional?: boolean;
  isComplete: (form: FormGroup) => boolean;
  canProceed: (form: FormGroup) => boolean;
  invalidMessage: (form: FormGroup) => string | null;
}

function validGroup(form: FormGroup, path: string) {
  const g = form.get(path) as FormGroup | null;
  if (!g) return false;
  g.updateValueAndValidity({ emitEvent: false });
  return g.valid;
}

export function buildWizardSteps(): WizardStepDef[] {
  return [
    { key:'customer', label:'Customer', route:'customer',
      isComplete:(f)=>validGroup(f,'customer'), canProceed:(f)=>validGroup(f,'customer'),
      invalidMessage:()=> 'Customer details required (first/last/phone).' },

    { key:'pickup', label:'Pickup', route:'pickup',
      isComplete:(f)=>validGroup(f,'pickup'), canProceed:(f)=>validGroup(f,'pickup'),
      invalidMessage:()=> 'Pickup address required.' },

    { key:'dropoff', label:'Drop-off', route:'dropoff',
      isComplete:(f)=>validGroup(f,'dropoff'), canProceed:(f)=>validGroup(f,'dropoff'),
      invalidMessage:()=> 'Drop-off address required.' },

    { key:'schedule', label:'Schedule', route:'schedule',
      isComplete:(f)=>validGroup(f,'schedule'), canProceed:(f)=>validGroup(f,'schedule'),
      invalidMessage:()=> 'Pickup date/time required.' },

    { key:'pricing', label:'Pricing', route:'pricing',
      isComplete:(f)=>validGroup(f,'pricing'), canProceed:(f)=>validGroup(f,'pricing'),
      invalidMessage:()=> 'Pricing needs service type and totals.' },

    { key:'assignment', label:'Assignment', route:'assignment', optional:true,
      isComplete:()=>true, canProceed:()=>true, invalidMessage:()=>null },

    { key:'billing', label:'Billing', route:'billing',
      isComplete:(f)=>validGroup(f,'billing'), canProceed:(f)=>validGroup(f,'billing'),
      invalidMessage:()=> 'Billing name/address required.' },

    { key:'review', label:'Review', route:'review',
      isComplete:(f)=>f.valid, canProceed:(f)=>f.valid, invalidMessage:()=> 'Fix validation errors before submitting.' },
  ];
}
