export interface VehicleClass {
  id: string;
  code?: string;
  name: string;
  seats: number;
  luggage: number;
  amenities: string[];
  recommendedFor: string[];
  fromPrice?: number;
  imageUrl?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  location: string;
  rating: number;
}

export interface FaqItem {
  q: string;
  a: string;
}

export type VehicleClassApi = 'EXECUTIVE_SEDAN' | 'LUXURY_SUV' | 'VAN' | 'STRETCH_LIMO';
export type PaymentMode = 'PAY_NOW' | 'PAY_ON_ARRIVAL';
export type BookingStatus = 'REQUESTED' | 'CONFIRMED' | 'ASSIGNED' | 'EN_ROUTE' | 'ARRIVED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

export interface EstimateBreakdown {
  distanceKm: number;
  durationMinutes: number;
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  addonsTotal: number;
  surgeMultiplier: number;
  feesTotal: number;
  total: number;
  currency: string;
}

export interface PublicBooking {
  id: string;
  confirmationCode: string;
  manageToken?: string;
  manageUrl?: string;
  status: BookingStatus;
  pickupAddress: string;
  dropoffAddress: string;
  pickupDateTime: string;
  roundTrip: boolean;
  returnDateTime?: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  vehicleClass: VehicleClassApi;
  estimate?: EstimateBreakdown;
  finalTotal?: number;
  paymentMode: PaymentMode;
}

export interface ApiEnvelope<T> {
  timestamp: string;
  correlationId: string;
  data: T;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  correlationId: string;
  fieldErrors?: Record<string, string>;
}
