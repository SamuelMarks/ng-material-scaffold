import { Routes } from '@angular/router';
import { URLSearchParams } from '@angular/http';


export const appRoutes: Routes = [
  { path: '', loadChildren: './dashboard/dashboard.module#DashboardModule' },
  { path: 'auth', loadChildren: './auth/auth.module#AuthModule' },
  {
    path: 'admin', loadChildren: './admin/admin.module#AdminModule',
    // canActivate: [AuthGuard], data: { role: ['admin'] }
  },
  {
    path: 'secret-dashboard', loadChildren: './secret-dashboard/secret-dashboard.module#SecretDashboardModule',
    // canActivate: [AuthGuard]
  }
];

export const getRedirectUrl = (url: string): string | null => ((question: number): string | null => {
  if (question < 0) return;
  const m = new URLSearchParams(url.slice(question + 1)).paramsMap;
  return m.has('redirectUrl') ? decodeURIComponent(m.get('redirectUrl')[0]) : null;
})(url.indexOf('?'));

