import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

const nameLikePattern = /^[A-Za-z][A-Za-z\s'-]*$/;
const idLikePattern = /^[A-Za-z0-9_-]+$/;
const flightPattern = /^[A-Za-z0-9-]{2,20}$/;
const postalPattern = /^[A-Za-z0-9 -]{3,20}$/;

function oneOf(values: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const v = control.value;
    if (v === null || v === undefined || v === '') return null;
    return values.includes(v) ? null : { oneOf: true };
  };
}

export function buildTripWizardForm(fb: FormBuilder) {
  return fb.group({
    customer: fb.group({
      firstName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[A-Za-z][A-Za-z\s'-]*$/)
      ]],
      lastName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[A-Za-z][A-Za-z\s'-]*$/)
      ]],
      phone: ['', [
        Validators.required,
        Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/)
      ]],
      email: ['', [Validators.email, Validators.maxLength(254)]],
      companyName: ['', [Validators.maxLength(100)]],
      companyId: [''],
      notes: ['', [Validators.maxLength(500)]],
    }),
    pickup: fb.group({
      formatted: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      placeId: ['', [Validators.maxLength(128)]],
      city: ['', [Validators.maxLength(80), Validators.pattern(nameLikePattern)]],
      postal: ['', [Validators.maxLength(20), Validators.pattern(postalPattern)]],
      intersection: ['', [Validators.maxLength(120)]],
      dwellingType: ['', [oneOf(['house', 'building', 'unit', 'complex'])]],
      lat: [null, [Validators.min(-90), Validators.max(90)]],
      lng: [null, [Validators.min(-180), Validators.max(180)]],
    }),
    dropoff: fb.group({
      formatted: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      placeId: ['', [Validators.maxLength(128)]],
      city: ['', [Validators.maxLength(80), Validators.pattern(nameLikePattern)]],
      intersection: ['', [Validators.maxLength(120)]],
      dwellingType: ['', [oneOf(['house', 'building', 'unit', 'complex'])]],
      lat: [null, [Validators.min(-90), Validators.max(90)]],
      lng: [null, [Validators.min(-180), Validators.max(180)]],
    }),
    schedule: fb.group({
      pickupDate: ['', [Validators.required, Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)]],
      pickupTime: ['', [Validators.required, Validators.pattern(/^([01]\d|2[0-3]):[0-5]\d$/)]],
      flightNumber: ['', [Validators.maxLength(20), Validators.pattern(flightPattern)]],
      passengers: [1, [Validators.required, Validators.min(1), Validators.max(20)]],
      luggageCount: [0, [Validators.required, Validators.min(0), Validators.max(30)]],
      specialRequests: ['', [Validators.maxLength(500)]],
    }),
    pricing: fb.group({
      serviceType: ['EXEC', [Validators.required, oneOf(['EXEC', 'SUV', 'VAN'])]],
      baseFare: [0, [Validators.required, Validators.min(0), Validators.max(100000)]],
      distanceKm: [0, [Validators.required, Validators.min(0), Validators.max(1500)]],
      timeMin: [0, [Validators.required, Validators.min(0), Validators.max(1440)]],
      perKmRate: [0, [Validators.required, Validators.min(0), Validators.max(10000)]],
      perMinRate: [0, [Validators.required, Validators.min(0), Validators.max(10000)]],
      surgeMultiplier: [1, [Validators.required, Validators.min(1), Validators.max(5)]],
      discount: [0, [Validators.required, Validators.min(0), Validators.max(100000)]],
      taxes: [0, [Validators.required, Validators.min(0), Validators.max(100000)]],
      total: [0, [Validators.required, Validators.min(0), Validators.max(1000000)]],
      quoteNotes: ['', [Validators.maxLength(500)]],
    }),
    assignment: fb.group({
      assignedDriverId: ['', [Validators.maxLength(64), Validators.pattern(idLikePattern)]],
      assignedVehicleId: ['', [Validators.maxLength(64), Validators.pattern(idLikePattern)]],
      dispatcherOverrideAllowed: [false],
      status: ['INACTIVE', [Validators.required, oneOf(['INACTIVE', 'ACTIVE'])]],
    }),
    billing: fb.group({
      billingName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      billingAddress: fb.group({
        line1: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(120)]],
        line2: ['', [Validators.maxLength(120)]],
        city: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80), Validators.pattern(nameLikePattern)]],
        parish: ['St. James', [Validators.required, Validators.maxLength(80)]],
        postal: ['', [Validators.maxLength(20), Validators.pattern(postalPattern)]],
        country: ['JM', [Validators.required, Validators.pattern(/^[A-Z]{2}$/)]],
      }),
      paymentMethod: ['CARD', [Validators.required, oneOf(['CARD', 'CASH', 'INVOICE'])]],
      token: ['', [Validators.maxLength(255)]],
      brand: ['', [Validators.maxLength(30)]],
      last4: ['', [Validators.pattern(/^\d{4}$/)]],
      expMonth: ['', [Validators.pattern(/^(0?[1-9]|1[0-2])$/)]],
      expYear: ['', [Validators.pattern(/^\d{4}$/)]],
    }),
  });
}
