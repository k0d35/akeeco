import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiEnvelope, EstimateBreakdown, VehicleClassApi } from './public.models';

export interface EstimateInput {
  pickupAddress: string;
  dropoffAddress: string;
  pickupDateTime: string;
  vehicleClass: VehicleClassApi;
  airportTransfer?: boolean;
  selectedAddons?: Array<{ addonCode: string; quantity: number }>;
}

@Injectable({ providedIn: 'root' })
export class PublicPricingService {
  private readonly baseUrl = `${environment.apiBaseUrl}/api/public`;

  constructor(private readonly http: HttpClient) {}

  estimate(input: EstimateInput): Observable<EstimateBreakdown> {
    return this.http.post<ApiEnvelope<EstimateBreakdown>>(`${this.baseUrl}/estimate`, input).pipe(
      map((res) => res.data)
    );
  }
}

