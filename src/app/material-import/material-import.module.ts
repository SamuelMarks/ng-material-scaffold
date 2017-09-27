import { NgModule } from '@angular/core';
import {
  MdAutocompleteModule,
  MdButtonModule,
  MdCardModule,
  MdCheckboxModule,
  MdCommonModule,
  MdDialogModule,
  MdFormFieldModule,
  MdGridListModule,
  MdIconModule,
  MdInputModule,
  MdMenuModule,
  MdProgressBarModule,
  MdSidenavModule,
  MdSnackBarModule,
  MdToolbarModule
} from '@angular/material';

@NgModule({
  imports: [
    MdCommonModule,
    MdAutocompleteModule, MdButtonModule, MdCardModule, MdCheckboxModule,
    MdCommonModule, MdDialogModule, MdFormFieldModule, MdGridListModule,
    MdIconModule, MdInputModule, MdMenuModule, MdProgressBarModule,
    MdSidenavModule, MdSnackBarModule, MdToolbarModule
  ],
  exports: [
    MdCommonModule,
    MdAutocompleteModule, MdButtonModule, MdCardModule, MdCheckboxModule,
    MdCommonModule, MdDialogModule, MdFormFieldModule, MdGridListModule,
    MdIconModule, MdInputModule, MdMenuModule, MdProgressBarModule,
    MdSidenavModule, MdSnackBarModule, MdToolbarModule
  ]
})
export class MaterialImportModule {
}
