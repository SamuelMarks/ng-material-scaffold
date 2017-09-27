import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FooterComponent } from './footer.component';
import { MaterialImportModule } from '../material-import/material-import.module';
import { ServerStatusModule } from '../server-status/server-status.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialImportModule,
    ServerStatusModule
  ],
  declarations: [FooterComponent],
  exports: [FooterComponent]
})
export class FooterModule {}
