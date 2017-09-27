import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';

import { IAuthReq, ILoginResp } from './auth.interfaces';

@Injectable()
export class AuthService {
  public access_token: string;

  static loggedIn(): boolean {
    return localStorage.getItem('access-token') !== null;
  }

  static logout() {
    localStorage.removeItem('access-token');
  }

  constructor(private http: HttpClient) {
    const at = localStorage.getItem('access-token');
    if (at != null) this.access_token = at;
  }

  public login(user: IAuthReq): Observable<IAuthReq> {
    return this.http.post<IAuthReq>('/api/auth', user);
  }

  public register(user: IAuthReq): Observable<IAuthReq> {
    return this.http.post<IAuthReq>('/api/user', user);
  }

  public signinup(user: IAuthReq): Observable<IAuthReq | ILoginResp> {
    return this
      .login(user)
      .catch(_ => this.register(user));
  }
}
