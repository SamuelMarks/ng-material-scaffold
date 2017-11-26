import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { IAuthReq, ILoginResp } from './auth.interfaces';
import { AlertsService } from '../../app/alerts/alerts.service';

@Injectable()
export class AuthService {
  public access_token: string;
  public loggedIn = AuthService.loggedIn;

  constructor(private http: HttpClient,
              private router: Router,
              private alertsService: AlertsService) {
    const at = localStorage.getItem('access-token');
    if (at != null) this.access_token = at;
  }

  static loggedIn(): boolean {
    return localStorage.getItem('access-token') !== null;
  }

  static getAccessToken(): string {
    return localStorage.getItem('access-token');
  }

  logout() {
    localStorage.removeItem('access-token');
    localStorage.removeItem('user');
    this.router
      .navigate(['/'], this.router.url === '/auth/logout' ? {} : { queryParams: { redirectUrl: this.router.url } });
  }

  _login(login_resp: ILoginResp) {
    this.access_token = login_resp.access_token;
    localStorage.setItem('access-token', this.access_token);
  }

  public login(user: IAuthReq): Observable<ILoginResp> | /*ObservableInput<{}> |*/ void {
    localStorage.setItem('user', user.email);
    return this.http
      .post<ILoginResp>('/api/auth', user);
  }

  public register(user: IAuthReq): Observable<HttpResponse<IAuthReq>> {
    localStorage.setItem('user', user.email);
    return this.http.post<IAuthReq>('/api/user', user, { observe: 'response' });
  }

  public signinup(user: IAuthReq): Observable<IAuthReq | ILoginResp> {
    return (this.login(user) as Observable<ILoginResp>)
      .catch((err: HttpErrorResponse) =>
        err && err.error && err.error.message && err.error.message === 'User not found' ?
          this.register(user)
            .map(o => Object.assign(o.body, { access_token: o.headers.get('X-Access-Token') }))
          : this.alertsService.add(err.error.message) || Observable.throw(err.error)
      );
  }
}
