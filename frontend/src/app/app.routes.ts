import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  { path: 'staff', loadChildren: () => import('./features/staff/staff.routes').then(m => m.STAFF_ROUTES) },

  // Legacy routes kept for backward compatibility.
  { path: 'login', loadComponent: () => import('./shell/login.page').then(m => m.LoginPageComponent) },
  {
    path: 'app',
    loadComponent: () => import('./shell/staff-shell.component').then(m => m.StaffShellComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'trips' },
      {
        path: 'trips',
        children: [
          { path: '', loadComponent: () => import('./features/staff/trips/trips-list.page').then(m => m.TripsListPageComponent) },
          { path: 'drafts', loadComponent: () => import('./features/staff/trips/drafts/drafts-list.page').then(m => m.DraftsListPageComponent) },
          { path: 'new', loadChildren: () => import('./features/staff/trips/create-wizard/trip-wizard.routes').then(m => m.TRIP_WIZARD_ROUTES) }
        ]
      },
      { path: '**', redirectTo: 'trips' }
    ]
  },
  { path: '', loadChildren: () => import('./features/public/public.routes').then(m => m.PUBLIC_ROUTES) },
  { path: '**', redirectTo: '' }
];
