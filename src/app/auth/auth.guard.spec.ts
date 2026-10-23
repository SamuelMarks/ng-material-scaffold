import { TestBed, fakeAsync, flushMicrotasks } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

import { AlertsService } from '../alerts/alerts.service';
import { AuthService } from './auth.service';
import { AuthGuard, authGuard } from './auth.guard';

describe('AuthGuard', () => {
  const setup = (loggedIn: boolean, hasRole: boolean) => {
    TestBed.resetTestingModule();
    const authService = {
      isLoggedIn: signal(loggedIn),
      hasRole: () => hasRole,
    };
    const alertsService = jasmine.createSpyObj<AlertsService>('AlertsService', ['add']);
    const router = jasmine.createSpyObj<Router>('Router', ['navigate'], { url: '/dashboard' });
    router.navigate.and.returnValue(Promise.resolve(true));

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authService },
        { provide: AlertsService, useValue: alertsService },
        { provide: Router, useValue: router },
      ],
    });

    return {
      guard: TestBed.inject(AuthGuard),
      alertsService,
      router,
    };
  };

  it('allows navigation when logged in via functional authGuard', () => {
    setup(true, true);

    const snapshot = { data: {} } as unknown as ActivatedRouteSnapshot;
    const state = { url: '/admin' } as RouterStateSnapshot;

    const result = TestBed.runInInjectionContext(() => authGuard(snapshot, state));

    expect(result).toBeTrue();
  });

  it('allows navigation when role requirements are satisfied', () => {
    const { guard, alertsService } = setup(true, true);

    const snapshot = { data: { role: 'admin' } } as unknown as ActivatedRouteSnapshot;
    const state = { url: '/admin' } as RouterStateSnapshot;

    const result = guard.canActivate(snapshot, state);

    expect(result).toBeTrue();
    expect(alertsService.add).not.toHaveBeenCalled();
  });

  it('blocks navigation when role is insufficient', () => {
    const { guard, alertsService } = setup(true, false);

    const snapshot = { data: { role: ['admin'] } } as unknown as ActivatedRouteSnapshot;
    const state = { url: '/admin' } as RouterStateSnapshot;

    const result = guard.canActivate(snapshot, state);

    expect(result).toBeFalse();
    expect(alertsService.add).toHaveBeenCalledWith('Only admin can view /admin');
  });

  it('blocks navigation when role string is insufficient', () => {
    const { guard, alertsService } = setup(true, false);

    const snapshot = { data: { role: 'admin' } } as unknown as ActivatedRouteSnapshot;
    const state = { url: '/admin?mode=full' } as RouterStateSnapshot;

    const result = guard.canActivate(snapshot, state);

    expect(result).toBeFalse();
    expect(alertsService.add).toHaveBeenCalledWith('Only admin can view /admin');
  });

  it('redirects to auth when not logged in', () => {
    const { guard, alertsService, router } = setup(false, false);

    const snapshot = { data: {} } as unknown as ActivatedRouteSnapshot;
    const state = { url: '/secret-dashboard' } as RouterStateSnapshot;

    const result = guard.canActivate(snapshot, state);

    expect(result).toBeFalse();
    expect(alertsService.add).toHaveBeenCalledWith('Auth required to view /secret-dashboard');
    expect(router.navigate).toHaveBeenCalledWith(['/auth'], {
      queryParams: { redirectUrl: '/secret-dashboard' },
    });
  });

  it('swallows navigation errors when redirecting to auth', fakeAsync(() => {
    const { guard, alertsService, router } = setup(false, false);
    router.navigate.and.returnValue(Promise.reject(new Error('navigation failed')));

    const snapshot = { data: {} } as unknown as ActivatedRouteSnapshot;
    const state = { url: '/secret-dashboard' } as RouterStateSnapshot;

    const result = guard.canActivate(snapshot, state);

    flushMicrotasks();

    expect(result).toBeFalse();
    expect(alertsService.add).toHaveBeenCalledWith('Auth required to view /secret-dashboard');
    expect(router.navigate).toHaveBeenCalledWith(['/auth'], {
      queryParams: { redirectUrl: '/secret-dashboard' },
    });
  }));
});
