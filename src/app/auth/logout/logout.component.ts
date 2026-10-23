import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AuthService } from '../auth.service';

/**
 * Performs logout side effects on init.
 */
@Component({
  selector: 'app-logout',
  template: '',
})
export class LogoutComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  /**
   * Triggers user logout when the component initializes.
   */
  ngOnInit(): void {
    this.authService.logout().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }
}
