import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../api/auth/auth.service';


@Component({
    selector: 'app-logout',
    template: '',
    standalone: false
})
export class LogoutComponent implements OnInit {
  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.logout();
  }
}
