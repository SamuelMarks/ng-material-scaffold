import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { AuthService } from '../../api/auth/auth.service';
import { AlertsService } from '../alerts/alerts.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router,
              private alertsService: AlertsService) {}

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (AuthService.loggedIn()) return true;

    const url: string = state.url;

    this.alertsService.add(`Auth required to view ${url}`);
    this.router
      .navigate(['/auth'],
        { queryParams: { redirectUrl: url } })
      .then(() => {});
    return false;
  }
}
