import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

import { TAlert } from './alerts.types';

@Injectable()
export class AlertsService {
  alerts: string[];

  constructor(private snackBar: MatSnackBar) {
    this.alerts = [];
  }

  public add(alert: string | TAlert | Error, action?: string | false, config?: MatSnackBarConfig): void {
    if (alert == null) return;

    const objToStr = (obj: {[key: string]: any}): string => Object
      .keys(obj)
      .map(k => obj[k])
      .join('\t');

    const toKnownElse = (k: string | number, els?: string): string => {
      const message: string = 'API server not available';
      let known: Set<string|number> = new Set();
      known.add(504);
      known.add('Gateway Timeout');

      /*const known: {[key: string]: string} &  {[key: number]: string} | {[key: string]: string} | {[key: number]: string} = {
        'Gateway Timeout': 'API server not available',
        504: 'API server not available'
      };*/
      return known.has(k) ? (els == null ? k.toString() : els) : message;
    };

    const alertMessage: string = ((): string => {
      switch (typeof alert) {
        case 'string':
          return alert;
        case 'object':
          if (alert instanceof HttpErrorResponse || ['status', 'statusText'].every(alert.hasOwnProperty))
            return toKnownElse((alert as HttpErrorResponse).status, (alert as HttpErrorResponse).statusText);
          else if (alert instanceof Error) return toKnownElse(alert.message);
          else return objToStr(alert);
        default:
          console.error(alert);
          return 'undefined alert';
      }
    })();
    // console.warn('AlertService::alerts =', this.alerts, ';');
    this.snackBar.open(
      alertMessage,
      !action && typeof action !== 'boolean' ? 'Close' : action as string,
      config
    );
  }
}
