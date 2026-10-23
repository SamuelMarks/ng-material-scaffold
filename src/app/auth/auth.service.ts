import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { AlertsService } from '../alerts/alerts.service';
import { LocalStorage } from '../local-storage';
import { AuthCredentials, AuthTokenResponse } from './auth.interfaces';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user';

/**
 * Handles authentication workflows and token storage.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly alertsService = inject(AlertsService);
  private readonly localStorage = inject(LocalStorage);

  private readonly accessToken = signal<string | null>(this.localStorage.getItem(ACCESS_TOKEN_KEY));
  private readonly refreshToken = signal<string | null>(
    this.localStorage.getItem(REFRESH_TOKEN_KEY),
  );

  /** Computed auth status for guards and UI. */
  readonly isLoggedIn = computed(() => this.accessToken() != null);

  getAccessToken(): string | null {
    return this.accessToken();
  }

  hasRole(role: string | string[]): boolean {
    const token = this.accessToken();
    if (!token) {
      return false;
    }
    const roles = Array.isArray(role) ? role : [role];
    return roles.some((candidate) => token.includes(candidate));
  }

  login(credentials: AuthCredentials): Observable<AuthTokenResponse> {
    const payload = { ...credentials, grant_type: 'password' };
    this.localStorage.setItem(USER_KEY, credentials.username);
    return this.http.post<AuthTokenResponse>('/api/token', payload).pipe(
      tap((token) => this.storeTokens(token, credentials.username)),
      catchError((error: HttpErrorResponse) => {
        this.alertsService.add(error);
        return throwError(() => error);
      }),
    );
  }

  register(credentials: AuthCredentials): Observable<HttpResponse<AuthCredentials>> {
    const payload = { ...credentials, grant_type: 'password' };
    this.localStorage.setItem(USER_KEY, credentials.username);
    return this.http.post<AuthCredentials>('/api/user', payload, { observe: 'response' }).pipe(
      catchError((error: HttpErrorResponse) => {
        this.alertsService.add(error);
        return throwError(() => error);
      }),
    );
  }

  signinup(credentials: AuthCredentials): Observable<AuthTokenResponse> {
    return this.login(credentials).pipe(
      catchError((error: HttpErrorResponse) => {
        if (AuthService.isUserNotFound(error)) {
          return this.register(credentials).pipe(
            map((response) => ({
              access_token: response.headers.get('X-Access-Token') ?? '',
            })),
            tap((token) => this.storeTokens(token, credentials.username)),
          );
        }

        this.alertsService.add(error);
        return throwError(() => error);
      }),
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>('/secured/logout', null).pipe(
      catchError(() => of(undefined)),
      tap(() => this.clearTokens()),
      tap(() => {
        void this.router
          .navigate(
            ['/'],
            this.router.url === '/auth/logout'
              ? {}
              : { queryParams: { redirectUrl: this.router.url } },
          )
          .catch(() => undefined);
      }),
    );
  }

  private storeTokens(token: AuthTokenResponse, username: string): void {
    this.localStorage.setItem(ACCESS_TOKEN_KEY, token.access_token);
    if (token.refresh_token) {
      this.localStorage.setItem(REFRESH_TOKEN_KEY, token.refresh_token);
      this.refreshToken.set(token.refresh_token);
    } else {
      this.localStorage.removeItem(REFRESH_TOKEN_KEY);
      this.refreshToken.set(null);
    }
    this.localStorage.setItem(USER_KEY, username);
    this.accessToken.set(token.access_token);
  }

  private clearTokens(): void {
    this.localStorage.removeItem(ACCESS_TOKEN_KEY);
    this.localStorage.removeItem(REFRESH_TOKEN_KEY);
    this.localStorage.removeItem(USER_KEY);
    this.accessToken.set(null);
    this.refreshToken.set(null);
  }

  private static isUserNotFound(error: HttpErrorResponse): boolean {
    const message = typeof error.error?.error_message === 'string' ? error.error.error_message : '';
    return message === 'User not found';
  }
}
