import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../api/auth/auth.service';
import { IAuthReq, ILoginResp } from '../../api/auth/auth.interfaces';
import { AlertsService } from '../alerts/alerts.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, AfterViewInit {
  auth = new FormControl();
  form: FormGroup;

  constructor(private router: Router,
              private fb: FormBuilder,
              private authService: AuthService,
              private alertsService: AlertsService) {}

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngAfterViewInit() {
    if (AuthService.loggedIn())
      this.router
        .navigate(['/dashboard'])
        .then(() => {});
  }

  signInUp() {
    this.authService
      .signinup(this.form.value as IAuthReq)
      .subscribe((_user: IAuthReq | ILoginResp) => {
          if (_user.hasOwnProperty('access_token')) {
            this.authService._login(_user as ILoginResp);
            this.router
              .navigate(['/dashboard'])
              .then(() => {});
          } else this.alertsService.add(`Unexpected: ${JSON.stringify(_user)};`);
        }
      );
  }
}
