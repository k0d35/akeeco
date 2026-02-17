import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
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
        <a routerLink="/app/trips" routerLinkActive="active">Trips</a>
        <a routerLink="/app/trips/drafts" routerLinkActive="active">Drafts</a>
        <a routerLink="/app/trips/new/customer" routerLinkActive="active">New Trip</a>
      </nav>

      <div class="foot">
        <span class="pill gold">White • Gold • Black</span>
      </div>
    </aside>

    <main class="main">
      <header class="top">
        <div class="title">Sun Island Tours • Montego Bay</div>
        <div class="actions">
          <a class="btn secondary" href="/login">Logout</a>
        </div>
      </header>

      <section class="content">
        <router-outlet></router-outlet>
      </section>
    </main>
  </div>
  `,
  styles: [`
    .layout{ display:grid; grid-template-columns: 260px 1fr; min-height:100vh; }
    .side{ border-right:1px solid var(--border); padding:14px; background:#fff; }
    .brand{ display:flex; gap:10px; align-items:center; padding: 10px; border:1px solid var(--border); border-radius: var(--radius); }
    .logo{ width:42px; height:42px; border-radius:12px; display:flex; align-items:center; justify-content:center;
           background: var(--gold); font-weight:900; color:var(--fg); }
    .t{ font-weight: 900; }
    .s{ color: var(--muted); font-size:12px; margin-top:2px; }
    .nav{ margin-top: 14px; display:grid; gap:8px; }
    .nav a{ text-decoration:none; color:var(--fg); font-weight:900; padding:10px 12px; border-radius:12px; border:1px solid transparent; }
    .nav a.active{ border-color: var(--gold); background: var(--gold-weak); }
    .nav a:hover{ border-color: var(--border); }
    .foot{ margin-top: 14px; }

    .main{ background:#fff; }
    .top{ display:flex; justify-content: space-between; align-items:center; padding:14px; border-bottom:1px solid var(--border); }
    .title{ font-weight:900; }
    .actions{ display:flex; gap:10px; }
    .content{ padding:16px; background:#fff; }
  `]
})
export class StaffShellComponent {}
