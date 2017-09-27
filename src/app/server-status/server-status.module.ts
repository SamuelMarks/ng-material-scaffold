import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServerStatusComponent } from './server-status.component';
import { MaterialImportModule } from '../material-import/material-import.module';
import { ServerStatusService } from '../../api/server-status/server-status.service';

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
