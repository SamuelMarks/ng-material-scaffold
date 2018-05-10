import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { RouterModule } from '@angular/router';
import { OverlayModule } from '@angular/cdk/overlay';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { SidenavModule } from './sidenav/sidenav.module';
import { AlertsModule } from './alerts/alerts.module';
import { AuthGuard } from './auth/auth.guard';
import { AuthInterceptor } from './auth/auth.interceptors';
import { appRoutes } from './app.routes';
import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    LayoutModule,
    OverlayModule,
    AlertsModule.forRoot(),
    SidenavModule
  ],
  providers: [AuthGuard, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
