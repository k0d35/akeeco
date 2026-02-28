import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="heroSmall"><div class="container"><h1>About Sun Island Tours</h1><p>Tropical luxury transport built on punctuality, professionalism, and hospitality.</p></div></section>
    <div class="container block">
      <div class="card p">
        <h3>Our Story</h3>
        <p>Founded in Montego Bay to deliver premium chauffeur experiences with transparent pricing and reliable operations.</p>
      </div>
      <div class="card p">
        <h3>Service Guarantees</h3>
        <ul><li>Professional licensed drivers</li><li>Clean, prepared vehicles</li><li>On-time pickup commitment</li><li>Friendly local expertise</li></ul>
      </div>
      <div class="card p">
        <h3>Timeline</h3>
        <div class="line"><b>2018</b> Company founded in Montego Bay</div>
        <div class="line"><b>2021</b> Expanded private tours and events</div>
        <div class="line"><b>2024</b> Added VIP corporate account services</div>
        <div class="line"><b>Today</b> Island-wide premium mobility partner</div>
      </div>
    </div>
  `,
  styles: [`.heroSmall{ padding:52px 0 22px; background-image:linear-gradient(140deg, rgba(17,17,17,.7), rgba(31,31,31,.52)), var(--bg-hero-about); background-size:cover; background-position:center; color:#fff; } .block{ margin-top:14px; display:grid; gap:10px; } .p{ padding:14px; } .line{ padding:6px 0; border-top:1px solid var(--border);} .line:first-child{ border-top:none; }`]
})
export class AboutPageComponent {}

