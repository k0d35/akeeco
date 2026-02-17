import { FormGroup } from '@angular/forms';

export function mergeUntouched(local: any, server: any, form: FormGroup): any {
  const result: any = {};
  Object.keys(server || {}).forEach((key) => {
    const ctrl = form.get(key);
    if (!ctrl) { result[key] = server[key]; return; }
    const touched = ctrl.dirty || ctrl.touched;
    result[key] = touched ? local[key] : server[key];
  });
  return { ...local, ...result };
}
