import { Routes } from '@angular/router';


export const appRoutes: Routes = [
  { path: '', loadChildren: './dashboard/dashboard.module#DashboardModule' },
  { path: 'admin', loadChildren: './admin/admin.module#AdminModule' },
  {
    path: 'auth', loadChildren: './auth/auth.module#AuthModule',
    // TODO:
    // canActivate: [AuthGuard], data: { role: ['admin'] }
  },
  {
    path: 'secret-dashboard', loadChildren: './secret-dashboard/secret-dashboard.module#SecretDashboardModule',
    // TODO:
    // canActivate: [AuthGuard]
  }
];
