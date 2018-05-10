import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatListModule, MatSidenavModule, MatToolbarModule } from '@angular/material';

import { SidenavComponent } from './sidenav.component';
import { ServerStatusModule } from '../server-status/server-status.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    RouterModule,
    ServerStatusModule
  ],
  declarations: [SidenavComponent],
  exports: [SidenavComponent]
})
export class SidenavModule { }
