import { Injectable, inject } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHandlerFn,
  HttpInterceptor,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AlertsService } from '../alerts/alerts.service';
import { AuthService } from './auth.service';

/**
 * Functional HTTP interceptor that attaches auth tokens and redirects on auth failures.
 *
 * @param req Outgoing HTTP request.
 * @param next Next handler in the HTTP pipeline.
 * @returns Observable of the HTTP event stream.
 */
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => inject(AuthInterceptor).intercept(req, { handle: next });

/**
 * HTTP interceptor service that attaches auth tokens and redirects on auth failures.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  private readonly router = inject(Router);
  private readonly alertsService = inject(AlertsService);
  private readonly authService = inject(AuthService);

  /**
   * Intercepts HTTP requests to attach Bearer authorization headers and handle 401/403 responses.
   *
   * @param req Outgoing HTTP request.
   * @param next Next HTTP handler.
   * @returns Observable of the HTTP event stream.
   */
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getAccessToken();
    const authReq = token
      ? req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) })
      : req;

    return next.handle(authReq).pipe(
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)) {
          if (!this.router.url.includes('auth')) {
            this.alertsService.add('Authentication required');
            void this.router
              .navigate(['auth'], { queryParams: { redirectUrl: this.router.url } })
              .catch(() => undefined);
          } else {
            this.alertsService.add({
              code: error.status,
              message: error.error?.message ?? 'Authentication required',
            });
          }
        }

        return throwError(() => error);
      }),
    );
  }
}
