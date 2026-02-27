import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../shared-data/auth/auth.service';
import { ToastComponent } from '../../shared/ui/toast.component';

@Component({
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, FormsModule, ToastComponent],
  template: `
    <div class="layout">
      <aside class="side">
        <div class="brand">
          <div class="logo">SI</div>
          <div>
            <div class="t">Sun Island Tours</div>
            <div class="s">Dispatch Console</div>
          </div>
        </div>

        <nav class="nav">
          <button class="groupBtn"
                  type="button"
                  [class.active]="isTripsActive()"
                  (click)="toggleTripsMenu()">
            <span class="left">
              <i class="bi bi-signpost-split" aria-hidden="true"></i>
              <span>Trips</span>
            </span>
            <i class="bi" [class.bi-chevron-down]="!tripsMenuOpen" [class.bi-chevron-up]="tripsMenuOpen" aria-hidden="true"></i>
          </button>

          <div class="submenu" *ngIf="tripsMenuOpen">
            <a routerLink="/staff/trips" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
              <i class="bi bi-list-ul" aria-hidden="true"></i>
              <span>All Trips</span>
            </a>
            <a routerLink="/staff/trips/drafts" routerLinkActive="active">
              <i class="bi bi-file-earmark-text" aria-hidden="true"></i>
              <span>Drafts</span>
            </a>
            <a routerLink="/staff/trips/new/customer" routerLinkActive="active">
              <i class="bi bi-plus-circle" aria-hidden="true"></i>
              <span>New Trip</span>
            </a>
          </div>

          <a routerLink="/staff/dashboard" routerLinkActive="active">
            <i class="bi bi-speedometer2" aria-hidden="true"></i><span>Dashboard</span>
          </a>
          <a routerLink="/staff/bookings" routerLinkActive="active">
            <i class="bi bi-journal-check" aria-hidden="true"></i><span>Bookings</span>
          </a>
          <a routerLink="/staff/dispatch/board" routerLinkActive="active">
            <i class="bi bi-kanban" aria-hidden="true"></i><span>Dispatch Board</span>
          </a>
          <a routerLink="/staff/dispatch/calendar" routerLinkActive="active">
            <i class="bi bi-calendar3" aria-hidden="true"></i><span>Calendar</span>
          </a>
          <a routerLink="/staff/fleet" routerLinkActive="active">
            <i class="bi bi-truck" aria-hidden="true"></i><span>Fleet</span>
          </a>
          <a routerLink="/staff/drivers" routerLinkActive="active">
            <i class="bi bi-people" aria-hidden="true"></i><span>Drivers</span>
          </a>
          <a routerLink="/staff/pricing" routerLinkActive="active">
            <i class="bi bi-cash-stack" aria-hidden="true"></i><span>Pricing</span>
          </a>
          <a routerLink="/staff/analytics" routerLinkActive="active">
            <i class="bi bi-graph-up-arrow" aria-hidden="true"></i><span>Analytics</span>
          </a>
          <a routerLink="/staff/settings" routerLinkActive="active">
            <i class="bi bi-gear" aria-hidden="true"></i><span>Settings</span>
          </a>
          <a *ngIf="auth.user().role==='DRIVER'" routerLink="/staff/my-jobs" routerLinkActive="active">
            <i class="bi bi-briefcase" aria-hidden="true"></i><span>My Jobs</span>
          </a>
          <a routerLink="/staff/profile" routerLinkActive="active">
            <i class="bi bi-person-circle" aria-hidden="true"></i><span>Profile</span>
          </a>
        </nav>

        <div class="foot">
          <span class="pill gold">White • Gold • Black</span>
        </div>
      </aside>

      <main class="main">
        <header class="top">
          <div class="title">Sun Island Tours • Montego Bay</div>
          <input class="in search" [(ngModel)]="q" placeholder="Search bookings..." aria-label="Search bookings" />
          <button class="btn secondary iconBtn" type="button" aria-label="Notifications">
            <i class="bi bi-bell"></i>
          </button>
          <div class="user">
            <div>{{ auth.user().name }}</div>
            <span class="pill gold">{{ auth.user().role }}</span>
          </div>
          <button class="btn secondary" type="button" (click)="logout()">Logout</button>
        </header>

        <section class="content">
          <router-outlet></router-outlet>
        </section>
      </main>
    </div>
    <app-toast></app-toast>
  `,
  styles: [`
    .layout{ min-height:100vh; display:grid; grid-template-columns:260px 1fr; background:#fff; }
    .side{ border-right:1px solid var(--border); background:#fff; padding:14px; }
    .brand{ display:flex; gap:10px; align-items:center; padding:10px; border:1px solid var(--border); border-radius:var(--radius); }
    .logo{ width:42px; height:42px; border-radius:12px; display:flex; align-items:center; justify-content:center; background:var(--gold); font-weight:900; color:var(--fg); }
    .t{ font-weight:900; }
    .s{ color:var(--muted); font-size:12px; margin-top:2px; }

    .nav{ margin-top:14px; display:grid; gap:8px; }
    .groupBtn{
      width:100%; display:flex; justify-content:space-between; align-items:center; gap:10px;
      border:1px solid transparent; border-radius:12px; padding:10px 12px; background:#fff;
      color:var(--fg); font-weight:900; cursor:pointer;
    }
    .groupBtn .left{ display:flex; align-items:center; gap:10px; }
    .groupBtn.active{ border-color:var(--gold); background:var(--gold-weak); }
    .submenu{ display:grid; gap:6px; margin:-2px 0 2px; padding-left:12px; }

    .nav a{
      text-decoration:none; color:var(--fg); border:1px solid transparent; border-radius:12px;
      padding:10px 12px; font-weight:800; display:flex; align-items:center; gap:10px;
    }
    .nav a.active{ border-color:var(--gold); background:var(--gold-weak); }
    .nav a:hover, .groupBtn:hover{ border-color:var(--border); }

    .foot{ margin-top:14px; }

    .main{ background:#fff; padding:14px; }
    .top{
      display:grid; grid-template-columns:auto 1fr auto auto auto; gap:8px; align-items:center;
      padding:12px; border:1px solid var(--border); border-radius:var(--radius); background:#fff;
    }
    .title{ font-weight:900; white-space:nowrap; }
    .search{ min-width:220px; border:1px solid var(--border); border-radius:10px; padding:10px; }
    .iconBtn{ display:flex; align-items:center; justify-content:center; width:42px; padding:0; }
    .user{ text-align:right; }
    .content{ margin-top:12px; max-width:1400px; }

    .bi{ line-height:1; font-size:14px; }

    @media (max-width: 980px){
      .layout{ grid-template-columns:1fr; }
      .side{ border-right:none; border-bottom:1px solid var(--border); }
      .top{ grid-template-columns:1fr auto auto auto; }
      .title{ grid-column:1 / -1; }
    }

    @media (max-width: 640px){
      .main, .side{ padding:12px; }
      .top{ grid-template-columns:1fr auto; }
      .search{ grid-column:1 / -1; min-width:0; }
      .user{ text-align:left; }
      .iconBtn{ width:40px; }
    }
  `]
})
export class StaffPortalShellComponent {
  auth = inject(AuthService);
  private router = inject(Router);
  q = '';
  tripsMenuOpen = this.isTripsActive();

  isTripsActive(): boolean {
    return this.router.url.startsWith('/staff/trips');
  }

  toggleTripsMenu(): void {
    this.tripsMenuOpen = !this.tripsMenuOpen;
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/staff/login');
  }
}