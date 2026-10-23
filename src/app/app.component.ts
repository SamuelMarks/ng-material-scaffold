import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FooterComponent } from './footer/footer.component';
import { ServerStatusComponent } from './server-status/server-status.component';
import { SidenavComponent } from './sidenav/sidenav.component';

/**
 * Root application shell component.
 */
@Component({
  selector: 'app-root',
  template: `
    <app-sidenav [(opened)]="sidenavOpened">
      <main class="app-body">
        <router-outlet />
      </main>
      <app-footer class="footer">
        <app-server-status />
      </app-footer>
    </app-sidenav>
  `,
  styleUrl: './app.component.scss',
  imports: [FooterComponent, RouterOutlet, ServerStatusComponent, SidenavComponent],
  host: {
    '(document:keydown.escape)': 'closeSidenav()',
  },
})
export class AppComponent {
  /** Visible title for the application. */
  readonly title = 'ng-material-scaffold';
  /** Tracks whether the side navigation is open. */
  readonly sidenavOpened = signal(false);

  /**
   * Closes the side navigation drawer.
   */
  closeSidenav(): void {
    this.sidenavOpened.set(false);
  }

  /**
   * Updates the open state of the side navigation drawer.
   *
   * @param opened Whether the side navigation should be open.
   */
  setSidenavOpened(opened: boolean): void {
    this.sidenavOpened.set(opened);
  }
}
