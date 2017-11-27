import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';

import { IUser } from './user.interfaces';
import { parseDates } from '../shared';

@Injectable()
export class UserService {
  access_token: string;

  constructor(private http: HttpClient) {
    const at = localStorage.getItem('access-token');
    if (at != null) this.access_token = at;
  }

  create(user: IUser): Observable<IUser> {
    return this.http
      .post<IUser>('/api/user', user)
      .map(parseDates);
  }

  read(): Observable<IUser> {
    return this.http
      .get<IUser>('/api/user')
      .map(parseDates);
  }

  update(user: IUser): Observable<IUser> {
    return this.http
      .put<IUser>('/api/user', user)
      .map(parseDates);
  }

  destroy(user: IUser): Observable<IUser> {
    return this.http
      .delete<IUser>('/api/user')
      .map(parseDates);
  }

  getAll(): Observable<IUser[]> {
    return this.http
      .get<{users: IUser[]}>('/api/users')
      .map(users => users.users)
      .map(users => users.map(parseDates));
  }
}
