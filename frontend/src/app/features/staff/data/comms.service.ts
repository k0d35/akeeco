import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DispatchMessageLog } from './models';
import { genId, loadLocal, saveLocal } from './storage.util';
import { AuthService } from '../../../shared-data/auth/auth.service';

const KEY = 'staff_comms_logs_v1';

@Injectable({ providedIn: 'root' })
export class CommsService {
  private subject = new BehaviorSubject<DispatchMessageLog[]>(loadLocal(KEY, [] as DispatchMessageLog[]));
  logs$ = this.subject.asObservable();

  constructor(private auth: AuthService) {}

  listLogs(bookingId: string): DispatchMessageLog[] {
    return this.subject.value.filter(l => l.bookingId === bookingId);
    // TODO: Replace with GET /api/comms/logs?bookingId=
  }

  sendTemplate(bookingId: string, templateId: string): DispatchMessageLog {
    const channel: DispatchMessageLog['channel'] = templateId.includes('email') ? 'EMAIL' : 'SMS';
    const contentMap: Record<string, string> = {
      assigned_sms: 'Your driver has been assigned and will arrive on time.',
      enroute_sms: 'Your driver is on the way.',
      pickup_confirmed_sms: 'Pickup confirmed. We are now en route.',
      thanks_email: 'Thank you for choosing our premium chauffeur service.',
    };
    const next: DispatchMessageLog = {
      id: genId('msg'),
      bookingId,
      channel,
      templateUsed: templateId,
      sentAt: new Date().toISOString(),
      sentBy: this.auth.user().name,
      content: contentMap[templateId] ?? 'Template sent.',
    };
    const rows = [next, ...this.subject.value];
    this.subject.next(rows);
    saveLocal(KEY, rows);
    // TODO: Replace with POST /api/comms/send-template
    return next;
  }
}

