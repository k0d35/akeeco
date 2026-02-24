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
          { path: '', loadComponent: () => import('./features/trips/trips-list.page').then(m => m.TripsListPageComponent) },
          { path: 'drafts', loadComponent: () => import('./features/trips/drafts/drafts-list.page').then(m => m.DraftsListPageComponent) },
          { path: 'new', loadChildren: () => import('./features/trips/create-wizard/trip-wizard.routes').then(m => m.TRIP_WIZARD_ROUTES) }
        ]
      },
      { path: '**', redirectTo: 'trips' }
    ]
  },
  { path: '', pathMatch: 'full', redirectTo: 'staff/login' },
  { path: '**', redirectTo: 'staff/login' }
];
