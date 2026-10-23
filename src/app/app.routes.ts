import { Routes } from '@angular/router';

import { authGuard } from './auth/auth.guard';

/**
 * Root application routes with lazy-loaded feature areas.
 */
export const appRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('./dashboard/dashboard.routes').then((m) => m.dashboardRoutes),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    data: { role: ['admin'] },
    loadChildren: () => import('./admin/admin.routes').then((m) => m.adminRoutes),
  },
  {
    path: 'secret-dashboard',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./secret-dashboard/secret-dashboard.routes').then((m) => m.secretDashboardRoutes),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
