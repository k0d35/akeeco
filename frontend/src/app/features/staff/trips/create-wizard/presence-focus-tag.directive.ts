import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { DraftPresenceService, DraftPresenceEvent } from './draft-presence.service';
import { AuthService } from '../../../../shared-data/auth/auth.service';

@Directive({
  selector: '[presenceFocusTag]',
  standalone: true,
})
export class PresenceFocusTagDirective implements OnInit, OnDestroy {
  private el = inject(ElementRef<HTMLElement>);
  private r = inject(Renderer2);
  private presence = inject(DraftPresenceService);
  private auth = inject(AuthService);

  @Input('presenceFocusTag') focusPath!: string;

  private sub = new Subscription();
  private badgeEl: HTMLElement | null = null;
  private wrapperEl: HTMLElement | null = null;

  ngOnInit(): void {
    this.ensureWrapper();
    const me = this.auth.user().id;

    this.sub.add(
      this.presence.presence$.subscribe((state) => {
        const users = Object.values(state.users || {}) as DraftPresenceEvent[];

        const focused = users
          .filter((u) => u.userId && u.userId !== me)
          .find((u) => (u.focusPath || '') === this.focusPath);

        if (focused) this.showBadge(focused);
        else this.hideBadge();
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.hideBadge(true);
  }

  private ensureWrapper() {
    const host = this.el.nativeElement;

    if (host.parentElement?.classList.contains('presence-focus-wrap')) {
      this.wrapperEl = host.parentElement;
      return;
    }
    const parent = host.parentElement;
    if (!parent) return;

    const wrap = this.r.createElement('span') as HTMLElement;
    this.r.addClass(wrap, 'presence-focus-wrap');

    this.r.insertBefore(parent, wrap, host);
    this.r.removeChild(parent, host);
    this.r.appendChild(wrap, host);

    this.wrapperEl = wrap;
    this.r.setStyle(wrap, 'position', 'relative');
    this.r.setStyle(wrap, 'display', 'block');
  }

  private showBadge(evt: DraftPresenceEvent) {
    if (!this.wrapperEl) return;

    const name = evt.userName || evt.userId || 'Someone';

    if (!this.badgeEl) {
      const b = this.r.createElement('span') as HTMLElement;
      this.r.setStyle(b, 'position', 'absolute');
      this.r.setStyle(b, 'top', '-10px');
      this.r.setStyle(b, 'right', '6px');
      this.r.setStyle(b, 'transform', 'translateY(-100%)');
      this.r.setStyle(b, 'background', '#C8A24A');
      this.r.setStyle(b, 'color', '#0B0B0D');
      this.r.setStyle(b, 'border', '1px solid #C8A24A');
      this.r.setStyle(b, 'borderRadius', '999px');
      this.r.setStyle(b, 'padding', '2px 8px');
      this.r.setStyle(b, 'fontSize', '11px');
      this.r.setStyle(b, 'fontWeight', '900');
      this.r.setStyle(b, 'boxShadow', '0 6px 18px rgba(0,0,0,.10)');
      this.r.setStyle(b, 'pointerEvents', 'none');
      this.r.setStyle(b, 'zIndex', '10');
      this.r.appendChild(this.wrapperEl, b);
      this.badgeEl = b;
    }

    this.badgeEl.textContent = `${name} editing`;

    const host = this.el.nativeElement;
    this.r.setStyle(host, 'outline', '2px solid rgba(200,162,74,.55)');
    this.r.setStyle(host, 'boxShadow', '0 0 0 4px rgba(200,162,74,.18)');
  }

  private hideBadge(force = false) {
    if (this.badgeEl && this.wrapperEl) this.r.removeChild(this.wrapperEl, this.badgeEl);
    this.badgeEl = null;
    const host = this.el.nativeElement;
    this.r.removeStyle(host, 'outline');
    this.r.removeStyle(host, 'boxShadow');
    if (force) {}
  }
}
