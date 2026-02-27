import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PublicBookingService } from '../data/public-booking.service';
import { PublicPricingService } from '../data/public-pricing.service';

type StepKey = 'TRIP' | 'AIRPORT' | 'RIDER' | 'VEHICLE' | 'SUMMARY' | 'PAYMENT' | 'CONFIRM';

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
              <input class="in" formControlName="pickupAddress" placeholder="Pickup address" (input)="suggest('pickupAddress')" />
              <div class="ac" *ngIf="pickupSuggestions.length"><button type="button" *ngFor="let s of pickupSuggestions" (click)="pickSuggestion('pickupAddress', s)">{{ s }}</button></div>
              <label class="fldLbl"><i class="bi bi-sign-turn-right"></i> Drop-off address</label>
              <input class="in" formControlName="dropoffAddress" placeholder="Drop-off address" (input)="suggest('dropoffAddress')" />
              <div class="ac" *ngIf="dropoffSuggestions.length"><button type="button" *ngFor="let s of dropoffSuggestions" (click)="pickSuggestion('dropoffAddress', s)">{{ s }}</button></div>
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
              <label><input type="checkbox" [checked]="addOns.has('WAIT_BUFFER')" (change)="toggleAddOn('WAIT_BUFFER',$event)" /> Waiting buffer</label>
            </div>

            <div *ngSwitchCase="'PAYMENT'" class="grid">
              <label class="checkLbl"><input type="radio" formControlName="paymentMode" value="PAY_NOW" /> <i class="bi bi-credit-card"></i> Pay now</label>
              <label class="checkLbl"><input type="radio" formControlName="paymentMode" value="PAY_ON_ARRIVAL" /> <i class="bi bi-cash"></i> Pay on arrival</label>
              <div class="card p2" *ngIf="form.value.paymentMode==='PAY_NOW'">
                <input class="in" placeholder="Card field (hosted field mock)" />
                <button class="btn secondary" type="button" (click)="generateToken()">Generate Token</button>
                <small>{{ paymentToken || 'No token yet' }}</small>
              </div>
            </div>

            <div *ngSwitchCase="'CONFIRM'" class="grid">
              <div class="card p2" *ngIf="confirmationCode; else preConfirm">
                <h3>Booking Confirmed</h3>
                <p>Confirmation: <b>{{ confirmationCode }}</b></p>
                <p>You will receive SMS/email driver updates.</p>
                <a class="btn" [routerLink]="['/manage-booking']" [queryParams]="{ code: confirmationCode }">Manage Booking</a>
              </div>
              <ng-template #preConfirm><p>Review and confirm your booking.</p></ng-template>
            </div>
          </ng-container>
        </form>

        <div class="nav">
          <button class="btn secondary" type="button" [disabled]="step===0" (click)="back()">Back</button>
          <button class="btn" type="button" *ngIf="current!=='CONFIRM'" (click)="next()">{{ current==='PAYMENT' ? 'Review Confirmation' : 'Next' }}</button>
          <button class="btn" type="button" *ngIf="current==='CONFIRM' && !confirmationCode" (click)="confirm()">Confirm Booking</button>
        </div>
      </section>

      <aside class="card p summary">
        <h3>Current Summary</h3>
        <div><b>Pickup:</b> {{ form.value.pickupAddress || '—' }}</div>
        <div><b>Drop-off:</b> {{ form.value.dropoffAddress || '—' }}</div>
        <div><b>Date/Time:</b> {{ form.value.pickupDate }} {{ form.value.pickupTime }}</div>
        <div><b>Vehicle:</b> {{ nameFor(form.value.vehicleClass || 'SEDAN') }}</div>
        <div><b>Add-ons:</b> {{ addOnListText }}</div>
        <hr />
        <div><b>Estimate:</b> {{ estimate.total | currency:'USD' }}</div>
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
    .ac{ display:grid; gap:4px; margin-top:-4px; }
    .ac button{ text-align:left; border:1px solid var(--border); border-radius:8px; background:#fff; padding:8px; cursor:pointer; }
    .opt{ padding:10px; display:grid; gap:3px; cursor:pointer; }
    .p2{ padding:10px; }
    .nav{ margin-top:10px; display:flex; justify-content:space-between; gap:8px; }
    .summary{ position:sticky; top:86px; }
    @media (max-width:980px){ .layout{ grid-template-columns:1fr; } .summary{ position:static; } }
  `]
})
export class BookPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private bookingSvc = inject(PublicBookingService);
  private pricing = inject(PublicPricingService);

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
    vehicleClass: ['SEDAN', Validators.required],
    paymentMode: ['PAY_NOW', Validators.required],
  });

  baseSteps: StepKey[] = ['TRIP', 'RIDER', 'VEHICLE', 'SUMMARY', 'PAYMENT', 'CONFIRM'];
  step = 0;
  addOns = new Set<string>();
  paymentToken = '';
  confirmationCode = '';
  pickupSuggestions: string[] = [];
  dropoffSuggestions: string[] = [];

  get visibleSteps(): StepKey[] {
    const airport = this.requiresAirportStep;
    return airport ? ['TRIP', 'AIRPORT', 'RIDER', 'VEHICLE', 'SUMMARY', 'PAYMENT', 'CONFIRM'] : this.baseSteps;
  }
  get current(): StepKey { return this.visibleSteps[this.step]; }
  get requiresAirportStep(): boolean {
    const p = String(this.form.value.pickupAddress || '').toLowerCase();
    const d = String(this.form.value.dropoffAddress || '').toLowerCase();
    return !!this.form.value.airportTransfer || p.includes('airport') || d.includes('airport');
  }

  get estimate() {
    return this.pricing.computeEstimate({
      vehicleClass: this.form.value.vehicleClass || 'SEDAN',
      distanceKm: 16,
      durationMin: 34,
      airportTransfer: this.requiresAirportStep,
      addOns: Array.from(this.addOns),
    });
  }

  get addOnListText(): string { return this.addOns.size ? Array.from(this.addOns).join(', ') : 'None'; }

  ngOnInit(): void {
    const q = this.route.snapshot.queryParams;
    if (q['pickup']) this.form.patchValue({ pickupAddress: q['pickup'] });
    if (q['dropoff']) this.form.patchValue({ dropoffAddress: q['dropoff'] });
    if (q['vehicle']) this.form.patchValue({ vehicleClass: q['vehicle'] });
    if (q['pickupDateTime']) {
      const [date, time] = String(q['pickupDateTime']).split('T');
      if (date) this.form.patchValue({ pickupDate: date });
      if (time) this.form.patchValue({ pickupTime: time.slice(0, 5) });
    }
    const draft = this.bookingSvc.loadDraft<any>();
    if (draft) this.form.patchValue(draft);
    this.form.valueChanges.subscribe((v) => this.bookingSvc.saveDraft(v));
  }

  suggest(control: 'pickupAddress' | 'dropoffAddress') {
    const v = String(this.form.get(control)?.value || '').trim();
    const data = [
      `${v} Montego Bay`, `${v} Airport Road`, `${v} Rose Hall`, `${v} Negril`,
    ].filter(x => v && x.length > v.length).slice(0, 4);
    if (control === 'pickupAddress') this.pickupSuggestions = data;
    else this.dropoffSuggestions = data;
  }
  pickSuggestion(control: 'pickupAddress' | 'dropoffAddress', s: string) {
    this.form.get(control)?.setValue(s);
    if (control === 'pickupAddress') this.pickupSuggestions = [];
    else this.dropoffSuggestions = [];
  }

  toggleAddOn(key: string, ev: Event) {
    const on = (ev.target as HTMLInputElement).checked;
    if (on) this.addOns.add(key); else this.addOns.delete(key);
  }

  generateToken() {
    this.paymentToken = `tok_mock_${Math.random().toString(36).slice(2, 12)}`;
  }

  next() {
    if (this.step >= this.visibleSteps.length - 1) return;
    this.step += 1;
  }
  back() { if (this.step > 0) this.step -= 1; }

  confirm() {
    const v = this.form.getRawValue();
    const booking = this.bookingSvc.create({
      pickupAddress: v.pickupAddress!,
      dropoffAddress: v.dropoffAddress!,
      pickupDate: v.pickupDate!,
      pickupTime: v.pickupTime!,
      roundTrip: !!v.roundTrip,
      returnDate: v.returnDate || undefined,
      returnTime: v.returnTime || undefined,
      airportTransfer: this.requiresAirportStep,
      flightNumber: v.flightNumber || undefined,
      airline: v.airline || undefined,
      terminal: v.terminal || undefined,
      flightDirection: (v.flightDirection as any) || 'ARRIVING',
      firstName: v.firstName!,
      lastName: v.lastName!,
      phone: v.phone!,
      email: v.email!,
      whatsapp: v.whatsapp || undefined,
      notes: v.notes || undefined,
      vehicleClass: v.vehicleClass!,
      addOns: Array.from(this.addOns),
      estimate: this.estimate.total,
      paymentMode: (v.paymentMode as any) || 'PAY_NOW',
      paymentToken: this.paymentToken || undefined,
    });
    this.confirmationCode = booking.confirmationCode;
    this.step = this.visibleSteps.length - 1;
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
