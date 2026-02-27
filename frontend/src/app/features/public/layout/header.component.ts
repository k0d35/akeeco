import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  standalone: true,
  selector: 'public-header',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="hdr">
      <div class="container row">
        <a routerLink="/" class="logo" aria-label="Sun Island Tours Home">
          <span class="logoIcon" aria-hidden="true">SI</span>
          <span>Sun Island Tours</span>
        </a>

        <nav class="desktopNav" aria-label="Primary navigation">
          <a routerLink="/" routerLinkActive="on" [routerLinkActiveOptions]="{ exact: true }"><i class="bi bi-house-door"></i>Home</a>
          <a routerLink="/services" routerLinkActive="on"><i class="bi bi-grid"></i>Services</a>
          <a routerLink="/fleet" routerLinkActive="on"><i class="bi bi-truck"></i>Fleet</a>
          <a routerLink="/pricing" routerLinkActive="on"><i class="bi bi-cash-stack"></i>Pricing</a>
          <a routerLink="/book" routerLinkActive="on"><i class="bi bi-journal-plus"></i>Book</a>
          <a routerLink="/about" routerLinkActive="on"><i class="bi bi-info-circle"></i>About</a>
          <a routerLink="/contact" routerLinkActive="on"><i class="bi bi-envelope"></i>Contact</a>
          <a routerLink="/staff/login" routerLinkActive="on"><i class="bi bi-shield-lock"></i>Staff Login</a>
        </nav>

        <div class="cta">
          <a class="btn secondary hideMobile" routerLink="/pricing">Get a Quote</a>
          <a class="btn hideTablet" routerLink="/book">Book a Ride</a>
          <a class="iconBtn hideTablet" href="tel:+18765550132" aria-label="Call now"><i class="bi bi-telephone"></i></a>
          <button class="menuBtn" type="button" aria-label="Open menu" (click)="menuOpen = !menuOpen" [attr.aria-expanded]="menuOpen"><i class="bi bi-list"></i></button>
        </div>
      </div>

      <div class="mobileMenu" *ngIf="menuOpen">
        <a routerLink="/" (click)="closeMenu()"><i class="bi bi-house-door"></i>Home</a>
        <a routerLink="/services" (click)="closeMenu()"><i class="bi bi-grid"></i>Services</a>
        <a routerLink="/fleet" (click)="closeMenu()"><i class="bi bi-truck"></i>Fleet</a>
        <a routerLink="/pricing" (click)="closeMenu()"><i class="bi bi-cash-stack"></i>Pricing</a>
        <a routerLink="/book" (click)="closeMenu()"><i class="bi bi-journal-plus"></i>Book</a>
        <a routerLink="/about" (click)="closeMenu()"><i class="bi bi-info-circle"></i>About</a>
        <a routerLink="/contact" (click)="closeMenu()"><i class="bi bi-envelope"></i>Contact</a>
        <a routerLink="/staff/login" (click)="closeMenu()"><i class="bi bi-shield-lock"></i>Staff Login</a>
        <div class="mobileActions">
          <a class="btn secondary" routerLink="/pricing" (click)="closeMenu()">Get a Quote</a>
          <a class="btn" routerLink="/book" (click)="closeMenu()">Book a Ride</a>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .hdr{ position:sticky; top:0; z-index:50; backdrop-filter: blur(8px); background:rgba(255,255,255,.94); border-bottom:1px solid rgba(0,0,0,.12); }
    .row{ display:flex; align-items:center; gap:10px; min-height:70px; }
    .logo{ display:flex; align-items:center; gap:8px; text-decoration:none; color:var(--color-ocean-900); font-weight:900; white-space:nowrap; }
    .logoIcon{ width:26px; height:26px; border-radius:999px; display:grid; place-items:center; font-size:11px; background:var(--color-sun-500); color:#1f2937; }
    .desktopNav{ display:flex; gap:8px; flex-wrap:wrap; margin-left:12px; }
    .desktopNav a{ text-decoration:none; color:var(--color-text-900); font-weight:700; padding:8px; border-radius:8px; display:flex; align-items:center; gap:6px; }
    .desktopNav a.on{ background:var(--gold-weak); color:var(--color-ocean-900); border:1px solid var(--color-sun-500); }
    .cta{ margin-left:auto; display:flex; gap:8px; align-items:center; }
    .iconBtn{ display:inline-grid; place-items:center; min-width:42px; height:38px; border:1px solid var(--color-sun-500); border-radius:999px; text-decoration:none; color:var(--color-ocean-900); font-weight:700; padding:0 12px; }
    .menuBtn{ display:none; border:1px solid var(--border); background:#fff; border-radius:10px; height:38px; width:42px; cursor:pointer; font-size:18px; }
    .mobileMenu{ display:none; }

    @media (max-width:1100px){
      .hideTablet{ display:none; }
    }
    @media (max-width:960px){
      .desktopNav, .hideMobile{ display:none; }
      .menuBtn{ display:inline-block; }
      .mobileMenu{ display:grid; gap:6px; padding:10px 16px 14px; border-top:1px solid var(--border); background:#fff; }
      .mobileMenu a{ text-decoration:none; color:var(--color-text-900); font-weight:700; padding:8px 10px; border-radius:8px; display:flex; align-items:center; gap:8px; }
      .mobileMenu a:hover{ background:var(--gold-weak); }
      .mobileActions{ display:grid; gap:8px; margin-top:6px; }
      .mobileActions .btn{ text-align:center; }
    }
  `]
})
export class PublicHeaderComponent {
  menuOpen = false;
  closeMenu() { this.menuOpen = false; }
}
