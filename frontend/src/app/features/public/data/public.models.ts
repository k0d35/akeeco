export interface VehicleClass {
  id: string;
  name: string;
  seats: number;
  luggage: number;
  amenities: string[];
  fromPrice: number;
  recommendedFor: string[];
  imageUrl: string;
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

export interface PublicBooking {
  id: string;
  confirmationCode: string;
  createdAt: string;
  pickupAddress: string;
  dropoffAddress: string;
  pickupDate: string;
  pickupTime: string;
  roundTrip: boolean;
  returnDate?: string;
  returnTime?: string;
  airportTransfer: boolean;
  flightNumber?: string;
  airline?: string;
  terminal?: string;
  flightDirection?: 'ARRIVING' | 'DEPARTING';
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  whatsapp?: string;
  notes?: string;
  vehicleClass: string;
  addOns: string[];
  estimate: number;
  paymentMode: 'PAY_NOW' | 'PAY_ON_ARRIVAL';
  paymentToken?: string;
  status: 'CONFIRMED' | 'CANCELLED';
}

