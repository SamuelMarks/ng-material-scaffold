import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';

import { IUser } from './user.interfaces';

@Injectable()
export class UserService {
  access_token: string;

  constructor(private http: HttpClient) {
    const at = localStorage.getItem('access-token');
    if (at != null) this.access_token = at;
  }

  users(): Observable<IUser[]> {
    return this.http
      .get<{users: IUser[]}>('/api/users')
      .map(users => users.users)
      .map(users => users.map(user => Object.assign(user, {
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt)
      })));
  }
}
