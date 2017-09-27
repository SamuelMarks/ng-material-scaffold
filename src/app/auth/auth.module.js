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
var common_1 = require("@angular/common");
var router_1 = require("@angular/router");
var forms_1 = require("@angular/forms");
var auth_component_1 = require("./auth.component");
var auth_routes_1 = require("./auth.routes");
var material_import_module_1 = require("../material-import/material-import.module");
var auth_service_1 = require("../../api/auth/auth.service");
var AuthModule = (function () {
  function AuthModule() {
  }

  return AuthModule;
}());
AuthModule = __decorate([
  core_1.NgModule({
    imports: [
      common_1.CommonModule, router_1.RouterModule, router_1.RouterModule.forChild(auth_routes_1.authRoutes),
      forms_1.FormsModule, forms_1.ReactiveFormsModule,
      material_import_module_1.MaterialImportModule
    ],
    declarations: [auth_component_1.AuthComponent],
    providers: [auth_service_1.AuthService]
  })
], AuthModule);
exports.AuthModule = AuthModule;
