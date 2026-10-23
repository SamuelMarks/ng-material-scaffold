import { Routes } from '@angular/router';

import { AuthRegisterOrLogin } from './auth-register-or-login/auth-register-or-login';
import { LogoutComponent } from './logout/logout.component';

/**
 * Authentication-related routes.
 */
export const authRoutes: Routes = [
  { path: '', component: AuthRegisterOrLogin },
  { path: 'login', component: AuthRegisterOrLogin },
  { path: 'signup', component: AuthRegisterOrLogin },
  { path: 'logout', component: LogoutComponent },
];
