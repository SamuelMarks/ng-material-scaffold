import { Injectable } from '@angular/core';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { TAlert } from './alerts.types';

@Injectable()
export class AlertsService {
  alerts: string[] = [];

  constructor(private snackBar: MdSnackBar) {
    // this.alerts = [];
  }

  public add(alert: string | TAlert | Error, action?: string, config?: MdSnackBarConfig) {
    const alert_s = typeof alert === 'string' ? alert
      : (alert instanceof Error ? alert.message : Object
        .keys(alert)
        .map(k => alert[k])
        .join('\t'));

    this.alerts.push(alert_s);
    // console.warn('AlertsService::alerts =', this.alerts, ';');
    this.snackBar.open(alert_s, action, config);
  }
}
