import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CdkTableModule } from '@angular/cdk/table';

import { UserService } from '../api/user/user.service';
import { AlertsService } from '../alerts/alerts.service';
import { UserCrudDialogComponent } from './user-crud-dialog/user-crud.dialog.component';
import { UsersAdminComponent } from './users-admin/users-admin.component';
import { AdminComponent } from './admin.component';
import { adminRoutes } from './admin.routes';

@NgModule({
  imports: [
    CommonModule, CdkTableModule, MatTableModule, FormsModule,
    ReactiveFormsModule, RouterModule, RouterModule.forChild(adminRoutes),
    MatButtonModule, MatDialogModule, MatFormFieldModule, MatIconModule,
    MatInputModule, MatSelectModule, MatTableModule, MatToolbarModule
  ],
  declarations: [UserCrudDialogComponent, UsersAdminComponent, AdminComponent],
  providers: [AlertsService, UserService],
  entryComponents: [UserCrudDialogComponent]
})
export class AdminModule {}
