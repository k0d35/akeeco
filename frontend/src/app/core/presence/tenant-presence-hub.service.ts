import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export interface TenantPresenceEvent {
  tenantId?: string;
  entityType?: 'DRAFT' | 'TRIP';
  entityId?: string;

  userId?: string;
  userName?: string;

  type?: 'JOIN' | 'STEP' | 'FOCUS' | 'LEAVE' | 'PING';
  stepKey?: string;
  focusPath?: string;
  at?: string;
}

@Injectable({ providedIn: 'root' })
export class TenantPresenceHubService {
  private client: Client | null = null;
  private tenantId: string | null = null;

  private state$ = new BehaviorSubject<Record<string, TenantPresenceEvent[]>>({});
  presenceByEntity$ = this.state$.asObservable();

  connect(tenantId: string) {
    if (this.tenantId === tenantId && this.client?.active) return;

    this.disconnect();
    this.tenantId = tenantId;

    const c = new Client({
      webSocketFactory: () => new SockJS('/ws'),
      reconnectDelay: 3000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
    });

    c.onConnect = () => {
      c.subscribe(`/topic/tenant/${tenantId}/presence`, (msg: IMessage) => {
        const evt = JSON.parse(msg.body) as TenantPresenceEvent;
        this.apply(evt);
      });
    };

    c.activate();
    this.client = c;
  }

  disconnect() {
    try { this.client?.deactivate(); } catch {}
    this.client = null;
    this.tenantId = null;
    this.state$.next({});
  }

  private apply(evt: TenantPresenceEvent) {
    const type = evt.entityType || 'DRAFT';
    const id = evt.entityId;
    if (!id) return;

    const key = `${type}:${id}`;
    const curr = this.state$.value;
    const list = (curr[key] || []).filter(x => x.userId && x.userId !== evt.userId);

    if (evt.type === 'LEAVE') {
      this.state$.next({ ...curr, [key]: list });
      return;
    }

    this.state$.next({ ...curr, [key]: [evt, ...list].slice(0, 20) });
  }
}
