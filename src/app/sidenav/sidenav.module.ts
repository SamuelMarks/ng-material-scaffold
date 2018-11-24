import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatButtonModule, MatIconModule, MatListModule, MatSidenavModule, MatToolbarModule } from '@angular/material';

import { ServerStatusModule } from '../server-status/server-status.module';
import { SidenavComponent } from './sidenav.component';


@NgModule({
  declarations: [SidenavComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    RouterModule,
    ServerStatusModule.forRoot()
  ],
  exports: [SidenavComponent]
})
export class SidenavModule {}
