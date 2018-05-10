import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { AuthService } from '../../api/auth/auth.service';
import { AlertsService } from '../alerts/alerts.service';

@Injectable()
export class AuthGuard implements CanActivate {
  static role: string;

  constructor(private router: Router,
              private alertsService: AlertsService) {}

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (AuthService.loggedIn() && (AuthGuard.role != null || AuthService.hasRole(AuthGuard.role)))
      return true;

    const url: string = state.url;

    this.alertsService.add(`${AuthGuard.role == null ? 'Auth' : AuthGuard.role} required to view ${url}`);
    this.router
      .navigate(['/auth'],
        { queryParams: { redirectUrl: url } })
      .then(() => {});
    return false;
  }
}

export const hasRole = (role: string): typeof AuthGuard => {
  AuthGuard.role = role;
  return AuthGuard;
};
