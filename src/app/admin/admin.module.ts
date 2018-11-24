import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  MatButtonModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatTableModule,
  MatToolbarModule
} from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';

import { UserService } from '../../api/user/user.service';
import { AlertsService } from '../alerts/alerts.service';
import { UserAdminCrudDialogComponent } from './user-admin-crud-dialog/user-admin-crud-dialog.component';
import { UserAdminComponent } from './user-admin/user-admin.component';
import { AdminComponent } from './admin.component';
import { adminRoutes } from './admin.routes';

@NgModule({
  imports: [
    CommonModule, CdkTableModule, MatTableModule, FormsModule,
    ReactiveFormsModule, RouterModule, RouterModule.forChild(adminRoutes),
    MatButtonModule, MatDialogModule, MatFormFieldModule, MatIconModule,
    MatInputModule, MatSelectModule, MatTableModule, MatToolbarModule
  ],
  declarations: [UserAdminCrudDialogComponent, UserAdminComponent, AdminComponent],
  providers: [AlertsService, UserService],
  entryComponents: [UserAdminCrudDialogComponent]
})
export class AdminModule {}
