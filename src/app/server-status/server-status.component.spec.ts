import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';

import { AlertsService } from '../alerts/alerts.service';
import { ServerStatusService } from '../api/server-status/server-status.service';
import { ServerStatusComponent } from './server-status.component';

describe('ServerStatusComponent', () => {
  const setup = (response$: Observable<{ version: string }>) => {
    TestBed.resetTestingModule();
    const alertsService = { add: jasmine.createSpy('add') };
    const serverStatusService = { get: () => response$ };

    TestBed.configureTestingModule({
      imports: [ServerStatusComponent],
      providers: [
        { provide: AlertsService, useValue: alertsService },
        { provide: ServerStatusService, useValue: serverStatusService },
      ],
    });

    const component = TestBed.createComponent(ServerStatusComponent).componentInstance;
    return { component, alertsService };
  };

  it('appends the API version on success', () => {
    const { component, alertsService } = setup(of({ version: '1.2.3' }));

    expect(component.status()).toContain('@ 0.0.44;');
    expect(component.status()).toContain('API 1.2.3');
    expect(alertsService.add).not.toHaveBeenCalled();
  });

  it('surfaces errors and appends the message on failure', () => {
    const error = new HttpErrorResponse({ status: 504, statusText: 'Gateway Timeout' });
    const { component, alertsService } = setup(throwError(() => error));

    expect(alertsService.add).toHaveBeenCalledWith('API server not available');
    expect(component.status()).toContain('API server not available');
  });

  it('uses the status text for non-504 errors', () => {
    const error = new HttpErrorResponse({ status: 500, statusText: 'Server Error' });
    const { component, alertsService } = setup(throwError(() => error));

    expect(alertsService.add).toHaveBeenCalledWith('Server Error');
    expect(component.status()).toContain('Server Error');
  });
});
