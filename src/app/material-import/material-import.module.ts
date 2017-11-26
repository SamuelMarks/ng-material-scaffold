import { NgModule } from '@angular/core';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatCommonModule,
  MatDialogModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatProgressBarModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatToolbarModule
} from '@angular/material';

@NgModule({
  imports: [
    MatCommonModule,
    MatAutocompleteModule, MatButtonModule, MatCardModule, MatCheckboxModule,
    MatCommonModule, MatDialogModule, MatFormFieldModule, MatGridListModule,
    MatIconModule, MatInputModule, MatMenuModule, MatProgressBarModule,
    MatSidenavModule, MatSnackBarModule, MatToolbarModule
  ],
  exports: [
    MatCommonModule,
    MatAutocompleteModule, MatButtonModule, MatCardModule, MatCheckboxModule,
    MatCommonModule, MatDialogModule, MatFormFieldModule, MatGridListModule,
    MatIconModule, MatInputModule, MatMenuModule, MatProgressBarModule,
    MatSidenavModule, MatSnackBarModule, MatToolbarModule
  ]
})
export class MaterialImportModule {
}
