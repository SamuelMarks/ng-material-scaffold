import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AuthTokenResponse } from '../auth.interfaces';
import { AuthService } from '../auth.service';
import { AuthRegisterOrLogin } from './auth-register-or-login';

describe('AuthRegisterOrLogin', () => {
  let component: AuthRegisterOrLogin;
  let fixture: ComponentFixture<AuthRegisterOrLogin>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['signinup']);
    router = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);
    router.navigateByUrl.and.returnValue(Promise.resolve(true));

    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, AuthRegisterOrLogin],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthRegisterOrLogin);
    component = fixture.componentInstance;
  });

  it('marks the form invalid when submit is attempted', () => {
    component.onSubmit();

    expect(component.submissionError()).toBe('Form is invalid.');
    expect(authService.signinup).not.toHaveBeenCalled();
  });

  it('navigates on successful sign-in', () => {
    authService.signinup.and.returnValue(of({ access_token: 'token' } satisfies AuthTokenResponse));
    component.credentialsModel.set({ username: 'sam', password: 'secret' });

    component.onSubmit();

    expect(authService.signinup).toHaveBeenCalledWith({ username: 'sam', password: 'secret' });
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('surfaces errors on failed sign-in', () => {
    authService.signinup.and.returnValue(throwError(() => new Error('fail')));
    component.credentialsModel.set({ username: 'sam', password: 'secret' });

    component.onSubmit();

    expect(component.submissionError()).toBe('Unable to sign in.');
  });
});
