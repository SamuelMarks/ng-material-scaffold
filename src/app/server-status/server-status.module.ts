import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from '@angular/material';

import { ServerStatusService } from '../../api/server-status/server-status.service';
import { ServerStatusComponent } from './server-status.component';


@NgModule({
  declarations: [ServerStatusComponent],
  imports: [
    CommonModule,
    MatToolbarModule
  ],
  providers: [ServerStatusService],
  exports: [ServerStatusComponent]
})
export class ServerStatusModule {
  public static forRoot(): ModuleWithProviders {
    return { ngModule: ServerStatusModule, providers: [ServerStatusService] };
  }
}
