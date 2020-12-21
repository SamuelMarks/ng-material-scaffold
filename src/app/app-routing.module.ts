import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard],
    data: { role: ['admin'] }
  },
  {
    path: 'secret-dashboard',
    loadChildren: () => import('./secret-dashboard/secret-dashboard.module').then(m => m.SecretDashboardModule),
    canActivate: [AuthGuard]
  }
];

export const getRedirectUrl = (url: string): string | null => new URLSearchParams(url.slice(1)).get('redirectUrl');

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
