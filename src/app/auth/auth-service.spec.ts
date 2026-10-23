import { TestBed, fakeAsync, flushMicrotasks } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';

import { AlertsService } from '../alerts/alerts.service';
import { AuthService } from './auth.service';
import { AuthCredentials } from './auth.interfaces';
import { LocalStorage, MemoryStorage } from '../local-storage';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let alertsService: jasmine.SpyObj<AlertsService>;
  let router: jasmine.SpyObj<Router>;
  let storage: MemoryStorage;

  const credentials: AuthCredentials = { username: 'sam', password: 'pw' };

  const configure = (
    storageSetup?: (storage: MemoryStorage) => void,
    initialUrl = '/dashboard',
  ) => {
    TestBed.resetTestingModule();
    alertsService = jasmine.createSpyObj<AlertsService>('AlertsService', ['add']);
    router = jasmine.createSpyObj<Router>('Router', ['navigate'], { url: initialUrl });
    router.navigate.and.returnValue(Promise.resolve(true));
    storage = new MemoryStorage();
    storageSetup?.(storage);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: AlertsService, useValue: alertsService },
        { provide: Router, useValue: router },
        { provide: LocalStorage, useValue: storage },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  };

  afterEach(() => {
    if (httpMock) {
      httpMock.verify();
    }
  });

  it('logs in and stores tokens', () => {
    configure();

    service.login(credentials).subscribe((token) => {
      expect(token.access_token).toBe('token');
    });

    const req = httpMock.expectOne('/api/token');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      username: 'sam',
      password: 'pw',
      grant_type: 'password',
    });

    req.flush({ access_token: 'token', refresh_token: 'refresh' });

    expect(service.isLoggedIn()).toBeTrue();
    expect(service.getAccessToken()).toBe('token');
    expect(storage.getItem('refresh_token')).toBe('refresh');
  });

  it('notifies on login error', () => {
    configure();

    service.login(credentials).subscribe({ error: () => undefined });

    const req = httpMock.expectOne('/api/token');
    req.flush({ error_message: 'bad' }, { status: 400, statusText: 'Bad Request' });

    expect(alertsService.add).toHaveBeenCalled();
  });

  it('notifies on register error', () => {
    configure();

    service.register(credentials).subscribe({ error: () => undefined });

    const req = httpMock.expectOne('/api/user');
    req.flush({ error_message: 'bad' }, { status: 400, statusText: 'Bad Request' });

    expect(alertsService.add).toHaveBeenCalled();
  });

  it('registers on user-not-found during signinup', () => {
    configure();

    service.signinup(credentials).subscribe((token) => {
      expect(token.access_token).toBe('new-token');
    });

    const tokenReq = httpMock.expectOne('/api/token');
    tokenReq.flush({ error_message: 'User not found' }, { status: 404, statusText: 'Not Found' });

    const registerReq = httpMock.expectOne('/api/user');
    registerReq.flush(
      {
        username: 'sam',
        password: 'pw',
        roles: ['login'],
        createdAt: '2020-01-01',
        updatedAt: '2020-01-02',
      },
      { headers: { 'X-Access-Token': 'new-token' } },
    );

    expect(service.getAccessToken()).toBe('new-token');
    expect(storage.getItem('refresh_token')).toBeNull();
  });

  it('falls back to an empty token when register response omits the access header', () => {
    configure();

    service.signinup(credentials).subscribe((token) => {
      expect(token.access_token).toBe('');
    });

    const tokenReq = httpMock.expectOne('/api/token');
    tokenReq.flush({ error_message: 'User not found' }, { status: 404, statusText: 'Not Found' });

    const registerReq = httpMock.expectOne('/api/user');
    registerReq.flush(
      {
        username: 'sam',
        password: 'pw',
        roles: ['login'],
        createdAt: '2020-01-01',
        updatedAt: '2020-01-02',
      },
      { headers: {} },
    );

    expect(service.getAccessToken()).toBe('');
  });

  it('propagates signinup errors when not user-not-found', () => {
    configure();

    service.signinup(credentials).subscribe({ error: () => undefined });

    const req = httpMock.expectOne('/api/token');
    req.flush({ message: 'Nope' }, { status: 500, statusText: 'Server Error' });

    expect(alertsService.add).toHaveBeenCalled();
  });

  it('logs out and clears tokens', () => {
    configure((store) => store.setItem('access_token', 'token'));

    service.logout().subscribe();

    const req = httpMock.expectOne('/secured/logout');
    req.flush(null);

    expect(storage.getItem('access_token')).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/'], {
      queryParams: { redirectUrl: '/dashboard' },
    });
  });

  it('logs out even when the API call fails', () => {
    configure((store) => store.setItem('access_token', 'token'), '/auth/logout');

    service.logout().subscribe();

    const req = httpMock.expectOne('/secured/logout');
    req.flush({ message: 'fail' }, { status: 500, statusText: 'Server Error' });

    expect(storage.getItem('access_token')).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/'], {});
  });

  it('suppresses navigation errors during logout', fakeAsync(() => {
    configure((store) => store.setItem('access_token', 'token'), '/dashboard');
    router.navigate.and.returnValue(Promise.reject(new Error('navigation failed')));

    service.logout().subscribe();

    const req = httpMock.expectOne('/secured/logout');
    req.flush(null);

    flushMicrotasks();

    expect(router.navigate).toHaveBeenCalled();
  }));

  it('checks roles based on the access token', () => {
    configure((store) => store.setItem('access_token', 'role-admin'));

    expect(service.hasRole('admin')).toBeTrue();
    expect(service.hasRole('user')).toBeFalse();
    expect(service.hasRole(['admin', 'user'])).toBeTrue();
  });

  it('returns false for role checks when no token is set', () => {
    configure();

    expect(service.hasRole('admin')).toBeFalse();
  });
});
