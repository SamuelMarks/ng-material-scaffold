import { TestBed, fakeAsync, flushMicrotasks } from '@angular/core/testing';
import { HttpErrorResponse, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AlertsService } from '../alerts/alerts.service';
import { AuthService } from './auth.service';
import { AuthInterceptor, authInterceptor } from './auth.interceptors';

describe('AuthInterceptor', () => {
  const setup = (token: string | null, currentUrl = '/dashboard') => {
    TestBed.resetTestingModule();
    const authService = { getAccessToken: () => token };
    const alertsService = jasmine.createSpyObj<AlertsService>('AlertsService', ['add']);
    const router = jasmine.createSpyObj<Router>('Router', ['navigate'], { url: currentUrl });
    router.navigate.and.returnValue(Promise.resolve(true));

    TestBed.configureTestingModule({
      providers: [
        AuthInterceptor,
        { provide: AuthService, useValue: authService },
        { provide: AlertsService, useValue: alertsService },
        { provide: Router, useValue: router },
      ],
    });

    return {
      interceptor: TestBed.inject(AuthInterceptor),
      alertsService,
      router,
    };
  };

  it('attaches the Authorization header when token is present via functional authInterceptor', (done) => {
    setup('token');

    TestBed.runInInjectionContext(() =>
      authInterceptor(new HttpRequest('GET', '/data'), (req) => {
        expect(req.headers.get('Authorization')).toBe('Bearer token');
        return of(new HttpResponse({ status: 200 }));
      }),
    ).subscribe({
      next: () => done(),
      error: done.fail,
    });
  });

  it('does not attach the Authorization header when token is missing', (done) => {
    const { interceptor } = setup(null);
    const handler: HttpHandler = {
      handle: (req) => {
        expect(req.headers.has('Authorization')).toBeFalse();
        return of(new HttpResponse({ status: 200 }));
      },
    };

    interceptor.intercept(new HttpRequest('GET', '/data'), handler).subscribe({
      next: () => done(),
      error: done.fail,
    });
  });

  it('redirects to auth on 401 when not already on auth route', (done) => {
    const { interceptor, alertsService, router } = setup('token', '/dashboard');
    const handler: HttpHandler = {
      handle: () =>
        throwError(() => new HttpErrorResponse({ status: 401, error: { message: 'Nope' } })),
    };

    interceptor.intercept(new HttpRequest('GET', '/data'), handler).subscribe({
      next: () => done.fail('expected error'),
      error: () => {
        expect(alertsService.add).toHaveBeenCalledWith('Authentication required');
        expect(router.navigate).toHaveBeenCalledWith(['auth'], {
          queryParams: { redirectUrl: '/dashboard' },
        });
        done();
      },
    });
  });

  it('swallows navigation failures when redirecting', fakeAsync(() => {
    const { interceptor, alertsService, router } = setup('token', '/dashboard');
    router.navigate.and.returnValue(Promise.reject(new Error('navigation failed')));
    const handler: HttpHandler = {
      handle: () => throwError(() => new HttpErrorResponse({ status: 401 })),
    };

    let handled = false;
    interceptor.intercept(new HttpRequest('GET', '/data'), handler).subscribe({
      next: () => fail('expected error'),
      error: () => {
        handled = true;
      },
    });

    flushMicrotasks();

    expect(handled).toBeTrue();
    expect(alertsService.add).toHaveBeenCalledWith('Authentication required');
    expect(router.navigate).toHaveBeenCalled();
  }));

  it('shows an alert when already on auth route', (done) => {
    const { interceptor, alertsService, router } = setup('token', '/auth/login');
    const handler: HttpHandler = {
      handle: () =>
        throwError(() => new HttpErrorResponse({ status: 403, error: { message: 'Forbidden' } })),
    };

    interceptor.intercept(new HttpRequest('GET', '/data'), handler).subscribe({
      next: () => done.fail('expected error'),
      error: () => {
        expect(alertsService.add).toHaveBeenCalledWith({ code: 403, message: 'Forbidden' });
        expect(router.navigate).not.toHaveBeenCalled();
        done();
      },
    });
  });

  it('uses the fallback message when auth errors lack details on auth route', (done) => {
    const { interceptor, alertsService, router } = setup('token', '/auth/login');
    const handler: HttpHandler = {
      handle: () => throwError(() => new HttpErrorResponse({ status: 401, error: {} })),
    };

    interceptor.intercept(new HttpRequest('GET', '/data'), handler).subscribe({
      next: () => done.fail('expected error'),
      error: () => {
        expect(alertsService.add).toHaveBeenCalledWith({
          code: 401,
          message: 'Authentication required',
        });
        expect(router.navigate).not.toHaveBeenCalled();
        done();
      },
    });
  });

  it('passes through non-auth errors without redirects', (done) => {
    const { interceptor, alertsService, router } = setup('token', '/dashboard');
    const handler: HttpHandler = {
      handle: () =>
        throwError(() => new HttpErrorResponse({ status: 500, error: { message: 'Fail' } })),
    };

    interceptor.intercept(new HttpRequest('GET', '/data'), handler).subscribe({
      next: () => done.fail('expected error'),
      error: () => {
        expect(alertsService.add).not.toHaveBeenCalled();
        expect(router.navigate).not.toHaveBeenCalled();
        done();
      },
    });
  });
});
