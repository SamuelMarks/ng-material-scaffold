"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
  var c = arguments.length,
    r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", {value: true});
var core_1 = require("@angular/core");
var material_1 = require("@angular/material");
var MaterialImportModule = (function () {
  function MaterialImportModule() {
  }

  return MaterialImportModule;
}());
MaterialImportModule = __decorate([
  core_1.NgModule({
    imports: [
      material_1.MdCommonModule,
      material_1.MdAutocompleteModule, material_1.MdButtonModule, material_1.MdCardModule, material_1.MdCheckboxModule,
      material_1.MdCommonModule, material_1.MdDialogModule, material_1.MdFormFieldModule, material_1.MdGridListModule,
      material_1.MdIconModule, material_1.MdInputModule, material_1.MdMenuModule, material_1.MdProgressBarModule,
      material_1.MdSidenavModule, material_1.MdSnackBarModule, material_1.MdToolbarModule
    ],
    exports: [
      material_1.MdCommonModule,
      material_1.MdAutocompleteModule, material_1.MdButtonModule, material_1.MdCardModule, material_1.MdCheckboxModule,
      material_1.MdCommonModule, material_1.MdDialogModule, material_1.MdFormFieldModule, material_1.MdGridListModule,
      material_1.MdIconModule, material_1.MdInputModule, material_1.MdMenuModule, material_1.MdProgressBarModule,
      material_1.MdSidenavModule, material_1.MdSnackBarModule, material_1.MdToolbarModule
    ]
  })
], MaterialImportModule);
exports.MaterialImportModule = MaterialImportModule;
