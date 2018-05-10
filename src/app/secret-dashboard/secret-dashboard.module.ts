import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SecretDashboardComponent } from './secret-dashboard.component';
import { secretDashboardRoutes } from './secret-dashboard.routes';


@NgModule({
  imports: [
    CommonModule, RouterModule, RouterModule.forChild(secretDashboardRoutes)
  ],
  declarations: [SecretDashboardComponent]
})
export class SecretDashboardModule {}
