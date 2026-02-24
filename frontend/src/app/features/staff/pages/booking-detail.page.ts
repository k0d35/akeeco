import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BookingsService } from '../data/bookings.service';
import { DriversService } from '../data/drivers.service';
import { FleetService } from '../data/fleet.service';
import { CommsService } from '../data/comms.service';
import { TimelineComponent } from '../../../shared/ui/timeline.component';
import { TagChipsComponent } from '../../../shared/ui/tag-chips.component';
import { ToastService } from '../../../shared/ui/toast.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, TimelineComponent, TagChipsComponent],
  template: `
    <ng-container *ngIf="booking as b; else missing">
      <div class="grid">
        <section class="card p">
          <h3>{{ b.id }} • {{ b.customerName }}</h3>
          <p>{{ b.pickupLocation }} → {{ b.dropoffLocation }}</p>
          <p>Pickup: {{ b.pickupTime | date:'full' }}</p>
          <div class="row">
            <select class="in" [(ngModel)]="driverId"><option value="">Select driver</option><option *ngFor="let d of drivers" [value]="d.id">{{ d.name }}</option></select>
            <select class="in" [(ngModel)]="vehicleId"><option value="">Select vehicle</option><option *ngFor="let v of fleet" [value]="v.id">{{ v.name }}</option></select>
            <button class="btn secondary" (click)="assign()">Assign</button>
          </div>
          <div class="row">
            <button class="btn secondary" (click)="setStatus('CONFIRMED')">Confirm</button>
            <button class="btn secondary" (click)="setStatus('EN_ROUTE')">En Route</button>
            <button class="btn secondary" (click)="setStatus('ARRIVED')">Arrived</button>
            <button class="btn gold" (click)="setStatus('COMPLETED')">Complete</button>
            <button class="btn" (click)="setStatus('CANCELLED')">Cancel</button>
          </div>
          <div class="row">
            <input class="in" [(ngModel)]="tag" placeholder="Add tag" />
            <button class="btn secondary" (click)="addTag()">Add Tag</button>
          </div>
          <tag-chips [tags]="b.tags"></tag-chips>
        </section>
        <aside class="card p">
          <h3>Status Timeline</h3>
          <app-timeline [items]="timelineItems"></app-timeline>
          <h3>Comms</h3>
          <button class="btn secondary" (click)="send('assigned_sms')">Your driver is assigned</button>
          <button class="btn secondary" (click)="send('enroute_sms')">Driver is on the way</button>
          <button class="btn secondary" (click)="send('pickup_confirmed_sms')">Pickup confirmed</button>
          <button class="btn secondary" (click)="send('thanks_email')">Thanks for riding</button>
          <ul><li *ngFor="let l of logs">{{ l.sentAt | date:'short' }} • {{ l.channel }} • {{ l.templateUsed }}</li></ul>
        </aside>
      </div>
    </ng-container>
    <ng-template #missing><div class="card p">Booking not found.</div></ng-template>
  `,
  styles: [`.grid{ display:grid; gap:10px; grid-template-columns:2fr 1fr; } .p{ padding:12px; } .row{ display:flex; gap:8px; margin:8px 0; flex-wrap:wrap; } @media (max-width:980px){ .grid{ grid-template-columns:1fr; }}`]
})
export class StaffBookingDetailPageComponent {
  private route = inject(ActivatedRoute);
  private bookings = inject(BookingsService);
  private driversSvc = inject(DriversService);
  private fleetSvc = inject(FleetService);
  private comms = inject(CommsService);
  private toast = inject(ToastService);

  booking = this.bookings.getById(this.route.snapshot.paramMap.get('id') || '');
  drivers = this.driversSvc.list();
  fleet = this.fleetSvc.list();
  logs = this.booking ? this.comms.listLogs(this.booking.id) : [];
  driverId = this.booking?.assignedDriverId || '';
  vehicleId = this.booking?.assignedVehicleId || '';
  tag = '';

  get timelineItems() {
    return (this.booking?.statusHistory || []).map(h => ({ title: `${h.from || '—'} → ${h.to} (${h.user})`, time: new Date(h.timestamp).toLocaleString(), subtitle: h.note }));
  }

  assign() {
    if (!this.booking) return;
    this.bookings.assignDriverVehicle(this.booking.id, this.driverId || undefined, this.vehicleId || undefined);
    this.refresh();
    this.toast.show('Assignment saved.', 'success');
  }
  setStatus(status: any) {
    if (!this.booking) return;
    this.bookings.setStatus(this.booking.id, status);
    this.refresh();
    this.toast.show(`Status updated to ${status}.`, 'success');
  }
  addTag() {
    if (!this.booking || !this.tag.trim()) return;
    this.bookings.addTag(this.booking.id, this.tag.trim().toUpperCase());
    this.tag = '';
    this.refresh();
  }
  send(template: string) {
    if (!this.booking) return;
    this.comms.sendTemplate(this.booking.id, template);
    this.refresh();
    this.toast.show('Template sent.', 'success');
  }
  private refresh() {
    this.booking = this.bookings.getById(this.route.snapshot.paramMap.get('id') || '');
    this.logs = this.booking ? this.comms.listLogs(this.booking.id) : [];
  }
}

