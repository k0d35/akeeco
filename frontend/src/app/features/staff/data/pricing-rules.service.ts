import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PricingRules } from './models';
import { loadLocal, saveLocal } from './storage.util';

const KEY = 'staff_pricing_rules_v1';

const DEFAULT_RULES: PricingRules = {
  baseFare: 40,
  perKm: 6,
  perMinute: 0.7,
  vehicleMultipliers: { SEDAN: 1, SUV: 1.35, VAN: 1.5 },
  surgeRules: [{ startHour: 18, endHour: 22, multiplier: 1.2 }],
  airportFee: 8,
  eventFee: 15,
};

@Injectable({ providedIn: 'root' })
export class PricingRulesService {
  private subject = new BehaviorSubject<PricingRules>(loadLocal(KEY, DEFAULT_RULES));
  rules$ = this.subject.asObservable();

  getRules(): PricingRules { return this.subject.value; }

  updateRules(patch: Partial<PricingRules>): void {
    const next = { ...this.subject.value, ...patch };
    this.subject.next(next);
    saveLocal(KEY, next);
    // TODO: Replace with PATCH /api/pricing-rules
  }

  computeEstimate(distanceKm: number, minutes: number, vehicleType: string): number {
    const r = this.subject.value;
    const base = r.baseFare + distanceKm * r.perKm + minutes * r.perMinute;
    const multiplier = r.vehicleMultipliers[vehicleType] ?? 1;
    return Math.round(base * multiplier * 100) / 100;
    // TODO: Replace with POST /api/pricing/estimate
  }
}

