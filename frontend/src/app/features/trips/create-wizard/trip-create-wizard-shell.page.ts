import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription, debounceTime, firstValueFrom } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import { StepperComponent } from '../../../shared/ui/stepper.component';
import { WizardNavComponent } from './wizard-nav.component';
import { buildWizardSteps, WizardStepDef, WizardStepKey } from './wizard.config';
import { computeProgressPercent } from './wizard-progress.util';

import { TripWizardStateService } from './trip-wizard-state.service';
import { buildTrackerStream } from './form-tracker.logic';

import { DraftApiService } from '../drafts/draft-api.service';
import { TripDraftDto } from '../drafts/drafts.gql';

import { DraftLockManagerService } from './draft-lock-manager.service';
import { DraftPresenceService } from './draft-presence.service';
import { mergeUntouched } from './draft-merge.util';

@Component({
  standalone: true,
  imports: [CommonModule, RouterOutlet, StepperComponent, WizardNavComponent],
  template: `
    <div class="shell">
      <header class="head">
        <div>
          <h1>Create Trip</h1>
          <p class="sub">Server draft + lock + presence enabled.</p>
        </div>

        <label class="toggle">
          <input type="checkbox" [checked]="sharedDraft()" (change)="setShared(($any($event.target)).checked)" />
          <span>Shared with dispatch team</span>
        </label>
      </header>

      <div class="banner lock" *ngIf="lockInfo() as l">
        <div>
          <b>Draft lock:</b>
          <span *ngIf="readonly()">Locked by {{ l.userName || l.userId }} ({{ l.ttlSeconds || '—' }}s left)</span>
          <span *ngIf="!readonly()">You are editing ({{ l.ttlSeconds || '—' }}s left)</span>
        </div>
        <div class="banner-actions">
          <button class="btn secondary" type="button" (click)="releaseLock()" *ngIf="!readonly()">Release lock</button>
        </div>
      </div>

      <div class="banner" *ngIf="restoreBanner()">
        <div><b>Draft exists on server.</b> Last updated: {{ draftUpdatedAtText() }}</div>
        <div class="banner-actions">
          <button class="btn" type="button" (click)="resumeDraft()">Resume</button>
          <button class="btn secondary" type="button" (click)="discardDraft()">Discard</button>
        </div>
      </div>

      <div class="banner conflict" *ngIf="conflictBanner()">
        <div>
          <b>Draft conflict.</b> Another dispatcher updated this draft.
          Reload or merge server changes into untouched fields.
        </div>
        <div class="banner-actions">
          <button class="btn" type="button" (click)="reloadLatest()">Reload</button>
          <button class="btn gold" type="button" (click)="mergeLatest()">Merge Untouched</button>
          <button class="btn secondary" type="button" (click)="dismissConflict()">Dismiss</button>
        </div>
      </div>

      <div class="grid">
        <ui-stepper
          [steps]="stepperSteps()"
          [activeKey]="activeKey()"
          (stepClick)="onStepClick($event.route)">
        </ui-stepper>

        <section class="center card">
          <router-outlet></router-outlet>

          <div style="margin-top: 14px;">
            <wiz-nav
              [progressPercent]="progressPercent()"
              [progressHint]="progressHint()"
              [stepReady]="currentStepValid()"
              [canBack]="canBack()"
              [canNext]="canNext()"
              [canSubmit]="canSubmit()"
              [isLastStep]="isLastStep()"
              [blockedMessage]="blockedMessage()"
              (saveExit)="saveAndExit()"
              (back)="goBack()"
              (next)="goNext()"
              (submit)="submit()">
            </wiz-nav>
          </div>
        </section>

        <aside class="right card">
          <h3>Completion Tracker</h3>
          <ul class="tracker">
            <li *ngFor="let t of tracker$ | async"
                [class.err]="t.status==='ERROR'"
                [class.warn]="t.status==='WARN'">
              <div class="row">
                <span class="name">{{ t.label }}</span>
                <span class="status">{{ t.status }}</span>
              </div>
              <div class="msg" *ngIf="t.message">{{ t.message }}</div>
            </li>
          </ul>

          <div class="autosave">
            <b>Auto-save:</b> {{ autosaveStatus() }}
          </div>
        </aside>
      </div>
    </div>
  `,
  styles: [`
    .shell{ padding:16px; }
    .head{ display:flex; justify-content: space-between; align-items:flex-start; gap:12px; }
    .sub{ margin: 6px 0 0; color: var(--muted); }
    .toggle{ display:flex; gap:10px; align-items:center; font-weight:900; }

    .banner{
      margin-top: 12px; display:flex; justify-content: space-between; align-items:center; gap:12px;
      padding: 12px; border-radius: 12px;
      border: 1px solid var(--gold); background: var(--gold-weak);
    }
    .banner.lock{ border-color: var(--fg); background:#fff; }
    .banner.conflict{ border-color: rgba(185, 28, 28, .35); background: rgba(185, 28, 28, .06); }
    .banner-actions{ display:flex; gap:10px; }

    .grid{ margin-top: 14px; display:grid; grid-template-columns: 280px 1fr 320px; gap: 14px; align-items: start; }
    .center{ padding:14px; }
    .right{ padding:14px; }

    .tracker{ list-style:none; padding:0; margin:10px 0 0; display:grid; gap:10px; }
    .tracker li{ border:1px solid var(--border); border-radius:12px; padding:10px; }
    .tracker li.err{ border-color: rgba(185, 28, 28, .35); }
    .tracker li.warn{ border-color: rgba(180, 83, 9, .35); }
    .row{ display:flex; justify-content: space-between; gap:10px; }
    .name{ font-weight: 900; }
    .status{ font-size:12px; opacity:.8; font-weight:900; }
    .msg{ margin-top:4px; font-size:12px; color: var(--muted); }
    .autosave{ margin-top: 12px; font-size: 12px; color: var(--muted); padding-top: 10px; border-top: 1px solid var(--border); }

    @media (max-width: 1200px){
      .grid{ grid-template-columns: 240px 1fr; }
      .right{ grid-column: 1 / -1; }
    }

    @media (max-width: 900px){
      .shell{ padding:12px; }
      .head{ flex-direction:column; align-items:stretch; }
      .toggle{ width:100%; }
      .banner{ flex-direction:column; align-items:flex-start; }
      .banner-actions{ width:100%; flex-wrap:wrap; }
      .grid{ grid-template-columns: 1fr; gap:12px; }
      .center, .right{ padding:12px; }
    }

    @media (max-width: 640px){
      .banner-actions .btn{ width:100%; }
      .row{ flex-wrap:wrap; }
      .status{ font-size:11px; }
    }
  `],
})
export class TripCreateWizardShellPageComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private state = inject(TripWizardStateService);
  private drafts = inject(DraftApiService);

  private lockMgr = inject(DraftLockManagerService);
  private presence = inject(DraftPresenceService);

  form = this.state.form;
  tracker$ = buildTrackerStream(this.form);

  private defs: WizardStepDef[] = buildWizardSteps();
  private subs = new Subscription();

  sharedDraft = signal<boolean>(false);

  private _autosaveStatus = signal<string>('Idle');
  autosaveStatus = computed(() => this._autosaveStatus());

  private _serverDraft: TripDraftDto | null = null;
  private _showRestoreBanner = signal<boolean>(false);
  restoreBanner = computed(() => this._showRestoreBanner());

  private _conflictBanner = signal<boolean>(false);
  conflictBanner = computed(() => this._conflictBanner());

  lockInfo = toSignal(this.lockMgr.lock$, { initialValue: null });
  readonly = toSignal(this.lockMgr.readonly$, { initialValue: false });

  draftUpdatedAtText = computed(() => {
    if (!this._serverDraft?.updatedAt) return '';
    try { return new Date(this._serverDraft.updatedAt).toLocaleString(); }
    catch { return this._serverDraft.updatedAt; }
  });

  async ngOnInit(): Promise<void> {
    const qpId = this.route.snapshot.queryParamMap.get('draftId');

    if (qpId) {
      this.state.draftId = qpId;
    } else {
      this._autosaveStatus.set('Creating draft…');
      const created = await firstValueFrom(this.drafts.create(this.sharedDraft()));
      this.state.draftId = created.id;
      this.state.draftVersion = (created.version ?? null) as any;

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { draftId: created.id },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
      this._autosaveStatus.set('Draft created.');
    }

    if (this.state.draftId) {
      this.lockMgr.start(this.state.draftId);
      this.presence.connect(this.state.draftId);
    }

    const roSub = this.lockMgr.readonly$.subscribe((ro) => {
      if (ro) this.form.disable({ emitEvent: false });
      else this.form.enable({ emitEvent: false });
    });
    this.subs.add(roSub);

    await this.loadDraftForBanner();

    const s = this.form.valueChanges.pipe(debounceTime(900)).subscribe(() => this.autosaveNow());
    this.subs.add(s);
  }

  ngOnDestroy(): void {
    this.presence.disconnect();
    this.lockMgr.release();
    this.subs.unsubscribe();
  }

  setShared(v: boolean) { this.sharedDraft.set(v); }

  releaseLock() { this.lockMgr.release(); }

  private async loadDraftForBanner(): Promise<void> {
    const id = this.state.draftId;
    if (!id) return;
    try {
      const d = await firstValueFrom(this.drafts.get(id));
      this._serverDraft = d;
      const hasData = !!d?.formValue && Object.keys(d.formValue || {}).length > 0;
      this._showRestoreBanner.set(hasData);
      this.state.draftVersion = (d.version ?? null) as any;
    } catch {
      this._showRestoreBanner.set(false);
    }
  }

  private autosaveInFlight = false;

  private autosaveNow() {
    if (this.readonly()) { this._autosaveStatus.set('Read-only (locked by another user).'); return; }
    if (this.autosaveInFlight) return;
    const id = this.state.draftId;
    if (!id) return;

    this.autosaveInFlight = true;
    this._autosaveStatus.set('Saving…');

    this.drafts.save(id, this.state.draftVersion, this.state.raw()).subscribe({
      next: (saved) => {
        this._serverDraft = saved;
        this.state.draftVersion = (saved.version ?? null) as any;
        this._autosaveStatus.set(`Saved (${new Date().toLocaleTimeString()})`);
        this.autosaveInFlight = false;
      },
      error: (err: any) => {
        const msg = String(err?.message || err);
        if (msg.toLowerCase().includes('conflict') || msg.toLowerCase().includes('version')) {
          this._conflictBanner.set(true);
          this._autosaveStatus.set('Conflict detected.');
        } else {
          this._autosaveStatus.set('Save failed.');
        }
        this.autosaveInFlight = false;
      }
    });
  }

  resumeDraft() {
    if (!this._serverDraft?.formValue) { this._showRestoreBanner.set(false); return; }
    this.state.patchFromDraft(this._serverDraft.formValue);
    this._showRestoreBanner.set(false);
    this.router.navigate(['customer'], { relativeTo: this.route });
  }

  discardDraft() {
    const id = this.state.draftId;
    if (!id) return;

    this.drafts.delete(id).subscribe({
      next: () => { this._serverDraft = null; this._showRestoreBanner.set(false); this.state.reset(); this.router.navigateByUrl('/app/trips/drafts'); },
      error: () => { this._showRestoreBanner.set(false); this.state.reset(); }
    });
  }

  reloadLatest() {
    this._autosaveStatus.set('Reloading latest…');
    this.drafts.get(this.state.draftId!).subscribe({
      next: (server) => {
        this._serverDraft = server;
        this.state.draftVersion = (server.version ?? null) as any;
        if (server.formValue) this.state.patchFromDraft(server.formValue);
        this._conflictBanner.set(false);
        this._autosaveStatus.set('Reloaded latest.');
      },
      error: () => this._autosaveStatus.set('Reload failed.')
    });
  }

  mergeLatest() {
    this._autosaveStatus.set('Merging latest…');
    this.drafts.get(this.state.draftId!).subscribe({
      next: (server) => {
        this._serverDraft = server;
        const merged = mergeUntouched(this.state.raw(), server.formValue || {}, this.state.form);
        this.state.patchFromDraft(merged);
        this.state.draftVersion = (server.version ?? null) as any;
        this._conflictBanner.set(false);
        this._autosaveStatus.set('Merged untouched fields.');
      },
      error: () => this._autosaveStatus.set('Merge failed.')
    });
  }

  dismissConflict() { this._conflictBanner.set(false); }

  progressPercent = computed(() => computeProgressPercent(this.form, this.defs));
  progressHint = computed(() => {
    const pct = this.progressPercent();
    if (pct === 100) return 'All required steps completed.';
    if (pct >= 60) return 'Almost there—finish remaining required steps.';
    return 'Complete required steps to proceed smoothly.';
  });

  activeKey = computed<WizardStepKey>(() => {
    const child = this.route.firstChild;
    const seg = child?.snapshot.url?.[0]?.path as WizardStepKey | undefined;
    return (seg ?? 'customer') as WizardStepKey;
  });

  stepIndex = computed(() => this.defs.findIndex((d) => d.key === this.activeKey()));

  stepperSteps = computed(() =>
    this.defs.map((d) => ({
      key: d.key,
      label: d.label,
      route: d.route,
      optional: d.optional,
      complete: this.state.isStepValid(d.key),
    }))
  );

  onStepClick(route: string) {
    const clickedIndex = this.defs.findIndex((d) => d.route === route);
    const currentIndex = this.stepIndex();
    if (clickedIndex <= currentIndex) return this.goTo(route);
    const allPrevComplete = this.defs.slice(0, clickedIndex).every((d) => this.state.isStepValid(d.key));
    if (allPrevComplete) return this.goTo(route);
  }

  canBack = computed(() => this.stepIndex() > 0);
  currentStepValid = computed(() => this.state.isStepValid(this.activeKey()));

  canNext = computed(() => {
    const i = this.stepIndex();
    if (i < 0 || i >= this.defs.length - 1) return false;
    return this.currentStepValid();
  });

  isLastStep = computed(() => this.activeKey() === 'review');

  canSubmit = computed(() => {
    this.form.updateValueAndValidity({ emitEvent: false });
    return this.state.isStepValid('review');
  });

  blockedMessage = computed(() => {
    const i = this.stepIndex();
    if (i < 0) return null;
    const def = this.defs[i];
    if (this.isLastStep()) return this.canSubmit() ? null : def.invalidMessage(this.form);
    return this.canNext() ? null : def.invalidMessage(this.form);
  });

  goTo(seg: string) {
    this.router.navigate([seg], { relativeTo: this.route });
    this.presence.step(seg);
  }

  goBack() {
    const i = this.stepIndex();
    if (i <= 0) return;
    this.goTo(this.defs[i - 1].route);
  }

  goNext() {
    const i = this.stepIndex();
    if (i < 0 || i >= this.defs.length - 1) return;
    if (!this.canNext()) {
      const key = this.activeKey();
      const current = this.form.get(key);
      current?.markAllAsTouched();
      return;
    }
    this.goTo(this.defs[i + 1].route);
  }

  saveAndExit() {
    const id = this.state.draftId;
    if (!id) { this.router.navigateByUrl('/app/trips/drafts'); return; }
    if (this.readonly()) { this.router.navigateByUrl('/app/trips/drafts'); return; }
    this._autosaveStatus.set('Saving draft…');
    this.drafts.save(id, this.state.draftVersion, this.state.raw()).subscribe({
      next: (saved) => {
        this._serverDraft = saved;
        this.state.draftVersion = (saved.version ?? null) as any;
        this._autosaveStatus.set('Draft saved.');
        this.router.navigateByUrl('/app/trips/drafts');
      },
      error: (err: any) => {
        const msg = String(err?.message || err);
        if (msg.toLowerCase().includes('conflict') || msg.toLowerCase().includes('version')) {
          this._conflictBanner.set(true);
          this._autosaveStatus.set('Draft save conflict.');
        } else {
          this._autosaveStatus.set('Draft save failed.');
        }
      }
    });
  }

  submit() {
    if (!this.canSubmit()) { this.form.markAllAsTouched(); return; }
    const draftId = this.state.draftId;
    if (draftId) {
      this.drafts.submit(draftId).subscribe({
        next: () => this.drafts.delete(draftId).subscribe({ next: () => this.router.navigateByUrl('/app/trips'), error: () => this.router.navigateByUrl('/app/trips') }),
        error: () => this.router.navigateByUrl('/app/trips'),
      });
    } else {
      this.router.navigateByUrl('/app/trips');
    }
  }
}
