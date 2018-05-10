import { Routes } from '@angular/router';

import { LogoutComponent } from './logout/logout.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { SigninupComponent } from './signinup/signinup.component';

export const authRoutes: Routes = [
  { path: '', component: SigninupComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent }
];
