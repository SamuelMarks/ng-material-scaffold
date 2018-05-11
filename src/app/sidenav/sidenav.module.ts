import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatIconModule, MatListModule, MatSidenavModule, MatToolbarModule } from '@angular/material';

import { ServerStatusModule } from '../server-status/server-status.module';
import { SidenavComponent } from './sidenav.component';


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
