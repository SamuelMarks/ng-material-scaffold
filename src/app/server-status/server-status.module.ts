import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServerStatusService } from '../../api/server-status/server-status.service';
import { MaterialImportModule } from '../material-import/material-import.module';
import { ServerStatusComponent } from './server-status.component';


@NgModule({
  imports: [
    CommonModule,
    MaterialImportModule
  ],
  declarations: [ServerStatusComponent],
  providers: [ServerStatusService],
  exports: [ServerStatusComponent]
})
export class ServerStatusModule {}
