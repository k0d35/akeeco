import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HeroComponent } from '../ui/hero.component';
import { WaveDividerComponent } from '../ui/wave-divider.component';
import { SectionComponent } from '../ui/section.component';
import { StepsComponent } from '../ui/steps.component';
import { VehicleCardComponent } from '../ui/vehicle-card.component';
import { TestimonialCardComponent } from '../ui/testimonial-card.component';
import { PublicContentService } from '../data/public-content.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, HeroComponent, WaveDividerComponent, SectionComponent, StepsComponent, VehicleCardComponent, TestimonialCardComponent],
  template: `
    <si-hero
      title="Luxury Limo & Island Tours in Montego Bay"
      subtitle="Airport transfers, VIP chauffeurs, and private tours—on time, every time."
      heroBg="var(--bg-hero-home)"
      mediaSrc="/assets/images/hero-home.svg"
      mediaAlt="Luxury chauffeur vehicle in Montego Bay">
      <div hero-actions>
        <a class="btn" routerLink="/book">Book a Ride</a>
        <a class="btn secondary" routerLink="/pricing">Get a Quote</a>
        <a class="btn secondary" href="https://wa.me/18765550132">WhatsApp</a>
      </div>
    </si-hero>
    <div class="container quoteCard card">
      <form [formGroup]="quickQuote" (ngSubmit)="submitQuote()" class="grid">
        <input class="in" formControlName="pickup" placeholder="Pickup" aria-label="Pickup address" />
        <input class="in" formControlName="dropoff" placeholder="Dropoff" aria-label="Dropoff address" />
        <input class="in" type="datetime-local" formControlName="pickupDateTime" aria-label="Pickup date and time" />
        <select class="in" formControlName="vehicleClass" aria-label="Vehicle class">
          <option value="SEDAN">Executive Sedan</option><option value="SUV">Luxury SUV</option><option value="VAN">Van</option><option value="LIMO">Stretch Limo</option>
        </select>
        <button class="btn" type="submit">Get Instant Estimate</button>
      </form>
    </div>

    <si-section>
      <div class="container cards4">
        <article class="card p"><h3>Airport Transfers</h3><ul><li>Flight-aware pickups</li><li>Meet and greet</li><li>Resort routes</li></ul><a routerLink="/services/airport-transfers">Explore</a></article>
        <article class="card p"><h3>Private Tours</h3><ul><li>Custom itinerary</li><li>Flexible stops</li><li>Day packages</li></ul><a routerLink="/services/private-tours">Explore</a></article>
        <article class="card p"><h3>Corporate/VIP</h3><ul><li>Priority dispatch</li><li>Executive standards</li><li>Monthly billing</li></ul><a routerLink="/services/corporate-vip">Explore</a></article>
        <article class="card p"><h3>Events</h3><ul><li>Weddings</li><li>Night out</li><li>Group logistics</li></ul><a routerLink="/services/events">Explore</a></article>
      </div>
    </si-section>

    <si-section [alt]="true">
      <div class="container">
        <h2>How It Works</h2>
        <si-steps [steps]="steps"></si-steps>
      </div>
    </si-section>

    <si-section>
      <div class="container">
        <h2>Fleet Preview</h2>
        <div class="grid4"><vehicle-card *ngFor="let v of content.vehicles" [vehicle]="v"></vehicle-card></div>
      </div>
    </si-section>

    <si-section [alt]="true">
      <div class="container">
        <h2>What Guests Say</h2>
        <div class="grid3"><testimonial-card *ngFor="let t of content.testimonials" [item]="t"></testimonial-card></div>
      </div>
    </si-section>

    <si-wave-divider></si-wave-divider>
    <section class="finalCta">
      <div class="container ctaRow">
        <div>
          <h2>Ready to ride? Book in under 2 minutes.</h2>
        </div>
        <div class="actions">
          <a class="btn" routerLink="/book">Book</a>
          <a class="btn secondary" routerLink="/pricing">Get Quote</a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .quoteCard{ margin-top:-42px; position:relative; z-index:10; padding:12px; }
    .grid{ display:grid; gap:8px; grid-template-columns:2fr 2fr 1.3fr 1fr auto; }
    .cards4{ display:grid; gap:10px; grid-template-columns:repeat(4,minmax(0,1fr)); }
    .p{ padding:14px; } h3{ margin:0 0 6px; } ul{ margin:0; padding-left:18px; color:var(--color-text-600);}
    .grid4{ display:grid; gap:10px; grid-template-columns:repeat(4,minmax(0,1fr)); }
    .grid3{ display:grid; gap:10px; grid-template-columns:repeat(3,minmax(0,1fr)); }
    .finalCta{
      background-image:linear-gradient(135deg, rgba(31,31,31,.72), rgba(58,58,58,.62)), var(--bg-hero-home);
      background-size:cover;
      background-position:center;
      color:#fff;
      padding:36px 0;
    }
    .ctaRow{ display:flex; justify-content:space-between; gap:12px; align-items:center; }
    .actions{ display:flex; gap:8px; }
    @media (max-width:1100px){ .grid{ grid-template-columns:1fr 1fr; } .cards4,.grid4{ grid-template-columns:repeat(2,1fr);} .grid3{ grid-template-columns:1fr; } }
    @media (max-width:640px){
      .quoteCard{ margin-top:-18px; }
      .grid{ grid-template-columns:1fr; }
      .cards4,.grid4{ grid-template-columns:1fr; }
      .ctaRow{ flex-direction:column; align-items:flex-start; }
      .actions{ width:100%; }
      .actions .btn{ width:100%; text-align:center; }
    }
  `]
})
export class HomePageComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  content = inject(PublicContentService);

  steps = [
    { title: 'Enter pickup & drop-off', text: 'Tell us where and when.' },
    { title: 'Choose vehicle class', text: 'Pick the style that fits your trip.' },
    { title: 'Confirm and receive updates', text: 'Get SMS/email updates before pickup.' },
  ];

  quickQuote = this.fb.group({
    pickup: ['', Validators.required],
    dropoff: ['', Validators.required],
    pickupDateTime: ['', Validators.required],
    vehicleClass: ['SEDAN', Validators.required],
  });

  submitQuote() {
    if (this.quickQuote.invalid) return;
    this.router.navigate(['/book'], { queryParams: this.quickQuote.value });
  }
}
