import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="heroSmall"><div class="container"><h1>Contact</h1><p>Phone, WhatsApp, email, or send a quick quote request.</p></div></section>
    <div class="container grid">
      <div class="card p">
        <h3>Contact</h3>
        <p><i class="bi bi-telephone"></i> <b>Phone:</b> <a href="tel:+18765550132">(876) 555-0132</a></p>
        <p><i class="bi bi-whatsapp"></i> <b>WhatsApp:</b> <a href="https://wa.me/18765550132">Chat now</a></p>
        <p><i class="bi bi-envelope"></i> <b>Email:</b> <a href="mailto:reservations@sunisland.tours">reservations@sunisland.tours</a></p>
        <p><i class="bi bi-clock"></i> <b>Hours:</b> Daily 6:00 AM - 11:00 PM</p>
        <p><i class="bi bi-geo-alt"></i> <b>Service area:</b> Montego Bay, Negril, Ocho Rios, MBJ Airport</p>
      </div>
      <form class="card p" [formGroup]="form" (ngSubmit)="goQuote()">
        <h3>Quick Quote</h3>
        <label class="fldLbl"><i class="bi bi-geo-alt"></i> Pickup</label>
        <input class="in" formControlName="pickup" placeholder="Pickup" />
        <label class="fldLbl"><i class="bi bi-sign-turn-right"></i> Drop-off</label>
        <input class="in" formControlName="dropoff" placeholder="Drop-off" />
        <label class="fldLbl"><i class="bi bi-calendar-date"></i> Pickup date and time</label>
        <input class="in" type="datetime-local" formControlName="pickupDateTime" />
        <button class="btn" type="submit">Get Quote</button>
      </form>
    </div>
  `,
  styles: [`.heroSmall{ padding:52px 0 22px; background:linear-gradient(140deg,var(--color-ocean-900),var(--color-ocean-700)); color:#fff; } .grid{ margin-top:14px; display:grid; gap:10px; grid-template-columns:1fr 1fr; } .p{ padding:14px; display:grid; gap:8px; } .p p{ display:flex; align-items:center; gap:8px; margin:0; } .fldLbl{ font-weight:800; font-size:13px; display:flex; align-items:center; gap:8px; color:var(--fg); } @media (max-width:900px){ .grid{ grid-template-columns:1fr; } }`]
})
export class ContactPageComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  form = this.fb.group({
    pickup: ['', Validators.required],
    dropoff: ['', Validators.required],
    pickupDateTime: ['', Validators.required],
  });
  goQuote() {
    if (this.form.invalid) return;
    this.router.navigate(['/book'], { queryParams: this.form.value });
  }
}