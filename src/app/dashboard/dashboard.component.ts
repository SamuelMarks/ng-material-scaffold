import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { map } from 'rxjs/operators';

interface DashboardCard {
  title: string;
  cols: number;
  rows: number;
}

const handsetCards: DashboardCard[] = [
  { title: 'Card 1', cols: 1, rows: 1 },
  { title: 'Card 2', cols: 1, rows: 1 },
  { title: 'Card 3', cols: 1, rows: 1 },
  { title: 'Card 4', cols: 1, rows: 1 },
];

const desktopCards: DashboardCard[] = [
  { title: 'Card 1', cols: 2, rows: 1 },
  { title: 'Card 2', cols: 1, rows: 1 },
  { title: 'Card 3', cols: 1, rows: 2 },
  { title: 'Card 4', cols: 1, rows: 1 },
];

/**
 * Dashboard landing page with responsive cards.
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  imports: [MatButtonModule, MatCardModule, MatGridListModule, MatIconModule, MatMenuModule],
})
export class DashboardComponent {
  private readonly breakpointObserver = inject(BreakpointObserver);

  private readonly isHandset = toSignal(
    this.breakpointObserver.observe(Breakpoints.Handset).pipe(map(({ matches }) => matches)),
    { initialValue: false },
  );

  /** Derived card layout based on screen size. */
  readonly cards = computed(() => (this.isHandset() ? handsetCards : desktopCards));
}
