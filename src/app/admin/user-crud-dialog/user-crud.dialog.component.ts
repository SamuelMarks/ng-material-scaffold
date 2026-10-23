import { Component, computed, inject, signal } from '@angular/core';
import { FormField, disabled, form, minLength, required } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { IUser, UserUpsert } from '../../api/user/user.interfaces';

const ROLE_OPTIONS = ['registered', 'login', 'admin'] as const;

/**
 * Dialog result for user CRUD operations.
 */
export type UserDialogResult =
  | { action: 'create'; user: Pick<IUser, 'username' | 'password' | 'roles'> }
  | { action: 'update'; user: Pick<IUser, 'username' | 'password' | 'roles'> }
  | { action: 'delete'; user: Pick<IUser, 'username'> };

/**
 * Dialog for creating, updating, and deleting users using Signal Forms.
 */
@Component({
  selector: 'app-admin.user-crud',
  templateUrl: './user-crud.dialog.component.html',
  styleUrl: './user-crud.dialog.component.css',
  imports: [
    FormField,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
  ],
})
export class UserCrudDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<UserCrudDialogComponent>);
  private readonly data = inject<IUser | null>(MAT_DIALOG_DATA, { optional: true }) ?? null;

  /** Available role values. */
  readonly roles = [...ROLE_OPTIONS];
  /** Default roles for new users. */
  readonly defaultRoles = ROLE_OPTIONS.slice(0, 2);

  /** Whether the dialog is editing an existing user. */
  readonly isEditing = computed(() => !!this.data?.username);

  /** Backing signal model for the user form. */
  readonly userModel = signal<UserUpsert>({
    username: this.data?.username ?? '',
    password: '',
    roles: this.data?.roles ? [...this.data.roles] : [...this.defaultRoles],
  });

  /** Signal form tree for user creation and editing. */
  readonly userForm = form(this.userModel, (schemaPath) => {
    required(schemaPath.username, { message: 'Username is required.' });
    disabled(schemaPath.password, { when: () => this.isEditing() });
    required(schemaPath.password, {
      message: 'Password is required.',
      when: () => !this.isEditing(),
    });
    minLength(schemaPath.password, 3, {
      message: 'Password must be at least 3 characters.',
      when: () => !this.isEditing(),
    });
    minLength(schemaPath.roles, 1, { message: 'At least one role is required.' });
  });

  /**
   * Closes the dialog and emits the create or update payload.
   */
  closeDialog(): void {
    const value = this.userModel();
    const payload = { username: value.username, password: value.password, roles: value.roles };
    if (this.isEditing()) {
      this.dialogRef.close({ action: 'update', user: payload });
      return;
    }
    this.dialogRef.close({ action: 'create', user: payload });
  }

  /**
   * Closes the dialog and emits a delete action for the current user.
   */
  deleteUser(): void {
    if (!this.data) {
      return;
    }
    this.dialogRef.close({ action: 'delete', user: { username: this.data.username } });
  }
}
