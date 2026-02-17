import { Routes } from '@angular/router';

export const TRIP_WIZARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./trip-create-wizard-shell.page').then(m => m.TripCreateWizardShellPageComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'customer' },
      { path: 'customer', loadComponent: () => import('./steps/customer.step').then(m => m.CustomerStepComponent) },
      { path: 'pickup', loadComponent: () => import('./steps/pickup.step').then(m => m.PickupStepComponent) },
      { path: 'dropoff', loadComponent: () => import('./steps/dropoff.step').then(m => m.DropoffStepComponent) },
      { path: 'schedule', loadComponent: () => import('./steps/schedule.step').then(m => m.ScheduleStepComponent) },
      { path: 'pricing', loadComponent: () => import('./steps/pricing.step').then(m => m.PricingStepComponent) },
      { path: 'assignment', loadComponent: () => import('./steps/assignment.step').then(m => m.AssignmentStepComponent) },
      { path: 'billing', loadComponent: () => import('./steps/billing.step').then(m => m.BillingStepComponent) },
      { path: 'review', loadComponent: () => import('./steps/review.step').then(m => m.ReviewStepComponent) },
    ]
  }
];
