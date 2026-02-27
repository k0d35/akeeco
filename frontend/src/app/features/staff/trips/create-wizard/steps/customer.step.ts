import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, AbstractControl } from '@angular/forms';
import { TripWizardStateService } from '../trip-wizard-state.service';
import { DraftPresenceService } from '../draft-presence.service';
import { PresenceFocusTagDirective } from '../presence-focus-tag.directive';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PresenceFocusTagDirective],
  template: `
    <h2>Customer</h2>
    <div [formGroup]="fg" class="grid">
      <div>
        <label class="lbl">First name <span class="req">*</span></label>
        <input class="in" formControlName="firstName" autocomplete="given-name" autocapitalize="words"
               presenceFocusTag="customer.firstName"
               (input)="onNameInput('firstName', $event)"
               (focus)="presence.focus('customer.firstName')" />
        <small class="err" *ngIf="showError('firstName')">{{ getError('firstName', 'First name') }}</small>
      </div>
      <div>
        <label class="lbl">Last name <span class="req">*</span></label>
        <input class="in" formControlName="lastName" autocomplete="family-name" autocapitalize="words"
               presenceFocusTag="customer.lastName"
               (input)="onNameInput('lastName', $event)"
               (focus)="presence.focus('customer.lastName')" />
        <small class="err" *ngIf="showError('lastName')">{{ getError('lastName', 'Last name') }}</small>
      </div>
      <div>
        <label class="lbl">Phone (10 digits) <span class="req">*</span></label>
        <input class="in" type="tel" inputmode="numeric" maxlength="14" autocomplete="tel"
               formControlName="phone" presenceFocusTag="customer.phone"
               (input)="onPhoneInput($event)"
               (focus)="presence.focus('customer.phone')" />
        <small class="err" *ngIf="showError('phone')">{{ getError('phone', 'Phone') }}</small>
      </div>
      <div>
        <label class="lbl">Email</label>
        <input class="in" type="email" autocomplete="email" formControlName="email" presenceFocusTag="customer.email"
               (focus)="presence.focus('customer.email')" />
        <small class="err" *ngIf="showError('email')">{{ getError('email', 'Email') }}</small>
      </div>
      <div class="span2">
        <label class="lbl">Company (optional)</label>
        <input class="in" formControlName="companyName" autocomplete="organization" presenceFocusTag="customer.companyName"
               (focus)="presence.focus('customer.companyName')" />
        <small class="err" *ngIf="showError('companyName')">{{ getError('companyName', 'Company') }}</small>
      </div>
      <div class="span2">
        <label class="lbl">Notes</label>
        <textarea class="in" formControlName="notes" rows="3"></textarea>
        <small class="err" *ngIf="showError('notes')">{{ getError('notes', 'Notes') }}</small>
      </div>
    </div>
  `,
  styles: [`
    .grid{ display:grid; gap:12px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .span2{ grid-column: span 2; }
    .lbl{ display:block; font-weight:900; margin: 8px 0 6px; }
    .req{ color:#b42318; }
    .in{ width:100%; padding:12px; border-radius:12px; border:1px solid var(--border); outline:none; }
    .in:focus{ border-color: var(--gold); box-shadow: 0 0 0 4px rgba(200,162,74,.15); }
    .in.ng-valid.ng-dirty, .in.ng-valid.ng-touched{ border-color: var(--ok); color: var(--ok); }
    .in.ng-valid.ng-dirty:focus, .in.ng-valid.ng-touched:focus{ border-color: var(--ok); box-shadow: 0 0 0 4px rgba(22,163,74,.18); }
    .err{ display:block; margin-top:6px; color:#b42318; font-size:12px; font-weight:600; }
    @media (max-width: 640px){
      .grid{ grid-template-columns: 1fr; }
      .span2{ grid-column: span 1; }
      .in{ padding:10px; }
      .lbl{ margin: 6px 0 5px; }
    }
  `]
})
export class CustomerStepComponent {
  private state = inject(TripWizardStateService);
  presence = inject(DraftPresenceService);
  fg: FormGroup = this.state.form.get('customer') as FormGroup;

  showError(controlName: string): boolean {
    const c = this.fg.get(controlName);
    return !!c && c.invalid && (c.touched || c.dirty);
  }

  getError(controlName: string, label: string): string {
    const c = this.fg.get(controlName);
    if (!c || !c.errors) return '';
    return this.resolveErrorMessage(c, label);
  }

  private resolveErrorMessage(control: AbstractControl, label: string): string {
    const e = control.errors;
    if (!e) return '';
    if (e['required']) return `${label} is required.`;
    if (e['email']) return `${label} must be a valid email address.`;
    if (e['minlength']) return `${label} must be at least ${e['minlength'].requiredLength} characters.`;
    if (e['maxlength']) return `${label} must be at most ${e['maxlength'].requiredLength} characters.`;
    if (e['pattern']) {
      if (label === 'Phone') return 'Phone must be in format (555) 123-4567.';
      return `${label} contains invalid characters.`;
    }
    return `${label} is invalid.`;
  }

  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = this.onlyDigits(input.value).slice(0, 10);
    const masked = this.formatPhone(digits);
    input.value = masked;
    this.fg.get('phone')?.setValue(masked, { emitEvent: false });
  }

  private onlyDigits(v: string): string {
    return String(v || '').replace(/\D/g, '');
  }

  private formatPhone(digits: string): string {
    if (!digits) return '';
    if (digits.length <= 3) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }

  onNameInput(controlName: 'firstName' | 'lastName', event: Event): void {
    const input = event.target as HTMLInputElement;
    const normalized = this.capitalizeFirstLetter(input.value);
    input.value = normalized;
    this.fg.get(controlName)?.setValue(normalized, { emitEvent: false });
  }

  private capitalizeFirstLetter(v: string): string {
    const value = String(v || '');
    if (!value) return '';
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
