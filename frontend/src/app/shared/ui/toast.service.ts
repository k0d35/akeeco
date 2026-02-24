import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { genId } from '../../features/staff/data/storage.util';

export interface ToastMessage {
  id: string;
  kind: 'success' | 'error' | 'info';
  text: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private subject = new BehaviorSubject<ToastMessage[]>([]);
  toasts$ = this.subject.asObservable();

  show(text: string, kind: ToastMessage['kind'] = 'info') {
    const next = { id: genId('toast'), kind, text };
    this.subject.next([next, ...this.subject.value].slice(0, 4));
    setTimeout(() => this.dismiss(next.id), 3000);
  }

  dismiss(id: string) {
    this.subject.next(this.subject.value.filter(t => t.id !== id));
  }
}

