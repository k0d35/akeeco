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
        <h2>Chauffeur Ops</h2>
        <nav>
          <a routerLink="/staff/dashboard" routerLinkActive="active">Dashboard</a>
          <a routerLink="/staff/bookings" routerLinkActive="active">Bookings</a>
          <a routerLink="/staff/dispatch/board" routerLinkActive="active">Dispatch Board</a>
          <a routerLink="/staff/dispatch/calendar" routerLinkActive="active">Calendar</a>
          <a routerLink="/staff/fleet" routerLinkActive="active">Fleet</a>
          <a routerLink="/staff/drivers" routerLinkActive="active">Drivers</a>
          <a routerLink="/staff/pricing" routerLinkActive="active">Pricing</a>
          <a routerLink="/staff/analytics" routerLinkActive="active">Analytics</a>
          <a routerLink="/staff/settings" routerLinkActive="active">Settings</a>
          <a *ngIf="auth.user().role==='DRIVER'" routerLink="/staff/my-jobs" routerLinkActive="active">My Jobs</a>
          <a routerLink="/staff/profile" routerLinkActive="active">Profile</a>
        </nav>
      </aside>

      <main>
        <header class="top card">
          <input class="in search" [(ngModel)]="q" placeholder="Search bookings..." aria-label="Search bookings" />
          <button class="btn secondary" type="button" aria-label="Notifications">🔔</button>
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
    .layout{ min-height:100vh; display:grid; grid-template-columns:250px 1fr; background:#f8fafc; }
    .side{ border-right:1px solid var(--border); background:#fff; padding:14px; }
    h2{ margin:2px 4px 12px; }
    nav{ display:grid; gap:6px; }
    a{ text-decoration:none; color:var(--fg); border:1px solid transparent; border-radius:10px; padding:9px 10px; font-weight:800; }
    a.active{ border-color:var(--gold); background:var(--gold-weak); }
    main{ padding:14px; }
    .top{ display:grid; grid-template-columns:1fr auto auto auto; gap:8px; align-items:center; padding:10px; }
    .search{ min-width:250px; border:1px solid var(--border); border-radius:10px; padding:10px; }
    .user{ text-align:right; }
    .content{ margin-top:12px; max-width:1400px; }
    @media (max-width: 980px){
      .layout{ grid-template-columns:1fr; }
      .side{ border-right:none; border-bottom:1px solid var(--border); }
    }
  `]
})
export class StaffPortalShellComponent {
  auth = inject(AuthService);
  private router = inject(Router);
  q = '';

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/staff/login');
  }
}

