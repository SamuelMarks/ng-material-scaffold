import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { Subject, of } from 'rxjs';

import { BreakpointObserver } from '@angular/cdk/layout';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { AlertsService } from '../alerts/alerts.service';
import { ServerStatusService } from '../api/server-status/server-status.service';
import { SidenavComponent } from './sidenav.component';

describe('SidenavComponent', () => {
  let fixture: ComponentFixture<SidenavComponent>;
  let component: SidenavComponent;
  let routerEvents$: Subject<unknown>;
  let authService: { isLoggedIn: ReturnType<typeof signal>; hasRole: (role: string) => boolean };
  let alertsService: jasmine.SpyObj<AlertsService>;

  beforeEach(async () => {
    routerEvents$ = new Subject();
    authService = {
      isLoggedIn: signal(true),
      hasRole: (role: string) => role === 'admin',
    };
    alertsService = jasmine.createSpyObj<AlertsService>('AlertsService', ['add']);

    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, SidenavComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: ActivatedRoute, useValue: { snapshot: {} } as ActivatedRoute },
        { provide: Router, useValue: { events: routerEvents$ } },
        { provide: BreakpointObserver, useValue: { observe: () => of({ matches: true }) } },
        { provide: AlertsService, useValue: alertsService },
        { provide: ServerStatusService, useValue: { get: () => of({ version: '1.0.0' }) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
  });

  it('toggles opened model state', () => {
    fixture.componentRef.setInput('opened', false);
    component.toggle();
    expect(component.opened()).toBeTrue();

    component.toggle();
    expect(component.opened()).toBeFalse();
  });

  it('sets opened to false when close is called while open', () => {
    fixture.componentRef.setInput('opened', true);
    component.close();
    expect(component.opened()).toBeFalse();
  });

  it('keeps opened false when close is called while already closed', () => {
    fixture.componentRef.setInput('opened', false);
    component.close();
    expect(component.opened()).toBeFalse();
  });

  it('closes on router events when open', () => {
    fixture.componentRef.setInput('opened', true);

    routerEvents$.next({});

    expect(component.opened()).toBeFalse();
  });

  it('ignores router events when closed', () => {
    fixture.componentRef.setInput('opened', false);

    routerEvents$.next({});

    expect(component.opened()).toBeFalse();
  });

  it('uses auth service for role checks', () => {
    expect(component.hasRole('admin')).toBeTrue();
    expect(component.hasRole('user')).toBeFalse();
  });

  it('tracks handset breakpoint', () => {
    expect(component.isHandset()).toBeTrue();
  });
});
