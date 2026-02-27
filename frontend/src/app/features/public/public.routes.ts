import { Routes } from '@angular/router';

export const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./public-shell.component').then(m => m.PublicShellComponent),
    children: [
      { path: '', pathMatch: 'full', loadComponent: () => import('./pages/home.page').then(m => m.HomePageComponent) },
      { path: 'services', loadComponent: () => import('./pages/services-hub.page').then(m => m.ServicesHubPageComponent) },
      { path: 'services/airport-transfers', loadComponent: () => import('./pages/service-airport.page').then(m => m.ServiceAirportPageComponent) },
      { path: 'services/private-tours', loadComponent: () => import('./pages/service-private-tours.page').then(m => m.ServicePrivateToursPageComponent) },
      { path: 'services/corporate-vip', loadComponent: () => import('./pages/service-corporate-vip.page').then(m => m.ServiceCorporateVipPageComponent) },
      { path: 'services/events', loadComponent: () => import('./pages/service-events.page').then(m => m.ServiceEventsPageComponent) },
      { path: 'fleet', loadComponent: () => import('./pages/fleet.page').then(m => m.FleetPageComponent) },
      { path: 'pricing', loadComponent: () => import('./pages/pricing.page').then(m => m.PricingPageComponent) },
      { path: 'book', loadComponent: () => import('./pages/book.page').then(m => m.BookPageComponent) },
      { path: 'manage-booking', loadComponent: () => import('./pages/manage-booking.page').then(m => m.ManageBookingPageComponent) },
      { path: 'about', loadComponent: () => import('./pages/about.page').then(m => m.AboutPageComponent) },
      { path: 'contact', loadComponent: () => import('./pages/contact.page').then(m => m.ContactPageComponent) },
      { path: '**', redirectTo: '' },
    ],
  },
];
