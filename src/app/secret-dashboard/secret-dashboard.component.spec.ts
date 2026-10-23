import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';

import { SecretService } from './secret-service.service';
import { SecretDashboardComponent } from './secret-dashboard.component';

describe('SecretDashboardComponent', () => {
  const setup = (response$: Observable<string>) => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [SecretDashboardComponent],
      providers: [{ provide: SecretService, useValue: { get: () => response$ } }],
    });

    return TestBed.createComponent(SecretDashboardComponent).componentInstance;
  };

  it('stores the secret when the API succeeds', () => {
    const component = setup(of('top-secret'));

    expect(component.secret()).toBe('top-secret');
    expect(component.secretError()).toBeNull();
  });

  it('stores errors when the API fails', () => {
    const component = setup(throwError(() => new Error('fail')));

    expect(component.secret()).toBeNull();
    expect(component.secretError()).toBeTruthy();
  });
});
