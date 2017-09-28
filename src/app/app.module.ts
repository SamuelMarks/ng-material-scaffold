import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { NavbarModule } from './navbar/navbar.module';
import { MaterialImportModule } from './material-import/material-import.module';
import { appRoutes } from './app.routes';
import { AuthGuard } from './auth/auth.guard';
import { FooterModule } from './footer/footer.module';
import { AlertsService } from './alerts/alerts.service';
import { AuthService } from '../api/auth/auth.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule, HttpClientModule,
    RouterModule, RouterModule.forRoot(appRoutes),

    MaterialImportModule,
    NavbarModule,
    FooterModule
  ],
  providers: [AlertsService, AuthService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {}
