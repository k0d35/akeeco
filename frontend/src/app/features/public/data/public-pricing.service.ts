import { Injectable } from '@angular/core';

export interface EstimateInput {
  vehicleClass: string;
  distanceKm: number;
  durationMin: number;
  airportTransfer?: boolean;
  addOns?: string[];
}

export interface EstimateBreakdown {
  base: number;
  distance: number;
  time: number;
  airportFee: number;
  addOns: number;
  total: number;
}

@Injectable({ providedIn: 'root' })
export class PublicPricingService {
  private baseFare = 35;
  private perKm = 4.5;
  private perMin = 0.55;
  private multipliers: Record<string, number> = {
    SEDAN: 1,
    SUV: 1.35,
    VAN: 1.6,
    LIMO: 2.4,
  };

  computeEstimate(input: EstimateInput): EstimateBreakdown {
    const m = this.multipliers[input.vehicleClass] ?? 1;
    const base = this.baseFare * m;
    const distance = input.distanceKm * this.perKm * m;
    const time = input.durationMin * this.perMin * m;
    const airportFee = input.airportTransfer ? 12 : 0;
    const addOns = (input.addOns || []).reduce((sum, key) => sum + this.addOnPrice(key), 0);
    const total = Math.round((base + distance + time + airportFee + addOns) * 100) / 100;
    return { base, distance, time, airportFee, addOns, total };
    // TODO: Replace with POST /api/public/pricing/estimate
  }

  private addOnPrice(key: string): number {
    const map: Record<string, number> = {
      EXTRA_STOP: 18,
      CHILD_SEAT: 10,
      MEET_GREET: 14,
      LUGGAGE_ASSIST: 12,
      WAIT_BUFFER: 20,
    };
    return map[key] ?? 0;
  }
}

