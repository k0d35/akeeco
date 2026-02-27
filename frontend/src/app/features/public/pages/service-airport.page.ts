import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeroComponent } from '../ui/hero.component';
import { FaqAccordionComponent } from '../ui/faq-accordion.component';
import { PublicContentService } from '../data/public-content.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, HeroComponent, FaqAccordionComponent],
  template: `
    <si-hero title="Airport Transfers" subtitle="Reliable MBJ arrivals and departures with polished chauffeur service."></si-hero>
    <div class="container block">
      <div class="card p">
        <h3>Flight Number Supported Pickups</h3>
        <p>Provide your flight number and we adjust for delays in real time.</p>
        <a class="btn" routerLink="/book">Book Airport Transfer</a>
      </div>
      <div class="card p">
        <h3>Waiting Policy</h3>
        <p>Grace period is included. Waiting charges apply after grace window.</p>
      </div>
      <div class="card p">
        <h3>Popular Routes</h3>
        <ul><li>MBJ → Half Moon Resort</li><li>MBJ → Hyatt Ziva Rose Hall</li><li>MBJ → Secrets St. James</li><li>MBJ → Negril Hotels</li></ul>
      </div>
      <h3>FAQs</h3>
      <faq-accordion [items]="content.airportFaqs"></faq-accordion>
    </div>
  `,
  styles: [`.block{ margin-top:20px; display:grid; gap:10px; } .p{ padding:14px; }`]
})
export class ServiceAirportPageComponent { content = inject(PublicContentService); }

