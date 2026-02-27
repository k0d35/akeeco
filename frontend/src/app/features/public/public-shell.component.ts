import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { PublicHeaderComponent } from './layout/header.component';
import { PublicFooterComponent } from './layout/footer.component';
import { SeoService } from './seo.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, PublicHeaderComponent, PublicFooterComponent],
  template: `
    <public-header></public-header>
    <router-outlet></router-outlet>
    <public-footer></public-footer>
    <a class="mobileBook" routerLink="/book" aria-label="Book a ride"><i class="bi bi-journal-plus"></i>Book</a>
  `,
  styles: [`
    .mobileBook{ display:none; position:fixed; bottom:12px; right:12px; z-index:40; background:var(--color-sun-500); color:#1f2937; text-decoration:none; border-radius:999px; padding:12px 18px; font-weight:900; box-shadow:0 10px 24px rgba(0,0,0,.24); }
    .mobileBook{ display:none; align-items:center; gap:8px; }
    @media (max-width:900px){ .mobileBook{ display:inline-flex; } }
  `]
})
export class PublicShellComponent {
  private router = inject(Router);
  private seo = inject(SeoService);

  constructor() {
    this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe(() => {
      const u = this.router.url;
      if (u.startsWith('/services/airport-transfers')) this.seo.set('Airport Transfers', 'Premium airport transfers in Montego Bay with reliable flight-aware pickups.');
      else if (u.startsWith('/services/private-tours')) this.seo.set('Private Tours', 'Build a private island tour with flexible stops and luxury transport.');
      else if (u.startsWith('/services/corporate-vip')) this.seo.set('Corporate & VIP', 'Executive and VIP chauffeur service with priority dispatch.');
      else if (u.startsWith('/services/events')) this.seo.set('Events', 'Wedding, nightlife and special event limousine service.');
      else if (u.startsWith('/services')) this.seo.set('Services', 'Airport, tours, VIP and event chauffeur services across Jamaica.');
      else if (u.startsWith('/fleet')) this.seo.set('Fleet', 'Explore executive sedans, SUVs, vans and stretch limos.');
      else if (u.startsWith('/pricing')) this.seo.set('Pricing', 'Transparent chauffeur pricing with instant estimate tools.');
      else if (u.startsWith('/book')) this.seo.set('Book a Ride', 'Reserve your luxury transfer in minutes.');
      else if (u.startsWith('/manage-booking')) this.seo.set('Manage Booking', 'Update or cancel your booking using confirmation code.');
      else if (u.startsWith('/about')) this.seo.set('About', 'Learn about Sun Island Tours and our service guarantees.');
      else if (u.startsWith('/contact')) this.seo.set('Contact', 'Call, WhatsApp or send a quote request to Sun Island Tours.');
      else this.seo.set('Luxury Limo & Island Tours in Montego Bay', 'Airport transfers, VIP chauffeurs and private tours with tropical luxury service.');
    });
  }
}
