import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';

import { MatSnackBar } from '@angular/material/snack-bar';

import { AlertsService } from './alerts.service';

describe('AlertsService', () => {
  let service: AlertsService;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    snackBar = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      providers: [AlertsService, { provide: MatSnackBar, useValue: snackBar }],
    });

    service = TestBed.inject(AlertsService);
  });

  it('uses the provided string message and default action', () => {
    service.add('Hello');

    expect(snackBar.open).toHaveBeenCalledWith('Hello', 'Close', undefined);
  });

  it('uses the provided action label', () => {
    service.add('Hello', 'Undo');

    expect(snackBar.open).toHaveBeenCalledWith('Hello', 'Undo', undefined);
  });

  it('suppresses the action when action is false', () => {
    service.add('Hello', false);

    expect(snackBar.open).toHaveBeenCalledWith('Hello', undefined, undefined);
  });

  it('ignores nullish alerts', () => {
    service.add(undefined as unknown as string);

    expect(snackBar.open).not.toHaveBeenCalled();
  });

  it('handles HttpErrorResponse using known status', () => {
    const error = new HttpErrorResponse({ status: 504, statusText: 'Gateway Timeout' });

    service.add(error);

    expect(snackBar.open).toHaveBeenCalledWith('Gateway Timeout', 'Close', undefined);
  });

  it('handles Error instances', () => {
    service.add(new Error('Boom'));

    expect(snackBar.open).toHaveBeenCalledWith('API server not available', 'Close', undefined);
  });

  it('reuses known error messages without a fallback', () => {
    service.add(new Error('Gateway Timeout'));

    expect(snackBar.open).toHaveBeenCalledWith('Gateway Timeout', 'Close', undefined);
  });

  it('handles alert objects with error_message', () => {
    service.add({ error: 'bad', error_message: 'Wrong credentials' });

    expect(snackBar.open).toHaveBeenCalledWith('Wrong credentials', 'Close', undefined);
  });

  it('handles alert objects with message', () => {
    service.add({ code: 403, message: 'Forbidden' });

    expect(snackBar.open).toHaveBeenCalledWith('Forbidden', 'Close', undefined);
  });

  it('handles generic objects', () => {
    service.add({ foo: 'bar', count: 2 });

    expect(snackBar.open).toHaveBeenCalledWith('bar\t2', 'Close', undefined);
  });
});
