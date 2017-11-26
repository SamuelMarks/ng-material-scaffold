import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MaterialImportModule } from '../material-import/material-import.module';
import { AdminComponent } from './admin.component';
import { adminRoutes } from './admin.routes';
import { UserService } from '../../api/user/user.service';
import { AlertsService } from '../alerts/alerts.service';

@NgModule({
  imports: [
    CommonModule, CdkTableModule, MatTableModule, FormsModule,
    RouterModule, RouterModule.forChild(adminRoutes),
    MaterialImportModule
  ],
  declarations: [AdminComponent],
  providers: [AlertsService, UserService]
})
export class AdminModule {}
