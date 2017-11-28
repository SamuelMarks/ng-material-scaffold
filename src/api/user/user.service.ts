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

  read(user_id?: string): Observable<IUser> {
    return this.http
      .get<IUser>(`/api/user${user_id == null ? '' : '/' + user_id}`)
      .map(parseDates);
  }

  update(user: IUser, user_id?: string): Observable<IUser> {
    return this.http
      .put<IUser>(`/api/user${user_id == null ? '' : '/' + user_id}`, user)
      .map(parseDates);
  }

  destroy(user_id: string): Observable<{}> {
    return this.http
      .delete(`/api/user/${user_id}`);
  }

  getAll(): Observable<IUser[]> {
    return this.http
      .get<{users: IUser[]}>('/api/users')
      .map(users => users.users.sort((a, b) => a.email.localeCompare(b.email))) // TODO: sort server-side
      .map(users => users.map(parseDates));
  }
}
