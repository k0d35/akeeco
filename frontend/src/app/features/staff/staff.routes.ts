import { Routes } from '@angular/router';
import { authGuard } from '../../core/auth/auth.guard';
import { roleGuard } from '../../core/auth/role.guard';

export const STAFF_ROUTES: Routes = [
  { path: 'login', loadComponent: () => import('./login.page').then(m => m.StaffLoginPageComponent) },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./staff-shell.component').then(m => m.StaffPortalShellComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', loadComponent: () => import('./pages/dashboard.page').then(m => m.StaffDashboardPageComponent) },
      { path: 'bookings', loadComponent: () => import('./pages/bookings.page').then(m => m.StaffBookingsPageComponent) },
      { path: 'bookings/:id', loadComponent: () => import('./pages/booking-detail.page').then(m => m.StaffBookingDetailPageComponent) },
      { path: 'dispatch/board', loadComponent: () => import('./pages/dispatch-board.page').then(m => m.StaffDispatchBoardPageComponent) },
      { path: 'dispatch/calendar', loadComponent: () => import('./pages/dispatch-calendar.page').then(m => m.StaffDispatchCalendarPageComponent) },
      { path: 'fleet', loadComponent: () => import('./pages/fleet.page').then(m => m.StaffFleetPageComponent) },
      { path: 'fleet/:id', loadComponent: () => import('./pages/fleet-detail.page').then(m => m.StaffFleetDetailPageComponent) },
      { path: 'drivers', loadComponent: () => import('./pages/drivers.page').then(m => m.StaffDriversPageComponent) },
      { path: 'drivers/:id', loadComponent: () => import('./pages/driver-detail.page').then(m => m.StaffDriverDetailPageComponent) },
      { path: 'pricing', canActivate: [roleGuard], data: { roles: ['ADMIN', 'DISPATCH'] }, loadComponent: () => import('./pages/pricing.page').then(m => m.StaffPricingPageComponent) },
      { path: 'analytics', canActivate: [roleGuard], data: { roles: ['ADMIN', 'DISPATCH'] }, loadComponent: () => import('./pages/analytics.page').then(m => m.StaffAnalyticsPageComponent) },
      { path: 'settings', canActivate: [roleGuard], data: { roles: ['ADMIN'] }, loadComponent: () => import('./pages/settings.page').then(m => m.StaffSettingsPageComponent) },
      { path: 'my-jobs', canActivate: [roleGuard], data: { roles: ['DRIVER'] }, loadComponent: () => import('./pages/my-jobs.page').then(m => m.StaffMyJobsPageComponent) },
      { path: 'profile', loadComponent: () => import('./pages/profile.page').then(m => m.StaffProfilePageComponent) },
    ],
  },
];

