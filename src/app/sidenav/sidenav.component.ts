import { AfterContentInit, Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';

import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '../api/auth/auth.service';

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.css'],
    standalone: false
})
export class SidenavComponent implements AfterContentInit {
  loggedIn: typeof AuthService.loggedIn;
  hasRole: typeof AuthService.hasRole;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  @Input() openedSubject: Subject<boolean> | undefined;
  @ViewChild('sidenav', { static: true }) sidenav: MatSidenav | undefined;

  constructor(private breakpointObserver: BreakpointObserver,
              private router: Router) {
    this.loggedIn = AuthService.loggedIn;
    this.hasRole = AuthService.hasRole;
  }

  ngAfterContentInit() {
    if (this.openedSubject != null && this.sidenav != null) {
      this.openedSubject.subscribe(
        open => this.sidenav![open ? 'open' : 'close']()
      );
      this.router.events.subscribe(() => this.openedSubject!.next(false));
    }
  }

  toggle() {
    if (this.openedSubject != null && this.sidenav != null)
      this.openedSubject.next(!this.sidenav.opened);
  }

  close() {
    if (this.openedSubject != null && this.sidenav != null && this.sidenav.opened)
      this.openedSubject.next(false);
  }
}
