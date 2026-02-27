import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HeroComponent } from '../ui/hero.component';
import { FaqAccordionComponent } from '../ui/faq-accordion.component';
import { PublicContentService } from '../data/public-content.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HeroComponent, FaqAccordionComponent],
  template: `
    <si-hero title="Private Tours" subtitle="Curated island experiences with premium transport and flexible stops."></si-hero>
    <div class="container block">
      <div class="card p">
        <h3>Build Your Tour</h3>
        <label>Duration
          <select class="in" [(ngModel)]="duration"><option>4h</option><option>6h</option><option>8h</option><option>Custom</option></select>
        </label>
        <div class="chips"><span class="pill" *ngFor="let s of stops">{{ s }}</span></div>
        <p><b>Estimated Range:</b> {{ estimateRange }}</p>
        <a class="btn" routerLink="/book">Build Your Tour</a>
      </div>
      <div class="card p">
        <h3>Gallery</h3>
        <div class="gallery"><div class="ph" *ngFor="let i of [1,2,3,4,5,6]"></div></div>
      </div>
      <h3>FAQs</h3>
      <faq-accordion [items]="content.toursFaqs"></faq-accordion>
    </div>
  `,
  styles: [`.block{ margin-top:20px; display:grid; gap:10px; } .p{ padding:14px; } .chips{ display:flex; gap:6px; flex-wrap:wrap; margin:8px 0; } .gallery{ display:grid; gap:8px; grid-template-columns:repeat(3,minmax(0,1fr)); } .ph{ height:130px; border-radius:10px; background:linear-gradient(145deg,#bae6fd,#dbeafe); } @media (max-width:900px){ .gallery{ grid-template-columns:repeat(2,1fr);} } @media (max-width:640px){ .gallery{ grid-template-columns:1fr;} }`]
})
export class ServicePrivateToursPageComponent {
  content = inject(PublicContentService);
  duration = '6h';
  stops = ['Blue Hole', 'Dunn’s River', 'Negril', 'Ocho Rios', 'Custom Stops'];
  get estimateRange() { return this.duration === '4h' ? '$220 - $360' : this.duration === '6h' ? '$320 - $520' : this.duration === '8h' ? '$420 - $720' : '$Custom'; }
}
