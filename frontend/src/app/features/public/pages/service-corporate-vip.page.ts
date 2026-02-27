import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HeroComponent } from '../ui/hero.component';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeroComponent],
  template: `
    <si-hero title="Corporate & VIP" subtitle="Account billing, recurring transfers, priority dispatch, executive standards."></si-hero>
    <div class="container block">
      <div class="card p">
        <h3>Why executives choose us</h3>
        <ul><li>Priority dispatch and dedicated support</li><li>Monthly billing support</li><li>Confidential and professional service</li></ul>
      </div>
      <form class="card p" [formGroup]="form" (ngSubmit)="submit()">
        <h3>Corporate Intake Form</h3>
        <input class="in" formControlName="company" placeholder="Company Name" />
        <input class="in" formControlName="name" placeholder="Contact Name" />
        <input class="in" formControlName="email" placeholder="Work Email" />
        <textarea class="in" formControlName="needs" placeholder="Volume, service windows, special requirements"></textarea>
        <button class="btn" type="submit">Submit Corporate Request</button>
      </form>
      <div class="logos"><div class="logo" *ngFor="let i of [1,2,3,4,5]">Brand</div></div>
    </div>
  `,
  styles: [`.block{ margin-top:20px; display:grid; gap:10px; } .p{ padding:14px; display:grid; gap:8px; } .logos{ display:grid; gap:8px; grid-template-columns:repeat(5,1fr);} .logo{ height:54px; border:1px solid var(--border); border-radius:10px; display:grid; place-items:center; background:#fff; color:var(--color-text-600); } @media (max-width:1000px){ .logos{ grid-template-columns:repeat(3,1fr);} } @media (max-width:640px){ .logos{ grid-template-columns:repeat(2,1fr);} }`]
})
export class ServiceCorporateVipPageComponent {
  form = new FormBuilder().group({
    company: ['', Validators.required],
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    needs: ['', Validators.required],
  });
  submit() { if (this.form.valid) alert('Corporate request submitted (mock).'); }
}
