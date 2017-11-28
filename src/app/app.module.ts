import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { NavbarModule } from './navbar/navbar.module';
import { MaterialImportModule } from './material-import/material-import.module';
import { appRoutes } from './app.routes';
import { FooterModule } from './footer/footer.module';
import { AlertsService } from './alerts/alerts.service';
import { AuthService } from '../api/auth/auth.service';
import { AdminModule } from './admin/admin.module';
import { AuthInterceptor } from './auth/auth.interceptors';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth.guard';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, BrowserAnimationsModule, HttpClientModule,
    RouterModule, RouterModule.forRoot(appRoutes),

    MaterialImportModule,
    NavbarModule,
    FooterModule,
    AuthModule,
    AdminModule
  ],
  providers: [AuthService, AuthGuard, AlertsService, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  }],
  bootstrap: [AppComponent]
})
export class AppModule {}
