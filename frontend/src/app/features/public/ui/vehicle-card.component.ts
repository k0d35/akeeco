import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleClass } from '../data/public.models';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'vehicle-card',
  imports: [CommonModule, RouterLink],
  template: `
    <article class="card v">
      <div class="img"></div>
      <h3>{{ vehicle.name }}</h3>
      <p>Seats {{ vehicle.seats }} • Luggage {{ vehicle.luggage }}</p>
      <div class="chips"><span class="pill" *ngFor="let a of vehicle.amenities">{{ a }}</span></div>
      <div class="price">From {{ vehicle.fromPrice | currency:'USD' }}</div>
      <div class="row">
        <a class="btn secondary" [routerLink]="['/book']" [queryParams]="{ vehicle: vehicle.id }">Select in Booking</a>
        <button class="btn" type="button" (click)="details.emit(vehicle)">Details</button>
      </div>
    </article>
  `,
  styles: [`.v{ padding:12px; } .img{ height:170px; border-radius:12px; background:linear-gradient(145deg,#bae6fd,#e2e8f0); } h3{ margin:10px 0 4px; } p{ margin:0; color:var(--color-text-600);} .chips{ display:flex; gap:6px; flex-wrap:wrap; margin-top:8px;} .price{ margin-top:8px; font-weight:900; } .row{ margin-top:10px; display:flex; gap:8px; flex-wrap:wrap; }`]
})
export class VehicleCardComponent {
  @Input({ required: true }) vehicle!: VehicleClass;
  @Output() details = new EventEmitter<VehicleClass>();
}

