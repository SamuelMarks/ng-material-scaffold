import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecretDashboardComponent } from './secret-dashboard.component';
import { RouterModule } from '@angular/router';

import { secretDashboardRoutes } from './secret-dashboard.routes';


@NgModule({
  declarations: [SecretDashboardComponent],
  imports: [
    CommonModule, RouterModule, RouterModule.forChild(secretDashboardRoutes)
  ]
})
export class SecretDashboardModule {}
