import { Routes } from '@angular/router';
import { hasRole } from './auth/auth.guard';


export const appRoutes: Routes = [
  { path: '', loadChildren: './dashboard/dashboard.module#DashboardModule' },
  { path: 'admin', loadChildren: './admin/admin.module#AdminModule' },
  { path: 'auth', loadChildren: './auth/auth.module#AuthModule' },
  {
    path: 'secret-dashboard', loadChildren: './secret-dashboard/secret-dashboard.module#SecretDashboardModule',
    canActivate: [hasRole('admin')]
  }
];
