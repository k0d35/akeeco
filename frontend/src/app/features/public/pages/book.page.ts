import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { debounceTime, Subscription } from 'rxjs';
import { PublicBookingService } from '../data/public-booking.service';
import { PublicPricingService } from '../data/public-pricing.service';
import { EstimateBreakdown, PublicBooking, VehicleClassApi } from '../data/public.models';

type StepKey = 'TRIP' | 'AIRPORT' | 'RIDER' | 'VEHICLE' | 'SUMMARY' | 'PAYMENT' | 'CONFIRM';
type UiVehicleClass = 'SEDAN' | 'SUV' | 'VAN' | 'LIMO';
type UiAddonCode = 'EXTRA_STOP' | 'CHILD_SEAT' | 'MEET_GREET' | 'LUGGAGE_ASSIST' | 'WAITING_BUFFER';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="heroSmall"><div class="container"><h1>Guest Booking Portal</h1><p>Secure your premium ride in minutes.</p></div></section>
    <div class="container layout">
      <section class="card p">
        <div class="stepper">
          <span *ngFor="let s of visibleSteps; let i = index" [class.on]="i<=step">{{ i + 1 }}. {{ s }}</span>
        </div>

        <form [formGroup]="form">
          <ng-container [ngSwitch]="current">
            <div *ngSwitchCase="'TRIP'" class="grid">
              <label class="fldLbl"><i class="bi bi-geo-alt"></i> Pickup address</label>
              <input class="in" formControlName="pickupAddress" placeholder="Pickup address" />
              <label class="fldLbl"><i class="bi bi-sign-turn-right"></i> Drop-off address</label>
              <input class="in" formControlName="dropoffAddress" placeholder="Drop-off address" />
              <label class="fldLbl"><i class="bi bi-calendar-date"></i> Pickup date</label>
              <input class="in" type="date" formControlName="pickupDate" />
              <label class="fldLbl"><i class="bi bi-clock"></i> Pickup time</label>
              <input class="in" type="time" formControlName="pickupTime" />
              <label class="checkLbl"><input type="checkbox" formControlName="roundTrip" /> <i class="bi bi-arrow-left-right"></i> Round-trip</label>
              <ng-container *ngIf="form.value.roundTrip">
                <label class="fldLbl"><i class="bi bi-calendar2-check"></i> Return date</label>
                <input class="in" type="date" formControlName="returnDate" />
                <label class="fldLbl"><i class="bi bi-clock-history"></i> Return time</label>
                <input class="in" type="time" formControlName="returnTime" />
              </ng-container>
              <label class="checkLbl"><input type="checkbox" formControlName="airportTransfer" /> <i class="bi bi-airplane"></i> This is an airport transfer</label>
            </div>

            <div *ngSwitchCase="'AIRPORT'" class="grid">
              <label class="fldLbl"><i class="bi bi-ticket-detailed"></i> Flight number</label>
              <input class="in" formControlName="flightNumber" placeholder="Flight number (optional)" />
              <label class="fldLbl"><i class="bi bi-building"></i> Airline</label>
              <input class="in" formControlName="airline" placeholder="Airline (optional)" />
              <label class="fldLbl"><i class="bi bi-signpost"></i> Terminal</label>
              <input class="in" formControlName="terminal" placeholder="Terminal (optional)" />
              <label class="fldLbl"><i class="bi bi-arrow-down-up"></i> Flight direction</label>
              <select class="in" formControlName="flightDirection"><option value="ARRIVING">Arriving</option><option value="DEPARTING">Departing</option></select>
            </div>

            <div *ngSwitchCase="'RIDER'" class="grid">
              <label class="fldLbl"><i class="bi bi-person"></i> First name</label>
              <input class="in" formControlName="firstName" placeholder="First name*" />
              <label class="fldLbl"><i class="bi bi-person"></i> Last name</label>
              <input class="in" formControlName="lastName" placeholder="Last name*" />
              <label class="fldLbl"><i class="bi bi-telephone"></i> Phone</label>
              <input class="in" formControlName="phone" placeholder="Phone*" />
              <label class="fldLbl"><i class="bi bi-envelope"></i> Email</label>
              <input class="in" formControlName="email" placeholder="Email*" />
              <label class="fldLbl"><i class="bi bi-whatsapp"></i> WhatsApp</label>
              <input class="in" formControlName="whatsapp" placeholder="WhatsApp (optional)" />
              <label class="fldLbl"><i class="bi bi-chat-left-text"></i> Notes</label>
              <textarea class="in" formControlName="notes" placeholder="Notes to driver"></textarea>
            </div>

            <div *ngSwitchCase="'VEHICLE'" class="grid">
              <label class="card opt" *ngFor="let v of ['SEDAN','SUV','VAN','LIMO']">
                <input type="radio" formControlName="vehicleClass" [value]="v" />
                <b>{{ nameFor(v) }}</b>
                <small>{{ metaFor(v) }}</small>
              </label>
            </div>

            <div *ngSwitchCase="'SUMMARY'" class="grid">
              <label><input type="checkbox" [checked]="addOns.has('EXTRA_STOP')" (change)="toggleAddOn('EXTRA_STOP',$event)" /> Extra stop</label>
              <label><input type="checkbox" [checked]="addOns.has('CHILD_SEAT')" (change)="toggleAddOn('CHILD_SEAT',$event)" /> Child seat</label>
              <label><input type="checkbox" [checked]="addOns.has('MEET_GREET')" (change)="toggleAddOn('MEET_GREET',$event)" /> Meet & greet</label>
              <label><input type="checkbox" [checked]="addOns.has('LUGGAGE_ASSIST')" (change)="toggleAddOn('LUGGAGE_ASSIST',$event)" /> Luggage assist</label>
              <label><input type="checkbox" [checked]="addOns.has('WAITING_BUFFER')" (change)="toggleAddOn('WAITING_BUFFER',$event)" /> Waiting buffer</label>
              <small *ngIf="estimateError" class="err">{{ estimateError }}</small>
            </div>

            <div *ngSwitchCase="'PAYMENT'" class="grid">
              <label class="checkLbl"><input type="radio" formControlName="paymentMode" value="PAY_NOW" /> <i class="bi bi-credit-card"></i> Pay now</label>
              <label class="checkLbl"><input type="radio" formControlName="paymentMode" value="PAY_ON_ARRIVAL" /> <i class="bi bi-cash"></i> Pay on arrival</label>
              <div class="card p2" *ngIf="form.value.paymentMode==='PAY_NOW'">
                <input class="in" placeholder="Payment token reference" [value]="paymentToken" (input)="paymentToken = $any($event.target).value" />
                <small>{{ paymentToken || 'Token required for PAY_NOW' }}</small>
              </div>
            </div>

            <div *ngSwitchCase="'CONFIRM'" class="grid">
              <div class="card p2" *ngIf="createdBooking; else preConfirm">
                <h3>Booking Submitted</h3>
                <p>Confirmation: <b>{{ createdBooking.confirmationCode }}</b></p>
                <p>Status: {{ createdBooking.status }}</p>
                <a class="btn" [routerLink]="['/manage-booking']" [queryParams]="{ code: createdBooking.confirmationCode, token: createdBooking.manageToken }">Manage Booking</a>
              </div>
              <ng-template #preConfirm><p>Review and confirm your booking.</p></ng-template>
              <small *ngIf="submitError" class="err">{{ submitError }}</small>
            </div>
          </ng-container>
        </form>

        <div class="nav">
          <button class="btn secondary" type="button" [disabled]="step===0 || submitting" (click)="back()">Back</button>
          <button class="btn" type="button" *ngIf="current!=='CONFIRM'" [disabled]="submitting" (click)="next()">{{ current==='PAYMENT' ? 'Review Confirmation' : 'Next' }}</button>
          <button class="btn" type="button" *ngIf="current==='CONFIRM' && !createdBooking" [disabled]="submitting" (click)="confirm()">{{ submitting ? 'Submitting...' : 'Confirm Booking' }}</button>
        </div>
      </section>

      <aside class="card p summary">
        <h3>Current Summary</h3>
        <div><b>Pickup:</b> {{ form.value.pickupAddress || '-' }}</div>
        <div><b>Drop-off:</b> {{ form.value.dropoffAddress || '-' }}</div>
        <div><b>Date/Time:</b> {{ form.value.pickupDate }} {{ form.value.pickupTime }}</div>
        <div><b>Vehicle:</b> {{ nameFor(form.value.vehicleClass || 'SEDAN') }}</div>
        <div><b>Add-ons:</b> {{ addOnListText }}</div>
        <hr />
        <div><b>Estimate:</b> {{ (estimate?.total ?? 0) | currency:(estimate?.currency || 'USD') }}</div>
      </aside>
    </div>
  `,
  styles: [`
    .heroSmall{ padding:52px 0 22px; background:linear-gradient(140deg,var(--color-ocean-900),var(--color-ocean-700)); color:#fff; }
    .layout{ margin-top:14px; display:grid; gap:12px; grid-template-columns:1.2fr .8fr; align-items:start; }
    .p{ padding:14px; }
    .stepper{ display:flex; gap:8px; flex-wrap:wrap; font-size:12px; margin-bottom:10px; }
    .stepper span{ padding:4px 8px; border-radius:999px; border:1px solid var(--border); color:var(--color-text-600); }
    .stepper span.on{ background:var(--gold-weak); border-color:var(--color-sun-500); color:var(--color-ocean-900); }
    .grid{ display:grid; gap:8px; }
    .fldLbl{ font-weight:800; font-size:13px; display:flex; align-items:center; gap:8px; color:var(--fg); }
    .checkLbl{ display:flex; align-items:center; gap:8px; font-weight:700; color:var(--fg); }
    .opt{ padding:10px; display:grid; gap:3px; cursor:pointer; }
    .p2{ padding:10px; }
    .nav{ margin-top:10px; display:flex; justify-content:space-between; gap:8px; }
    .summary{ position:sticky; top:86px; }
    .err{ color:var(--danger); }
    @media (max-width:980px){ .layout{ grid-template-columns:1fr; } .summary{ position:static; } }
  `]
})
export class BookPageComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private bookingSvc = inject(PublicBookingService);
  private pricing = inject(PublicPricingService);
  private sub = new Subscription();

  form = this.fb.group({
    pickupAddress: ['', Validators.required],
    dropoffAddress: ['', Validators.required],
    pickupDate: ['', Validators.required],
    pickupTime: ['', Validators.required],
    roundTrip: [false],
    returnDate: [''],
    returnTime: [''],
    airportTransfer: [false],
    flightNumber: [''],
    airline: [''],
    terminal: [''],
    flightDirection: ['ARRIVING'],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    whatsapp: [''],
    notes: [''],
    vehicleClass: ['SEDAN' as UiVehicleClass, Validators.required],
    paymentMode: ['PAY_NOW', Validators.required],
  });

  baseSteps: StepKey[] = ['TRIP', 'RIDER', 'VEHICLE', 'SUMMARY', 'PAYMENT', 'CONFIRM'];
  step = 0;
  addOns = new Set<UiAddonCode>();
  paymentToken = '';
  createdBooking: PublicBooking | null = null;
  submitting = false;
  submitError = '';
  estimateError = '';
  estimate: EstimateBreakdown | null = null;

  get visibleSteps(): StepKey[] {
    return this.requiresAirportStep
      ? ['TRIP', 'AIRPORT', 'RIDER', 'VEHICLE', 'SUMMARY', 'PAYMENT', 'CONFIRM']
      : this.baseSteps;
  }

  get current(): StepKey {
    return this.visibleSteps[this.step];
  }

  get requiresAirportStep(): boolean {
    const p = String(this.form.value.pickupAddress || '').toLowerCase();
    const d = String(this.form.value.dropoffAddress || '').toLowerCase();
    return !!this.form.value.airportTransfer || p.includes('airport') || d.includes('airport');
  }

  get addOnListText(): string {
    return this.addOns.size ? Array.from(this.addOns).join(', ') : 'None';
  }

  ngOnInit(): void {
    const q = this.route.snapshot.queryParams;
    if (q['pickup']) this.form.patchValue({ pickupAddress: q['pickup'] });
    if (q['dropoff']) this.form.patchValue({ dropoffAddress: q['dropoff'] });
    if (q['vehicleClass']) this.form.patchValue({ vehicleClass: this.fromApiVehicleClass(q['vehicleClass']) });
    if (q['pickupDateTime']) {
      const dt = new Date(q['pickupDateTime']);
      if (!Number.isNaN(dt.getTime())) {
        this.form.patchValue({
          pickupDate: dt.toISOString().slice(0, 10),
          pickupTime: dt.toISOString().slice(11, 16),
        });
      }
    }

    const draft = this.bookingSvc.loadDraft<any>();
    if (draft) {
      this.form.patchValue(draft.form ?? draft);
      if (Array.isArray(draft.addOns)) {
        this.addOns = new Set<UiAddonCode>(draft.addOns);
      }
    }

    this.sub.add(
      this.form.valueChanges.pipe(debounceTime(300)).subscribe((v) => {
        this.bookingSvc.saveDraft({ form: v, addOns: Array.from(this.addOns) });
        this.refreshEstimate();
      })
    );
    this.refreshEstimate();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  toggleAddOn(key: UiAddonCode, ev: Event) {
    const on = (ev.target as HTMLInputElement).checked;
    if (on) this.addOns.add(key);
    else this.addOns.delete(key);
    this.bookingSvc.saveDraft({ form: this.form.getRawValue(), addOns: Array.from(this.addOns) });
    this.refreshEstimate();
  }

  next() {
    if (this.step >= this.visibleSteps.length - 1) return;
    this.step += 1;
  }

  back() {
    if (this.step > 0) this.step -= 1;
  }

  confirm() {
    this.submitError = '';
    const v = this.form.getRawValue();
    if (!v.pickupDate || !v.pickupTime) {
      this.submitError = 'Pickup date and time are required.';
      return;
    }
    if (v.paymentMode === 'PAY_NOW' && !this.paymentToken.trim()) {
      this.submitError = 'Payment token is required for PAY_NOW.';
      return;
    }
    const pickupDateTime = `${v.pickupDate}T${v.pickupTime}:00`;
    const returnDateTime = v.roundTrip && v.returnDate && v.returnTime ? `${v.returnDate}T${v.returnTime}:00` : undefined;

    this.submitting = true;
    this.bookingSvc.create({
      pickupAddress: v.pickupAddress!,
      dropoffAddress: v.dropoffAddress!,
      pickupDateTime: new Date(pickupDateTime).toISOString(),
      roundTrip: !!v.roundTrip,
      returnDateTime: returnDateTime ? new Date(returnDateTime).toISOString() : undefined,
      airportTransfer: this.requiresAirportStep,
      flightNumber: v.flightNumber || undefined,
      airline: v.airline || undefined,
      terminal: v.terminal || undefined,
      airportDirection: (v.flightDirection as 'ARRIVING' | 'DEPARTING') || 'ARRIVING',
      firstName: v.firstName!,
      lastName: v.lastName!,
      phone: v.phone!,
      email: v.email!,
      whatsApp: v.whatsapp || undefined,
      notesToDriver: v.notes || undefined,
      vehicleClass: this.toApiVehicleClass(v.vehicleClass as UiVehicleClass),
      selectedAddons: Array.from(this.addOns).map((addonCode) => ({ addonCode, quantity: 1 })),
      paymentMode: (v.paymentMode as 'PAY_NOW' | 'PAY_ON_ARRIVAL') || 'PAY_NOW',
      paymentTokenRef: this.paymentToken || undefined,
    }).subscribe({
      next: (booking) => {
        this.createdBooking = booking;
        this.submitting = false;
        this.bookingSvc.clearDraft();
        this.step = this.visibleSteps.length - 1;
      },
      error: (err) => {
        this.submitting = false;
        this.submitError = err?.error?.message || 'Unable to create booking right now.';
      }
    });
  }

  private refreshEstimate() {
    const v = this.form.getRawValue();
    if (!v.pickupAddress || !v.dropoffAddress || !v.pickupDate || !v.pickupTime) {
      return;
    }
    const pickupDateTime = new Date(`${v.pickupDate}T${v.pickupTime}:00`).toISOString();
    this.pricing.estimate({
      pickupAddress: v.pickupAddress,
      dropoffAddress: v.dropoffAddress,
      pickupDateTime,
      vehicleClass: this.toApiVehicleClass((v.vehicleClass || 'SEDAN') as UiVehicleClass),
      airportTransfer: this.requiresAirportStep,
      selectedAddons: Array.from(this.addOns).map((addonCode) => ({ addonCode, quantity: 1 })),
    }).subscribe({
      next: (estimate) => {
        this.estimate = estimate;
        this.estimateError = '';
      },
      error: () => {
        this.estimateError = 'Estimate unavailable at the moment.';
      }
    });
  }

  private toApiVehicleClass(v: UiVehicleClass): VehicleClassApi {
    const map: Record<UiVehicleClass, VehicleClassApi> = {
      SEDAN: 'EXECUTIVE_SEDAN',
      SUV: 'LUXURY_SUV',
      VAN: 'VAN',
      LIMO: 'STRETCH_LIMO',
    };
    return map[v] ?? 'EXECUTIVE_SEDAN';
  }

  private fromApiVehicleClass(v: string): UiVehicleClass {
    const map: Record<string, UiVehicleClass> = {
      EXECUTIVE_SEDAN: 'SEDAN',
      LUXURY_SUV: 'SUV',
      VAN: 'VAN',
      STRETCH_LIMO: 'LIMO',
      SEDAN: 'SEDAN',
      SUV: 'SUV',
      LIMO: 'LIMO',
    };
    return map[v] ?? 'SEDAN';
  }

  nameFor(v: string): string {
    const m: Record<string, string> = { SEDAN: 'Executive Sedan', SUV: 'Luxury SUV', VAN: 'Van', LIMO: 'Stretch Limo' };
    return m[v] || v;
  }

  metaFor(v: string): string {
    const m: Record<string, string> = { SEDAN: 'Up to 3 passengers', SUV: 'Up to 6 passengers', VAN: 'Up to 10 passengers', LIMO: 'Premium event class' };
    return m[v] || '';
  }
}

