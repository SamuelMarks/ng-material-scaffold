import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormField, form, minLength, required } from '@angular/forms/signals';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AuthCredentials } from '../auth.interfaces';
import { AuthService } from '../auth.service';

/**
 * Combined registration and login form using Angular Signal Forms.
 */
@Component({
  selector: 'app-auth-register-or-login',
  imports: [FormField, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './auth-register-or-login.html',
  styleUrl: './auth-register-or-login.scss',
})
export class AuthRegisterOrLogin {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  /** Error message displayed when form submission fails. */
  readonly submissionError = signal<string | null>(null);

  /** Backing signal model for login/registration credentials. */
  readonly credentialsModel = signal<AuthCredentials>({
    username: '',
    password: '',
  });

  /** Signal form tree with schema validation for username and password. */
  readonly loginForm = form(this.credentialsModel, (schemaPath) => {
    required(schemaPath.username, { message: 'Username is required.' });
    required(schemaPath.password, { message: 'Password is required.' });
    minLength(schemaPath.password, 3, { message: 'Password must be at least 3 characters.' });
  });

  /**
   * Validates and submits the authentication form.
   */
  onSubmit(): void {
    if (this.loginForm().invalid()) {
      this.loginForm().markAsTouched();
      this.submissionError.set('Form is invalid.');
      return;
    }

    const credentials = this.credentialsModel();
    this.submissionError.set(null);

    this.authService
      .signinup(credentials)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          void this.router.navigateByUrl('/');
        },
        error: () => {
          this.submissionError.set('Unable to sign in.');
        },
      });
  }
}
