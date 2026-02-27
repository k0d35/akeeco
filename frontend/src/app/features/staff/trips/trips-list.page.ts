import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { TenantPresenceHubService } from '../../../core/presence/tenant-presence-hub.service';
import { presenceForEntity } from '../../../core/presence/presence-dots.util';
import { AuthService } from '../../../shared-data/auth/auth.service';
import { BookingsService } from '../data/bookings.service';

interface TripRow {
  id: string;
  status: 'ACTIVE' | 'INACTIVE' | 'COMPLETED' | string;
  customerName: string;
  pickupText: string;
  pickupDateTime: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page">
      <header class="head">
        <div>
          <h1>Trips</h1>
          <p class="sub">Active trips with live presence indicators.</p>
        </div>

        <div class="actions">
          <a class="btn secondary" routerLink="/staff/trips/drafts">Drafts</a>
          <a class="btn gold" routerLink="/staff/trips/new/customer">+ New Trip</a>
        </div>
      </header>

      <section class="card">
        <div class="tableWrap">
          <table class="tbl">
            <thead>
              <tr>
                <th>Status</th>
                <th>Customer</th>
                <th>Pickup Location</th>
                <th>Pickup Time</th>
                <th>Presence</th>
              </tr>
            </thead>

            <tbody>
              <tr *ngFor="let t of trips">
                <td><span class="pill" [class.gold]="t.status==='ACTIVE'">{{ t.status }}</span></td>
                <td class="strong">{{ t.customerName }}</td>
                <td>{{ t.pickupText }}</td>
                <td>{{ t.pickupDateTime }}</td>
                <td>
                  <ng-container *ngIf="presenceForTrip(t.id) as p">
                    <div class="presenceBlock" [attr.title]="p.tooltip">
                      <div class="presenceRow">
                        <span class="pDot" *ngFor="let d of p.dots" [class.inactive]="!d.active">{{ d.initials }}</span>
                        <span class="more" *ngIf="p.moreDots">+{{ p.moreDots }}</span>
                      </div>
                      <div class="presenceLines" *ngIf="p.lines?.length">
                        <span class="line" *ngFor="let l of p.lines" [class.inactive]="!l.active">{{ l.text }}</span>
                        <span class="moreLines" *ngIf="p.moreLines">+{{ p.moreLines }} more</span>
                      </div>
                    </div>
                  </ng-container>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .page{ padding: 16px; }
    .head{ display:flex; justify-content: space-between; align-items:flex-start; gap:12px; }
    .sub{ color: var(--muted); margin-top: 6px; }
    .actions{ display:flex; gap:10px; }
    .tableWrap{ overflow-x:auto; }
    .tbl{ width:100%; border-collapse: collapse; margin-top: 10px; }
    th, td{ text-align:left; padding:10px; border-top:1px solid #F1F2F4; vertical-align: top; }
    th{ font-size:12px; color: var(--muted); font-weight: 900; border-top: none; }
    .strong{ font-weight: 900; }

    .presenceBlock { display:flex; flex-direction:column; gap:6px; min-width: 210px; }
    .presenceRow { display:flex; gap:6px; align-items:center; }
    .pDot {
      width:20px; height:20px; border-radius:999px;
      display:flex; align-items:center; justify-content:center;
      background: var(--gold); border:1px solid var(--gold);
      color: var(--fg); font-weight:900; font-size:10px;
    }
    .pDot.inactive { background:#E5E7EB; border-color:#E5E7EB; color: var(--muted); }
    .more{ font-size:11px; font-weight:900; color: var(--muted); }

    .presenceLines { display:flex; flex-wrap:wrap; gap:6px; }
    .line {
      font-size:11px; font-weight:800;
      padding:2px 8px; border-radius:999px;
      border:1px solid var(--border); background:#fff; color:#111827;
    }
    .line.inactive { color: var(--muted); border-color:#E5E7EB; background:#F9FAFB; }
    .moreLines { font-size:11px; font-weight:900; color: var(--muted); padding-left:2px; }

    @media (max-width: 900px){
      .head{ flex-direction:column; }
      .actions{ width:100%; flex-wrap:wrap; }
      .tbl{ min-width: 760px; }
    }

    @media (max-width: 640px){
      .page{ padding: 12px; }
      .actions .btn{ width:100%; }
      th, td{ padding:8px; font-size:13px; }
    }
  `],
})
export class TripsListPageComponent implements OnInit {
  private hub = inject(TenantPresenceHubService);
  private auth = inject(AuthService);
  private bookings = inject(BookingsService);

  trips: TripRow[] = [];

  presenceByEntity = toSignal(this.hub.presenceByEntity$, { initialValue: {} as Record<string, any[]> });

  ngOnInit(): void {
    const tenantId = this.auth.user().tenantId;
    this.hub.connect(tenantId);
    this.bookings.refresh();
    this.bookings.bookings$.subscribe((rows) => {
      this.trips = rows.map((b) => ({
        id: b.id,
        status: b.status,
        customerName: b.customerName,
        pickupText: b.pickupLocation,
        pickupDateTime: new Date(b.pickupTime).toLocaleString(),
      }));
    });
  }

  presenceForTrip(tripId: string) {
    const map = this.presenceByEntity();
    const viewers = map[`TRIP:${tripId}`] || [];
    return presenceForEntity(viewers, 4, 2);
  }
}
