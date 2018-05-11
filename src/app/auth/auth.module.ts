import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material';

import { AuthService } from '../../api/auth/auth.service';
import { MaterialImportModule } from '../material-import/material-import.module';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { SigninupComponent } from './signinup/signinup.component';
import { LogoutComponent } from './logout/logout.component';
import { authRoutes } from './auth.routes';


@NgModule({
  imports: [
    CommonModule, RouterModule, RouterModule.forChild(authRoutes),
    FormsModule, ReactiveFormsModule, MatInputModule,
    MaterialImportModule
  ],
  providers: [AuthService],
  declarations: [
    SignupComponent, LoginComponent, SigninupComponent, LogoutComponent
  ]
})
export class AuthModule {
}
