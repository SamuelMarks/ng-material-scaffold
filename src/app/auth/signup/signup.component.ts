import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';

import { IAuthReq } from '../../api/auth/auth.interfaces';
import { AuthService } from '../../api/auth/auth.service';
import { AlertsService } from '../../alerts/alerts.service';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css'],
    standalone: false
})
export class SignupComponent implements OnInit {
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

  signup() {
    if (this.form != null)
      this.authService
        .register(this.form.value as IAuthReq)
        .subscribe((res: HttpResponse<IAuthReq>) => {
            if (!res.headers.has('x-access-token')) {
              this.alertsService.add('No access token in response');
              return;
            }

            const at: string | null = res.headers.get('x-access-token');
            if (at != null) {
              this.authService.accessToken = at;
              localStorage.setItem('access-token', at);
            }

            this.router
              .navigate(['/secret-dashboard'])
              .then(() => {
              });
          }
        );
  }
}
