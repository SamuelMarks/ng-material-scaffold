import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { AuthService } from '../../api/auth/auth.service';
import { AlertsService } from '../alerts/alerts.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router,
              private alertsService: AlertsService) {}

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    console.info('!next.data =', !next.data, ';');
    console.info('next.data =', next.data, ';');
    if (AuthService.loggedIn() && (!next.data || !next.data.role || AuthService.hasRole(next.data.role)))
      return true;

    const url: string = state.url;

    this.alertsService.add(`${next.data && next.data.role ? 'Only ' + next.data.role + ' can' : 'Auth required to'} view ${url}`);
    this.router
      .navigate(['/auth'],
        { queryParams: { redirectUrl: url } }); // .then(() => {});
    return false;
  }
}
