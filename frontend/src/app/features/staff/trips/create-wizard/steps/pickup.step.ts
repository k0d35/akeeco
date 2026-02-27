import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Subscription, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { TripWizardStateService } from '../trip-wizard-state.service';
import { DraftPresenceService } from '../draft-presence.service';
import { PresenceFocusTagDirective } from '../presence-focus-tag.directive';
import { GooglePlacesAutocompleteService, PlaceSuggestion } from '../google-places-autocomplete.service';
import { environment } from '../../../../../../environments/environment';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PresenceFocusTagDirective],
  template: `
    <h2>Pickup</h2>
    <div [formGroup]="fg">
      <label class="lbl">Pickup Address <span class="req">*</span></label>
      <div class="acWrap">
        <input class="in" formControlName="formatted" presenceFocusTag="pickup.formatted"
               (focus)="onAddressInputFocus()" (blur)="onAddressBlur()"
               placeholder="Start typing pickup address..." />
        <div class="acList" *ngIf="placesEnabled && showSuggestions">
          <button class="acItem" type="button" *ngFor="let s of suggestions" (mousedown)="chooseSuggestion(s)">
            <span class="acPrimary">{{ s.text }}</span>
            <span class="acSecondary" *ngIf="s.secondaryText">{{ s.secondaryText }}</span>
          </button>
        </div>
      </div>

      <div class="grid">
        <div>
          <label class="lbl">City</label>
          <input class="in" formControlName="city" presenceFocusTag="pickup.city"
                 (focus)="presence.focus('pickup.city')" />
        </div>
        <div>
          <label class="lbl">Postal Code</label>
          <input class="in" formControlName="postal" presenceFocusTag="pickup.postal"
                 (focus)="presence.focus('pickup.postal')" />
        </div>
        <div>
          <label class="lbl">Major Intersection</label>
          <input class="in" formControlName="intersection" presenceFocusTag="pickup.intersection"
                 (focus)="presence.focus('pickup.intersection')" />
        </div>
      </div>

      <label class="lbl">Dwelling Type</label>
      <select class="in" formControlName="dwellingType" presenceFocusTag="pickup.dwellingType"
              (focus)="presence.focus('pickup.dwellingType')">
        <option value="">Select…</option>
        <option value="house">House</option>
        <option value="building">Building</option>
        <option value="unit">Unit</option>
        <option value="complex">Complex</option>
      </select>
    </div>
  `,
  styles: [`
    .grid{ display:grid; gap:12px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .acWrap{ position:relative; }
    .acList{
      position:absolute; z-index:20; left:0; right:0; top:calc(100% + 6px);
      border:1px solid var(--border); border-radius:12px; background:#fff; overflow:hidden;
      box-shadow: 0 10px 25px rgba(0,0,0,.08);
    }
    .acItem{
      display:block; width:100%; text-align:left; border:0; background:#fff;
      padding:10px 12px; cursor:pointer; font-weight:700;
    }
    .acPrimary{ display:block; }
    .acSecondary{ display:block; margin-top:2px; font-size:12px; font-weight:600; opacity:.8; }
    .acItem + .acItem{ border-top:1px solid var(--border); }
    .acItem:hover{ background: var(--gold-weak); }
    .lbl{ display:block; font-weight:900; margin: 8px 0 6px; }
    .req{ color:#b42318; }
    .in{ width:100%; padding:12px; border-radius:12px; border:1px solid var(--border); outline:none; }
    .in:focus{ border-color: var(--gold); box-shadow: 0 0 0 4px rgba(200,162,74,.15); }
    .in.ng-valid.ng-dirty, .in.ng-valid.ng-touched{ border-color: var(--ok); color: var(--ok); }
    .in.ng-valid.ng-dirty:focus, .in.ng-valid.ng-touched:focus{ border-color: var(--ok); box-shadow: 0 0 0 4px rgba(22,163,74,.18); }
    @media (max-width: 640px){
      .grid{ grid-template-columns: 1fr; }
      .in{ padding:10px; }
      .lbl{ margin: 6px 0 5px; }
    }
  `]
})
export class PickupStepComponent implements OnInit, OnDestroy {
  private state = inject(TripWizardStateService);
  presence = inject(DraftPresenceService);
  private places = inject(GooglePlacesAutocompleteService);
  fg: FormGroup = this.state.form.get('pickup') as FormGroup;
  suggestions: PlaceSuggestion[] = [];
  showSuggestions = false;
  private subs = new Subscription();
  private suppressNextSearch = false;
  placesEnabled = this.places.isEnabled() && !!environment.googlePlaces.pickupEnabled;

  ngOnInit(): void {
    if (!this.placesEnabled) return;
    const formatted = this.fg.get('formatted');
    if (!formatted) return;

    const s = formatted.valueChanges.pipe(
      debounceTime(250),
      distinctUntilChanged(),
      switchMap((value) => {
        if (this.suppressNextSearch) {
          this.suppressNextSearch = false;
          return of([]);
        }
        const query = String(value || '').trim();
        if (query.length < environment.googlePlaces.minQueryLength) return of([]);
        return this.places.search(query);
      })
    ).subscribe((rows) => {
      this.suggestions = rows;
      this.showSuggestions = rows.length > 0;
    });

    this.subs.add(s);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onAddressInputFocus(): void {
    this.presence.focus('pickup.formatted');
    if (!this.placesEnabled) return;
    const query = String(this.fg.get('formatted')?.value || '').trim();
    this.showSuggestions = query.length >= environment.googlePlaces.minQueryLength && this.suggestions.length > 0;
  }

  onAddressBlur(): void {
    setTimeout(() => { this.showSuggestions = false; }, 120);
  }

  chooseSuggestion(item: PlaceSuggestion): void {
    this.suppressNextSearch = true;
    this.fg.get('formatted')?.setValue(item.text);
    this.fg.get('placeId')?.setValue(item.placeId);
    this.showSuggestions = false;
  }
}
