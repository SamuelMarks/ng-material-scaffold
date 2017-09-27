import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NavbarComponent } from './navbar.component';
import { MaterialImportModule } from '../material-import/material-import.module';

@NgModule({
  imports: [
    CommonModule, RouterModule,
    MaterialImportModule
  ],
  exports: [NavbarComponent],
  declarations: [NavbarComponent]
})
export class NavbarModule {}
