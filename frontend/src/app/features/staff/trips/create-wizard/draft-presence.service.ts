import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export interface DraftPresenceEvent {
  tenantId?: string;
  draftId?: string;
  userId?: string;
  userName?: string;
  type?: 'JOIN' | 'STEP' | 'FOCUS' | 'LEAVE' | 'PING';
  stepKey?: string;
  focusPath?: string;
  at?: string;
}

export interface PresenceState {
  users: Record<string, DraftPresenceEvent>;
}

@Injectable({ providedIn: 'root' })
export class DraftPresenceService {
  private client: Client | null = null;
  private draftId: string | null = null;

  private state$ = new BehaviorSubject<PresenceState>({ users: {} });
  presence$ = this.state$.asObservable();

  connect(draftId: string) {
    this.disconnect();
    this.draftId = draftId;

    const c = new Client({
      webSocketFactory: () => new SockJS('/ws'),
      reconnectDelay: 3000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
    });

    c.onConnect = () => {
      c.subscribe(`/topic/drafts/${draftId}/presence`, (msg: IMessage) => {
        const evt = JSON.parse(msg.body) as DraftPresenceEvent;
        this.apply(evt);
      });
      this.send({ type: 'JOIN' });
    };

    c.activate();
    this.client = c;
  }

  disconnect() {
    if (this.client) {
      try { this.send({ type: 'LEAVE' }); this.client.deactivate(); } catch {}
    }
    this.client = null;
    this.draftId = null;
    this.state$.next({ users: {} });
  }

  send(evt: DraftPresenceEvent) {
    if (!this.client || !this.client.connected || !this.draftId) return;
    this.client.publish({
      destination: `/app/drafts/${this.draftId}/presence`,
      body: JSON.stringify(evt),
    });
  }

  step(stepKey: string) { this.send({ type: 'STEP', stepKey }); }
  focus(focusPath: string) { this.send({ type: 'FOCUS', focusPath }); }
  ping() { this.send({ type: 'PING' }); }

  private apply(evt: DraftPresenceEvent) {
    const userId = evt.userId || 'unknown';
    const curr = this.state$.value;

    if (evt.type === 'LEAVE') {
      const copy = { ...curr.users };
      delete copy[userId];
      this.state$.next({ users: copy });
      return;
    }
    this.state$.next({ users: { ...curr.users, [userId]: evt } });
  }
}
