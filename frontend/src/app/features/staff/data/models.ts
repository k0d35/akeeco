export type BookingStatus =
  | 'REQUESTED'
  | 'CONFIRMED'
  | 'ASSIGNED'
  | 'EN_ROUTE'
  | 'ARRIVED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export type ServiceType = 'AIRPORT' | 'TOUR' | 'CORPORATE' | 'EVENT';

export interface StatusHistoryEntry {
  timestamp: string;
  user: string;
  from: BookingStatus | null;
  to: BookingStatus;
  note?: string;
}

export interface Booking {
  id: string;
  createdAt: string;
  updatedAt: string;
  customerName: string;
  email: string;
  phone: string;
  serviceType: ServiceType;
  pickupLocation: string;
  dropoffLocation: string;
  pickupTime: string;
  flightNumber?: string;
  passengers: number;
  luggage?: number;
  vehicleTypeRequested: string;
  assignedVehicleId?: string;
  assignedDriverId?: string;
  estimateId?: string;
  estimatedPrice?: number;
  finalPrice?: number;
  notes?: string;
  status: BookingStatus;
  statusHistory: StatusHistoryEntry[];
  tags: string[];
}

export type MaintenanceStatus = 'OK' | 'NEEDS_SERVICE' | 'IN_SERVICE';

export interface FleetVehicle {
  id: string;
  name: string;
  type: string;
  seats: number;
  luggage: number;
  features: string[];
  active: boolean;
  maintenanceStatus: MaintenanceStatus;
  lastServiceDate: string;
  imageUrl: string;
}

export type DriverStatus = 'ACTIVE' | 'OFF_DUTY' | 'ON_TRIP';

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: 'DRIVER';
  status: DriverStatus;
  availability: boolean;
  assignedVehicleId?: string;
  licenseExpiry: string;
  notes?: string;
}

export interface PricingRules {
  baseFare: number;
  perKm: number;
  perMinute: number;
  vehicleMultipliers: Record<string, number>;
  surgeRules: Array<{ startHour: number; endHour: number; multiplier: number }>;
  airportFee?: number;
  eventFee?: number;
}

export interface DispatchMessageLog {
  id: string;
  bookingId: string;
  channel: 'SMS' | 'EMAIL';
  templateUsed: string;
  sentAt: string;
  sentBy: string;
  content: string;
}

