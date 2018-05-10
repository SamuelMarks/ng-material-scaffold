import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { AuthService } from '../../api/auth/auth.service';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements AfterViewInit {
  @ViewChild('drawer') drawer: MatSidenav;

  isHandset: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.Handset);
  loggedIn: typeof AuthService.loggedIn;
  hasRole: typeof AuthService.hasRole;

  constructor(private breakpointObserver: BreakpointObserver,
              private router: Router) {
    this.loggedIn = AuthService.loggedIn;
    this.hasRole = AuthService.hasRole;
  }

  ngAfterViewInit() {
    this.router.events.subscribe(events =>
      this.drawer.opened && this.drawer.toggle()
    );
  }
}
