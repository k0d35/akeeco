import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'public-footer',
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="f">
      <div class="container cols">
        <div>
          <h4><i class="bi bi-stars"></i>Services</h4>
          <a routerLink="/services/airport-transfers"><i class="bi bi-airplane"></i>Airport Transfers</a>
          <a routerLink="/services/private-tours"><i class="bi bi-map"></i>Private Tours</a>
          <a routerLink="/services/corporate-vip"><i class="bi bi-building"></i>Corporate & VIP</a>
          <a routerLink="/services/events"><i class="bi bi-calendar-event"></i>Events</a>
        </div>
        <div>
          <h4><i class="bi bi-compass"></i>Explore</h4>
          <a routerLink="/fleet"><i class="bi bi-truck"></i>Fleet</a>
          <a routerLink="/pricing"><i class="bi bi-cash-stack"></i>Pricing</a>
          <a routerLink="/book"><i class="bi bi-journal-plus"></i>Book</a>
        </div>
        <div>
          <h4><i class="bi bi-telephone"></i>Contact</h4>
          <a href="tel:+18765550132"><i class="bi bi-telephone-fill"></i>(876) 555-0132</a>
          <a href="https://wa.me/18765550132"><i class="bi bi-whatsapp"></i>WhatsApp</a>
          <a href="mailto:reservations@sunisland.tours"><i class="bi bi-envelope-fill"></i>reservations@sunisland.tours</a>
          <span><i class="bi bi-clock"></i>Daily 6:00 AM - 11:00 PM</span>
        </div>
        <div>
          <h4><i class="bi bi-shield-check"></i>Policies</h4>
          <a href="#"><i class="bi bi-x-circle"></i>Cancellation</a>
          <a href="#"><i class="bi bi-lock"></i>Privacy</a>
          <a href="#"><i class="bi bi-file-text"></i>Terms</a>
          <a routerLink="/staff/login"><i class="bi bi-person-lock"></i>Staff Login</a>
        </div>
      </div>
      <div class="bar">Serving Montego Bay - Negril - Ocho Rios - Airport (MBJ)</div>
    </footer>
  `,
  styles: [`
    .f{ margin-top:60px; background:linear-gradient(180deg,#111111,#1d1d1d); color:#e5e7eb; }
    .cols{ padding:42px 0; display:grid; gap:14px; grid-template-columns:repeat(4,minmax(0,1fr)); }
    h4{ margin:0 0 10px; color:#fff; display:flex; align-items:center; gap:8px; }
    a,span{ display:flex; align-items:center; gap:8px; margin:6px 0; color:#d1d5db; text-decoration:none; }
    .bar{ text-align:center; padding:12px; border-top:1px solid rgba(255,255,255,.15); color:#f3f4f6; font-weight:700; }
    @media (max-width:900px){ .cols{ grid-template-columns:repeat(2,1fr);} }
    @media (max-width:640px){ .cols{ grid-template-columns:1fr; } .bar{ font-size:12px; } }
  `]
})
export class PublicFooterComponent {}