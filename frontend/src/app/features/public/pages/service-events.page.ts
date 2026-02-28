import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeroComponent } from '../ui/hero.component';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, HeroComponent],
  template: `
    <si-hero
      title="Events Chauffeur Service"
      subtitle="Weddings, nightlife, and group transportation with premium presentation."
      heroBg="var(--bg-hero-events)"
      mediaSrc="/assets/images/hero-events.svg"
      mediaAlt="Event transportation"></si-hero>
    <div class="container block">
      <div class="grid">
        <article class="card p"><h3>Weddings</h3><p>Elegant arrivals and departures with coordinated timing.</p></article>
        <article class="card p"><h3>Night Out</h3><p>Multi-stop routing with safe, reliable return plans.</p></article>
        <article class="card p"><h3>Group Events</h3><p>Vehicle planning for conferences and private parties.</p></article>
      </div>
      <div class="card p">
        <h3>Planning Checklist</h3>
        <ul><li>Guest count & pickup zones</li><li>Event timeline and wait windows</li><li>Preferred vehicle classes</li><li>Return trip logistics</li></ul>
        <a class="btn" routerLink="/book">Request Event Quote</a>
      </div>
    </div>
  `,
  styles: [`.block{ margin-top:20px; display:grid; gap:10px; } .grid{ display:grid; gap:10px; grid-template-columns:repeat(3,1fr);} .p{ padding:14px; background-image:linear-gradient(180deg, rgba(255,255,255,.92), rgba(255,255,255,.95)), var(--bg-hero-events); background-size:cover; background-position:center; } @media (max-width:900px){ .grid{ grid-template-columns:1fr; } }`]
})
export class ServiceEventsPageComponent {}

