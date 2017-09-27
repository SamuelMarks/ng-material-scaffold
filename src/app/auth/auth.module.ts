import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthComponent } from './auth.component';
import { authRoutes } from './auth.routes';
import { MaterialImportModule } from '../material-import/material-import.module';
import { AuthService } from '../../api/auth/auth.service';

@NgModule({
  imports: [
    CommonModule, RouterModule, RouterModule.forChild(authRoutes),
    FormsModule, ReactiveFormsModule,

    MaterialImportModule
  ],
  declarations: [AuthComponent],
  providers: [AuthService]
})
export class AuthModule {}
