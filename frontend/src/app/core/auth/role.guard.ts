import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService, StaffRole } from '../../shared-data/auth/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const roles = (route.data?.['roles'] as StaffRole[] | undefined) ?? [];
  if (roles.length === 0 || auth.hasAnyRole(roles)) return true;
  return router.createUrlTree(['/staff/dashboard']);
};

