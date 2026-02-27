import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DraftApiService } from './draft-api.service';
import { TripDraftDto, DraftStatus } from './drafts.gql';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="page">
      <header class="head">
        <div>
          <h1>Trip Drafts</h1>
          <p class="sub">Server drafts. Shared drafts are visible to the dispatch team.</p>
        </div>
        <div class="actions">
          <button class="btn secondary" (click)="createNew()">+ New Trip</button>
          <button class="btn" (click)="refresh()">Refresh</button>
        </div>
      </header>

      <section class="card filters">
        <div class="row">
          <div class="seg">
            <button class="segBtn" [class.on]="scope==='mine'" (click)="setScope('mine')">My Drafts</button>
            <button class="segBtn" [class.on]="scope==='all'" (click)="setScope('all')">All (Perm)</button>
          </div>

          <div class="seg">
            <button class="segBtn" [class.on]="status==='ACTIVE'" (click)="setStatus('ACTIVE')">Active</button>
            <button class="segBtn" [class.on]="status==='SUBMITTED'" (click)="setStatus('SUBMITTED')">Submitted</button>
            <button class="segBtn" [class.on]="status==='ARCHIVED'" (click)="setStatus('ARCHIVED')">Archived</button>
          </div>

          <label class="check">
            <input type="checkbox" [(ngModel)]="sharedOnly" (change)="search()" />
            <span>Shared only</span>
          </label>
        </div>

        <div class="row">
          <input class="in" placeholder="Search name" [(ngModel)]="qName" (ngModelChange)="queueSearch()" (keyup.enter)="search()" />
          <input class="in" placeholder="Phone" [(ngModel)]="qPhone" (ngModelChange)="queueSearch()" (keyup.enter)="search()" />
          <input class="in" placeholder="Pickup contains..." [(ngModel)]="qPickup" (ngModelChange)="queueSearch()" (keyup.enter)="search()" />
          <button class="btn secondary" (click)="clear()">Clear</button>
          <button class="btn gold" (click)="search()">Search</button>
        </div>
      </section>

      <div class="loading" *ngIf="loading">Loading…</div>
      <div class="err" *ngIf="error">{{ error }}</div>

      <div class="empty card" *ngIf="!loading && drafts.length===0">
        <h3>No drafts found</h3>
        <p>Try filters, or create a new trip draft.</p>
        <button class="btn" (click)="createNew()">Create New Trip</button>
      </div>

      <div class="list" *ngIf="drafts.length>0">
        <div class="card item" *ngFor="let d of drafts">
          <div class="main">
            <div class="title">
              {{ d.customerName || 'Unnamed customer' }}
              <span class="pill gold" *ngIf="d.shared">Shared</span>
            </div>
            <div class="meta">
              <div><b>Phone:</b> {{ d.customerPhone || '—' }}</div>
              <div><b>Pickup:</b> {{ d.pickupText || '—' }}</div>
              <div><b>Date/Time:</b> {{ (d.pickupDate || '—') }} {{ (d.pickupTime || '') }}</div>
              <div class="small"><b>Updated:</b> {{ format(d.updatedAt) }}</div>
            </div>
          </div>
          <div class="buttons">
            <button class="btn" (click)="resume(d)">Resume</button>
            <button class="btn danger" (click)="remove(d)">Delete</button>
          </div>
        </div>
      </div>

      <footer class="foot">
        <a routerLink="/staff/trips">← Back to Trips</a>
      </footer>
    </div>
  `,
  styles: [`
    .page{ padding: 16px; }
    .head{ display:flex; justify-content: space-between; align-items:flex-start; gap:12px; }
    .sub{ color: var(--muted); margin-top: 6px; }
    .actions{ display:flex; gap:10px; }

    .filters{ padding: 12px; margin-top: 12px; }
    .row{ display:flex; gap:10px; align-items:center; flex-wrap:wrap; }
    .seg{ display:flex; gap:6px; background:#fff; border:1px solid var(--border); border-radius: 12px; padding:4px; }
    .segBtn{ padding:8px 10px; border-radius:10px; border:1px solid transparent; background:transparent; font-weight:900; cursor:pointer; }
    .segBtn.on{ border-color: var(--gold); background: var(--gold-weak); }
    .check{ display:flex; gap:8px; align-items:center; font-weight:900; }

    .in{ flex:1; min-width: 220px; padding:12px; border-radius:12px; border:1px solid var(--border); outline:none; }
    .in:focus{ border-color: var(--gold); box-shadow: 0 0 0 4px rgba(200,162,74,.15); }

    .list{ margin-top: 14px; display:grid; gap:12px; }
    .item{ display:flex; justify-content: space-between; gap:12px; padding:14px; }
    .title{ font-weight: 900; display:flex; gap:10px; align-items:center; }
    .meta{ margin-top: 8px; display:grid; gap:4px; }
    .small{ color: var(--muted); font-size: 12px; margin-top: 6px; }

    .buttons{ display:flex; flex-direction:column; gap:8px; min-width:140px; }
    .btn.danger{ background: var(--danger); border-color: var(--danger); }

    .loading{ margin-top: 12px; color: var(--muted); }
    .err{ margin-top: 12px; color: var(--danger); }

    .empty{ margin-top: 14px; padding: 16px; }
    .foot{ margin-top: 16px; color: var(--muted); }
    a{ color: var(--fg); text-decoration:none; }
    a:hover{ text-decoration: underline; }

    @media (max-width: 900px){
      .head{ flex-direction:column; }
      .actions{ width:100%; flex-wrap:wrap; }
      .row{ align-items:stretch; }
      .row .btn{ min-width: 120px; }
      .item{ flex-direction:column; }
      .buttons{ flex-direction:row; min-width:0; }
    }

    @media (max-width: 640px){
      .page{ padding:12px; }
      .actions .btn{ width:100%; }
      .seg{ width:100%; overflow:auto; }
      .check{ width:100%; }
      .in{ min-width:0; width:100%; }
      .row .btn{ width:100%; }
      .buttons{ display:grid; grid-template-columns: 1fr 1fr; width:100%; }
      .buttons .btn{ width:100%; }
    }
  `],
})
export class DraftsListPageComponent {
  private api = inject(DraftApiService);
  private router = inject(Router);

  drafts: TripDraftDto[] = [];
  loading = false;
  error: string | null = null;

  scope: 'mine' | 'all' = 'mine';
  status: DraftStatus = 'ACTIVE';

  qName = '';
  qPhone = '';
  qPickup = '';
  sharedOnly = false;
  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() { this.refresh(); }

  setScope(v: 'mine' | 'all') { this.scope = v; this.search(); }
  setStatus(v: DraftStatus) { this.status = v; this.search(); }

  refresh() { this.search(); }

  clear() {
    this.qName = ''; this.qPhone = ''; this.qPickup = ''; this.sharedOnly = false;
    this.search();
  }

  queueSearch(delayMs = 300) {
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.search(), delayMs);
  }

  search() {
    this.loading = true; this.error = null;
    const hasAny = !!(this.qName || this.qPhone || this.qPickup);

    const load$ = hasAny
      ? this.api.search({ status: this.status, name: this.qName || null, phone: this.qPhone || null, pickup: this.qPickup || null })
      : (this.scope === 'mine' ? this.api.listMine(this.status) : this.api.listAll(this.status));

    load$.subscribe({
      next: (rows) => {
        const filtered = this.sharedOnly ? rows.filter(r => !!r.shared) : rows;
        this.drafts = [...filtered].sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
        this.loading = false;
      },
      error: (e: any) => { this.error = String(e?.message || e); this.loading = false; }
    });
  }

  createNew() {
    this.api.create(false).subscribe({
      next: (d) => this.router.navigate(['/staff/trips/new/customer'], { queryParams: { draftId: d.id } }),
      error: (e: any) => this.error = String(e?.message || e)
    });
  }

  resume(d: TripDraftDto) {
    this.router.navigate(['/staff/trips/new/customer'], { queryParams: { draftId: d.id } });
  }

  remove(d: TripDraftDto) {
    this.api.delete(d.id).subscribe({
      next: () => this.search(),
      error: (e: any) => this.error = String(e?.message || e)
    });
  }

  format(iso: string): string {
    try { return new Date(iso).toLocaleString(); } catch { return iso; }
  }

}
