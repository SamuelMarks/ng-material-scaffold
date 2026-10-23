import { Component, DestroyRef, inject, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { SecretService } from './secret-service.service';

/**
 * Protected dashboard that loads a secret from the API.
 */
@Component({
  selector: 'app-secret-dashboard',
  template: `
    <p>Shhhh! - this <code>secret-dashboard</code> is only available to authenticated users</p>

    @if (secret(); as secretValue) {
      Server says this is the <em>{{ secretValue }}</em>
    } @else {
      @if (secretError(); as secretErrorValue) {
        <pre>secretError = {{ secretErrorValue | json }}</pre>
      }
    }
  `,
  imports: [JsonPipe],
})
export class SecretDashboardComponent {
  private readonly secretService = inject(SecretService);
  private readonly destroyRef = inject(DestroyRef);

  /** Secret returned by the API, if available. */
  readonly secret = signal<string | null>(null);
  /** Error response from the API, if any. */
  readonly secretError = signal<unknown | null>(null);

  /**
   * Loads the protected secret value on component creation.
   */
  constructor() {
    this.secretService
      .get()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (secret) => this.secret.set(secret),
        error: (error: unknown) => this.secretError.set(error),
      });
  }
}
