import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs';

import { AuthService } from '../../api/auth/auth.service';
import { IAuthReq, ILoginResp } from '../../api/auth/auth.interfaces';
import { AlertsService } from '../../alerts/alerts.service';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    standalone: false
})
export class LoginComponent implements OnInit {
  auth = new UntypedFormControl();
  form: UntypedFormGroup | undefined;

  constructor(private router: Router,
              private fb: UntypedFormBuilder,
              public authService: AuthService,
              private alertsService: AlertsService) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.form != null)
      (this.authService
        .login(this.form.value as IAuthReq) as Observable<ILoginResp>)
        .subscribe((user: ILoginResp) => {
            if (user.access_token == null) {
              this.alertsService.add('No access token; try logging in again');
              return;
            }

            this.authService.accessToken = user.access_token;
            localStorage.setItem('access-token', this.authService.accessToken);

            this.router
              .navigate(['/secret-dashboard'])
              .then(() => {
              });
          }
        );
  }
}
