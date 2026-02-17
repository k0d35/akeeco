import { FormGroup } from '@angular/forms';
import { Observable, startWith, map } from 'rxjs';

export type TrackStatus = 'OK' | 'WARN' | 'ERROR';

export interface TrackerItem {
  label: string;
  status: TrackStatus;
  message?: string;
}

export function buildTrackerStream(form: FormGroup): Observable<TrackerItem[]> {
  return form.valueChanges.pipe(
    startWith(form.getRawValue()),
    map(() => {
      const items: TrackerItem[] = [];
      const cust = form.get('customer') as FormGroup;
      const phone = cust?.get('phone')?.value ?? '';

      if (!cust?.valid) items.push({ label:'Customer', status:'ERROR', message:'First/Last/Phone required (10 digits).' });
      else items.push({ label:'Customer', status:'OK' });

      if (phone && String(phone).length !== 10) items.push({ label:'Phone format', status:'ERROR', message:'Phone must be exactly 10 digits.' });

      const pick = form.get('pickup') as FormGroup;
      items.push(pick?.valid ? { label:'Pickup', status:'OK' } : { label:'Pickup', status:'ERROR', message:'Pickup address required.' });

      const drop = form.get('dropoff') as FormGroup;
      items.push(drop?.valid ? { label:'Drop-off', status:'OK' } : { label:'Drop-off', status:'ERROR', message:'Drop-off address required.' });

      const sched = form.get('schedule') as FormGroup;
      items.push(sched?.valid ? { label:'Schedule', status:'OK' } : { label:'Schedule', status:'ERROR', message:'Pickup date/time required.' });

      const bill = form.get('billing') as FormGroup;
      items.push(bill?.valid ? { label:'Billing', status:'OK' } : { label:'Billing', status:'ERROR', message:'Billing name/address required.' });

      return items;
    })
  );
}
