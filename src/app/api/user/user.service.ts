import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { parseDates } from '../shared';
import { IUser, IUserStringDates, UserUpsert } from './user.interfaces';

/**
 * API client for user management.
 */
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);

  create(user: UserUpsert): Observable<IUser> {
    return this.http.post<IUserStringDates>('/api/user', user).pipe(map(parseDates));
  }

  read(userId?: string): Observable<IUser> {
    const suffix = userId ? `/${userId}` : '';
    return this.http.get<IUserStringDates>(`/api/user${suffix}`).pipe(map(parseDates));
  }

  update(user: UserUpsert, userId?: string): Observable<IUser> {
    const suffix = userId ? `/${userId}` : '';
    return this.http.put<IUserStringDates>(`/api/user${suffix}`, user).pipe(map(parseDates));
  }

  destroy(userId: string): Observable<void> {
    return this.http.delete<void>(`/api/user/${userId}`);
  }

  getAll(): Observable<IUser[]> {
    return this.http.get<{ users: IUserStringDates[] }>('/api/users').pipe(
      map((response) => response.users.sort((a, b) => a.username.localeCompare(b.username))),
      map((users) => users.map(parseDates)),
    );
  }
}
