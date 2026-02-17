import { Injectable, OnDestroy, inject } from '@angular/core';
import { BehaviorSubject, Subscription, interval, switchMap, catchError, of } from 'rxjs';
import { DraftLockApiService } from '../drafts/draft-lock-api.service';
import { DraftLockDto } from '../drafts/draft-lock.gql';
import { AuthService } from '../../../shared-data/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class DraftLockManagerService implements OnDestroy {
  private api = inject(DraftLockApiService);
  private auth = inject(AuthService);

  private sub = new Subscription();

  private _lock$ = new BehaviorSubject<DraftLockDto | null>(null);
  lock$ = this._lock$.asObservable();

  private _readonly$ = new BehaviorSubject<boolean>(false);
  readonly$ = this._readonly$.asObservable();

  private draftId: string | null = null;
  private token: string | null = null;

  start(draftId: string) {
    this.stop();
    this.draftId = draftId;

    const acquireSub = this.api.acquire(draftId).subscribe({
      next: (lock) => {
        this._lock$.next(lock);
        this.token = lock.token ?? null;

        const me = this.auth.user().id;
        const owner = lock.userId;
        this._readonly$.next(!!owner && owner !== me);

        const hb = interval(45_000).pipe(
          switchMap(() => {
            if (!this.draftId || !this.token) return of(null);
            const me2 = this.auth.user().id;
            const current = this._lock$.value;
            if (!current?.userId || current.userId !== me2) return of(null);
            return this.api.renew(this.draftId, this.token);
          }),
          catchError(() => of(null))
        ).subscribe((renewed) => {
          if (renewed) {
            this._lock$.next(renewed);
            this._readonly$.next(false);
          }
        });

        this.sub.add(hb);
      },
      error: () => {
        const statusSub = this.api.status(draftId).subscribe((s) => {
          this._lock$.next(s);
          const me = this.auth.user().id;
          const owner = s?.userId;
          this._readonly$.next(!!owner && owner !== me);
        });
        this.sub.add(statusSub);
      }
    });
    this.sub.add(acquireSub);

    const poll = interval(20_000).pipe(
      switchMap(() => this.draftId ? this.api.status(this.draftId) : of(null)),
      catchError(() => of(null))
    ).subscribe((s) => {
      if (!s) return;
      this._lock$.next(s);
      const me = this.auth.user().id;
      const owner = s.userId;
      this._readonly$.next(!!owner && owner !== me);
    });

    this.sub.add(poll);
  }

  stop() {
    this.sub.unsubscribe();
    this.sub = new Subscription();
    this._lock$.next(null);
    this._readonly$.next(false);
    this.draftId = null;
    this.token = null;
  }

  release() {
    if (!this.draftId || !this.token) return;
    this.api.release(this.draftId, this.token).subscribe({ next: () => this.stop(), error: () => this.stop() });
  }

  ngOnDestroy(): void { this.stop(); }
}
