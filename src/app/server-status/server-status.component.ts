import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';

import { AlertsService } from '../alerts/alerts.service';
import { ServerStatusService } from '../api/server-status/server-status.service';

const APP_VERSION = '0.0.44';

/**
 * Displays the application and API server versions.
 */
@Component({
  selector: 'app-server-status',
  template: `
    @if (status()) {
      <span class="server-status">{{ status() }}</span>
    }
  `,
})
export class ServerStatusComponent {
  private readonly alertsService = inject(AlertsService);
  private readonly serverStatusService = inject(ServerStatusService);
  private readonly destroyRef = inject(DestroyRef);

  /** Current status text shown in the UI. */
  readonly status = signal('');

  /**
   * Initializes the server status check against the backend API.
   */
  constructor() {
    this.status.set(`@ ${APP_VERSION}; `);
    this.serverStatusService
      .get()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (serverStatus) => {
          this.status.update((value) => `${value}API ${serverStatus.version}`);
        },
        error: (error: HttpErrorResponse) => {
          const msg = error.status === 504 ? 'API server not available' : error.statusText;
          this.alertsService.add(msg);
          this.status.update((value) => `${value}${msg}`);
        },
      });
  }
}
