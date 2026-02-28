import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeroComponent } from '../ui/hero.component';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, HeroComponent],
  template: `
    <si-hero
      title="Services"
      subtitle="Premium chauffeur solutions for airport transfers, tours, executive trips and events."
      heroBg="var(--bg-hero-services)"
      mediaSrc="/assets/images/hero-services.svg"
      mediaAlt="Service categories overview"></si-hero>
    <div class="container grid">
      <article class="card p"><h3>Airport Transfers</h3><p>Flight-aware pickups and MBJ resort routes.</p><a routerLink="/services/airport-transfers" class="btn secondary">Explore</a></article>
      <article class="card p"><h3>Private Tours</h3><p>Custom itineraries across Jamaica highlights.</p><a routerLink="/services/private-tours" class="btn secondary">Explore</a></article>
      <article class="card p"><h3>Corporate & VIP</h3><p>Priority dispatch, billing, and executive standards.</p><a routerLink="/services/corporate-vip" class="btn secondary">Explore</a></article>
      <article class="card p"><h3>Events</h3><p>Weddings, nightlife and group transport planning.</p><a routerLink="/services/events" class="btn secondary">Explore</a></article>
    </div>
  `,
  styles: [`.grid{ margin-top:20px; display:grid; gap:10px; grid-template-columns:repeat(4,minmax(0,1fr)); } .p{ padding:14px; } @media (max-width:1000px){ .grid{ grid-template-columns:repeat(2,1fr);} } @media (max-width:640px){ .grid{ grid-template-columns:1fr; } }`]
})
export class ServicesHubPageComponent {}
