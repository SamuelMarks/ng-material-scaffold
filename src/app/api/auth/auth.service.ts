import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { AlertsService } from "../../alerts/alerts.service";
import { IAuthReq, ILoginResp } from './auth.interfaces';


@Injectable()
export class AuthService {
  public accessToken: string | undefined;
  public loggedIn = AuthService.loggedIn;

  constructor(private http: HttpClient,
              private router: Router,
              private alertsService: AlertsService) {
    const at = localStorage.getItem('access-token');
    if (at != null) this.accessToken = at;
  }

  static getAccessToken(): string | null {
    return localStorage.getItem('access-token');
  }

  static loggedIn(): boolean {
    return AuthService.getAccessToken() !== null;
  }

  static hasRole(role: string): boolean {
    const at = AuthService.getAccessToken() || '';
    return at.indexOf(role) > -1;
  }

  logout() {
    localStorage.removeItem('access-token');
    localStorage.removeItem('user');
    this.router
      .navigate(['/'], this.router.url === '/auth/logout' ? {} : { queryParams: { redirectUrl: this.router.url } })
      .catch(console.error);
  }

  _login(loginResp: ILoginResp) {
    this.accessToken = loginResp.access_token;
    localStorage.setItem('access-token', this.accessToken);
  }

  public login(user: IAuthReq): Observable<ILoginResp> | /*ObservableInput<{}> |*/ void {
    localStorage.setItem('user', user.username);
    user.grant_type = 'password';
    return this.http
      .post<ILoginResp>('/api/token', user);
  }

  public register(user: IAuthReq): Observable<HttpResponse<IAuthReq>> {
    localStorage.setItem('user', user.username);
    user.grant_type = 'password';
    return this.http.post<IAuthReq>('/api/user', user, { observe: 'response' })
      .pipe(
        catchError((err: HttpErrorResponse) => {
            if (err && err.error)
              if (err.error.error_message)
                this.alertsService.add(err.error.error_message);
              else throwError(err.error);
            return of({} as HttpResponse<IAuthReq>);
          }
        )
      );
  }

  public signinup(user: IAuthReq): Observable<IAuthReq | ILoginResp> {
    user.grant_type = 'password';
    return (this.login(user) as Observable<ILoginResp>)
      .pipe(
        catchError((err: any, caught: Observable<ILoginResp>): Observable<IAuthReq | ILoginResp> => {
            if (err && err.error && err.error.error_message && err.error.error_message === 'User not found')
              return this.register(user)
                .pipe(
                  map(o => Object.assign(o.body!, { access_token: o.headers.get('X-Access-Token') }) as IAuthReq | ILoginResp)
                );
            // tslint:disable:no-unused-expression
            if (typeof this.alertsService.add(err.error.error_message) !== "undefined")
              throwError(err.error);
            return new Observable();
          }
        )
      );
  }
}
