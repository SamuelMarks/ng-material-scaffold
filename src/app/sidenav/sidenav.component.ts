import { Component, DestroyRef, inject, model } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import { map } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { ServerStatusComponent } from '../server-status/server-status.component';

/**
 * Side navigation shell with responsive behavior and auth-aware links.
 */
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    RouterLink,
    ServerStatusComponent,
  ],
})
export class SidenavComponent {
  /** Two-way bound signal tracking whether the sidenav is open. */
  readonly opened = model<boolean>(false);

  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly destroyRef = inject(DestroyRef);

  /** Reactive flag indicating whether the viewport matches a handset breakpoint. */
  readonly isHandset = toSignal(
    this.breakpointObserver.observe(Breakpoints.Handset).pipe(map((result) => result.matches)),
    { initialValue: false },
  );

  /** Computed authentication status signal from AuthService. */
  readonly isLoggedIn = this.authService.isLoggedIn;

  /**
   * Subscribes to router navigation events to automatically close the sidenav.
   */
  constructor() {
    this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.close();
    });
  }

  /**
   * Checks whether the current user has the specified role.
   *
   * @param role Role name to check.
   * @returns True if the user holds the role.
   */
  hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  /**
   * Toggles the open state of the sidenav.
   */
  toggle(): void {
    this.opened.update((isOpen) => !isOpen);
  }

  /**
   * Closes the sidenav if it is currently open.
   */
  close(): void {
    if (this.opened()) {
      this.opened.set(false);
    }
  }
}
