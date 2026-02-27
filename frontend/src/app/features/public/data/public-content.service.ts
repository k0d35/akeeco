import { Injectable } from '@angular/core';
import { FaqItem, Testimonial, VehicleClass } from './public.models';

@Injectable({ providedIn: 'root' })
export class PublicContentService {
  vehicles: VehicleClass[] = [
    { id: 'SEDAN', name: 'Executive Sedan', seats: 3, luggage: 2, amenities: ['WiFi', 'Leather Seats', 'Bottled Water'], fromPrice: 55, recommendedFor: ['Airport', 'Corporate'], imageUrl: 'https://placehold.co/800x500' },
    { id: 'SUV', name: 'Luxury SUV', seats: 6, luggage: 5, amenities: ['WiFi', 'USB Charging', 'A/C'], fromPrice: 85, recommendedFor: ['VIP', 'Family'], imageUrl: 'https://placehold.co/800x500' },
    { id: 'VAN', name: 'Executive Van', seats: 10, luggage: 10, amenities: ['Cooler', 'A/C', 'Large Cabin'], fromPrice: 120, recommendedFor: ['Group', 'Tours'], imageUrl: 'https://placehold.co/800x500' },
    { id: 'LIMO', name: 'Stretch Limo', seats: 8, luggage: 4, amenities: ['Mood Lighting', 'Premium Audio', 'Champagne Setup'], fromPrice: 220, recommendedFor: ['Events', 'Weddings'], imageUrl: 'https://placehold.co/800x500' },
  ];

  testimonials: Testimonial[] = [
    { id: 't1', quote: 'On-time pickup and pristine SUV. Best start to our Jamaica trip.', name: 'Tanya R.', location: 'Toronto', rating: 5 },
    { id: 't2', quote: 'Professional driver, smooth airport transfer, and clear communication.', name: 'James P.', location: 'Atlanta', rating: 5 },
    { id: 't3', quote: 'Private tour was exceptional. We felt looked after all day.', name: 'Nadia S.', location: 'London', rating: 5 },
    { id: 't4', quote: 'Corporate transfers handled perfectly for our executive team.', name: 'Alex M.', location: 'Miami', rating: 5 },
    { id: 't5', quote: 'Great family service and easy booking process.', name: 'Priya D.', location: 'New York', rating: 5 },
    { id: 't6', quote: 'Luxury feel from booking to drop-off.', name: 'Carl B.', location: 'Kingston', rating: 5 },
  ];

  airportFaqs: FaqItem[] = [
    { q: 'Do you track flight arrivals?', a: 'Yes. Share your flight number and we monitor updates.' },
    { q: 'How long is the grace period?', a: 'We include a grace period after touchdown before waiting fees apply.' },
    { q: 'Can I request meet-and-greet?', a: 'Yes, select Meet & Greet during booking.' },
    { q: 'Can I book return transfer?', a: 'Yes, choose round-trip in booking.' },
    { q: 'Do you serve all MBJ terminals?', a: 'Yes, arrivals and departures at MBJ are supported.' },
    { q: 'What if my flight is delayed?', a: 'We adjust pickup timing based on live flight status where flight number is provided.' },
  ];

  toursFaqs: FaqItem[] = [
    { q: 'Can we customize stops?', a: 'Yes, private tours are customizable.' },
    { q: 'Are tour durations fixed?', a: 'Choose 4h, 6h, 8h, or custom duration.' },
    { q: 'Can we include lunch stops?', a: 'Yes, note this in your itinerary.' },
    { q: 'Do you provide child seats?', a: 'Yes, add child seats in booking add-ons.' },
    { q: 'Can we extend while on trip?', a: 'Yes, subject to availability and overtime rates.' },
    { q: 'Can we request specific drivers?', a: 'We try to honor requests when available.' },
  ];
}

