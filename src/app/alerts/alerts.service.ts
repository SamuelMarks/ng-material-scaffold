import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

import { TAlert } from './alerts.types';

const DEFAULT_ALERT = 'API server not available';

/**
 * Centralized alerting service for surfacing messages via snack bars.
 */
@Injectable({
  providedIn: 'root',
})
export class AlertsService {
  private readonly snackBar = inject(MatSnackBar);

  add(
    alert: string | TAlert | Error | HttpErrorResponse,
    action?: string | false,
    config?: MatSnackBarConfig,
  ): void {
    if (alert == null) {
      return;
    }

    const message = this.resolveMessage(alert);
    const snackBarAction =
      typeof action === 'string' ? action : action === false ? undefined : 'Close';

    this.snackBar.open(message, snackBarAction, config);
  }

  private resolveMessage(alert: string | TAlert | Error | HttpErrorResponse): string {
    if (typeof alert === 'string') {
      return alert;
    }

    if (alert instanceof HttpErrorResponse) {
      return AlertsService.toKnownElse(alert.status, alert.statusText);
    }

    if (alert instanceof Error) {
      return AlertsService.toKnownElse(alert.message);
    }

    if (AlertsService.isAlertWithErrorMessage(alert)) {
      return alert.error_message;
    }

    if (AlertsService.isAlertWithMessage(alert)) {
      return alert.message;
    }

    return Object.values(alert)
      .map((value) => String(value))
      .join('\t');
  }

  private static toKnownElse(value: string | number, fallback?: string): string {
    const known = new Set<string | number>([504, 'Gateway Timeout']);
    if (known.has(value)) {
      return fallback ?? String(value);
    }
    return DEFAULT_ALERT;
  }

  private static isAlertWithErrorMessage(alert: TAlert): alert is { error_message: string } {
    return typeof (alert as { error_message?: unknown }).error_message === 'string';
  }

  private static isAlertWithMessage(alert: TAlert): alert is { message: string } {
    return typeof (alert as { message?: unknown }).message === 'string';
  }
}
