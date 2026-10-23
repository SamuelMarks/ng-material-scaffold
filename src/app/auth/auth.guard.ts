import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { AlertsService } from '../alerts/alerts.service';
import { AuthService } from './auth.service';

/**
 * Functional route guard that enforces authentication and role-based access.
 *
 * @param next Activated route snapshot containing route data.
 * @param state Current router state snapshot.
 * @returns True if navigation is permitted; false otherwise.
 */
export const authGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): boolean => inject(AuthGuard).canActivate(next, state);

/**
 * Route guard service that enforces authentication and role-based access.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  private readonly router = inject(Router);
  private readonly alertsService = inject(AlertsService);
  private readonly authService = inject(AuthService);

  /**
   * Evaluates whether the user is authenticated and authorized for the target route.
   *
   * @param next Activated route snapshot containing route data.
   * @param state Current router state snapshot.
   * @returns True if navigation is permitted; false otherwise.
   */
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const roles = next.data?.['role'] as string[] | string | undefined;
    const isAuthorized =
      this.authService.isLoggedIn() && (roles == null || this.authService.hasRole(roles));

    if (isAuthorized) {
      return true;
    }

    const [path] = state.url.split('?');

    if (roles != null && !this.authService.hasRole(roles)) {
      const label = Array.isArray(roles) ? roles.join(', ') : roles;
      this.alertsService.add(`Only ${label} can view ${path}`);
      return false;
    }

    this.alertsService.add(`Auth required to view ${path}`);
    void this.router
      .navigate(['/auth'], { queryParams: { redirectUrl: path } })
      .catch(() => undefined);
    return false;
  }
}
