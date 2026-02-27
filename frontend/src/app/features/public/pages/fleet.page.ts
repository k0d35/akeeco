import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PublicContentService } from '../data/public-content.service';
import { VehicleCardComponent } from '../ui/vehicle-card.component';
import { ModalComponent } from '../../../shared/ui/modal.component';
import { VehicleClass } from '../data/public.models';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, VehicleCardComponent, ModalComponent],
  template: `
    <section class="heroSmall"><div class="container"><h1>Our Fleet</h1><p>Premium vehicles for every occasion.</p></div></section>
    <div class="container">
      <div class="card filters">
        <select class="in" [(ngModel)]="classFilter"><option value="">All Classes</option><option *ngFor="let v of content.vehicles" [value]="v.id">{{ v.name }}</option></select>
        <input class="in" type="number" [(ngModel)]="passengers" placeholder="Passengers" />
        <input class="in" type="number" [(ngModel)]="luggage" placeholder="Luggage" />
      </div>
      <div class="grid"><vehicle-card *ngFor="let v of filtered()" [vehicle]="v" (details)="open($event)"></vehicle-card></div>
    </div>
    <app-modal [open]="!!active" [title]="active?.name || ''" (close)="active=null">
      <div class="modalBody" *ngIf="active">
        <div class="img"></div>
        <ul><li>Seats: {{ active.seats }}</li><li>Luggage: {{ active.luggage }}</li><li *ngFor="let a of active.amenities">{{ a }}</li></ul>
        <p><b>Policy:</b> Clean vehicle guarantee, no smoking policy, courteous chauffeurs.</p>
      </div>
    </app-modal>
  `,
  styles: [`
    .heroSmall{ padding:60px 0 24px; background:linear-gradient(140deg,var(--color-ocean-900),var(--color-ocean-700)); color:#fff; }
    .filters{ padding:10px; display:flex; gap:8px; margin-top:12px; flex-wrap:wrap; }
    .grid{ margin-top:12px; display:grid; gap:10px; grid-template-columns:repeat(4,minmax(0,1fr)); }
    .modalBody .img{ height:220px; border-radius:12px; background:linear-gradient(145deg,#bae6fd,#dbeafe); margin-bottom:10px; }
    @media (max-width:1100px){ .grid{ grid-template-columns:repeat(2,1fr); } }
  `]
})
export class FleetPageComponent {
  content = inject(PublicContentService);
  classFilter = '';
  passengers: number | null = null;
  luggage: number | null = null;
  active: VehicleClass | null = null;

  filtered() {
    return this.content.vehicles.filter((v) => {
      if (this.classFilter && v.id !== this.classFilter) return false;
      if (this.passengers && v.seats < this.passengers) return false;
      if (this.luggage && v.luggage < this.luggage) return false;
      return true;
    });
  }
  open(v: VehicleClass) { this.active = v; }
}

