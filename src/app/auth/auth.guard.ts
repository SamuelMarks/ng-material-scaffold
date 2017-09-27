import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../../api/auth/auth.service';
import { AlertsService } from '../alerts/alerts.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router,
              private alertsService: AlertsService) {}

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): boolean {
    const url: string = state.url;

    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    if (AuthService.loggedIn()) return true;

    this.alertsService.add(`Auth required to view ${url}`);
    this.router
      .navigate(['/auth'],
        { queryParams: { redirectUrl: url } })
      .then(() => {});
    return false;
  }
}
