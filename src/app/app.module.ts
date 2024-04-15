import { ApplicationConfig, Component, ModuleWithProviders, NgModule, Provider, Type } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { LayoutModule } from '@angular/cdk/layout';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';

import { SidenavModule } from './sidenav/sidenav.module';
import { AlertsModule } from './alerts/alerts.module';
import { AuthGuard } from './auth/auth.guard';
import { AuthInterceptor } from './auth/auth.interceptors';
import { AppRoutingModule } from './app.routes.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";

const alert_module = AlertsModule.forRoot();

export const AppImports: /*NgModule*/Component["imports"] = [
  BrowserModule,
  // AppRoutingModule,
  BrowserAnimationsModule,
  HttpClientModule,
  LayoutModule,
  BrowserAnimationsModule,
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatGridListModule,
  MatCardModule,
  MatMenuModule,
  alert_module as any,
  SidenavModule
];

export const AppProviders: ApplicationConfig["providers"] /*NgModule["providers"]*/ = [
  AuthGuard,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  },
  // provideClientHydration(),
  // provideAnimationsAsync()
];

/*
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: AppImports,
  providers: AppProviders,
  bootstrap: [AppComponent]
})
export class AppModule {
}
*/
