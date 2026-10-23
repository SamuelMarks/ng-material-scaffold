import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';

import { IUser, UserUpsert } from '../../api/user/user.interfaces';
import { UserService } from '../../api/user/user.service';
import {
  UserCrudDialogComponent,
  UserDialogResult,
} from '../user-crud-dialog/user-crud.dialog.component';

/**
 * Admin UI for managing users.
 */
@Component({
  selector: 'app-users-admin',
  templateUrl: './users-admin.component.html',
  styleUrl: './users-admin.component.css',
  imports: [
    DatePipe,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatToolbarModule,
  ],
})
export class UsersAdminComponent {
  private readonly dialog = inject(MatDialog);
  private readonly userService = inject(UserService);
  private readonly destroyRef = inject(DestroyRef);

  /** Columns displayed in the users table. */
  readonly displayedColumns = ['username', 'roles', 'createdAt'];
  /** Current lowercase search filter string. */
  readonly filterValue = signal('');
  /** All loaded users. */
  readonly users = signal<IUser[]>([]);

  /** Filtered users computed purely from `users` and `filterValue`. */
  readonly filteredUsers = computed(() => {
    const query = this.filterValue();
    const list = this.users();
    if (!query) {
      return list;
    }
    return list.filter(
      (user) =>
        user.username.toLowerCase().includes(query) ||
        user.roles.some((role) => role.toLowerCase().includes(query)),
    );
  });

  /**
   * Loads the initial list of users from the API.
   */
  constructor() {
    this.userService
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((users) => this.users.set(users));
  }

  /**
   * Updates `filterValue` when the filter input changes.
   *
   * @param event DOM input event from the filter text field.
   */
  applyFilter(event: Event): void {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      this.filterValue.set(target.value.trim().toLowerCase());
    }
  }

  /**
   * Opens the user CRUD dialog for creating or editing a user.
   *
   * @param row Optional existing user row to edit or delete.
   */
  openUserCrud(row?: IUser): void {
    const dialogRef = this.dialog.open(UserCrudDialogComponent, { data: row ?? null });

    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result?: UserDialogResult) => {
        if (!result) {
          return;
        }

        switch (result.action) {
          case 'delete':
            this.handleDelete(result.user.username);
            break;
          case 'update':
            this.handleUpdate(result.user, row?.username);
            break;
          case 'create':
            this.handleCreate(result.user);
            break;
        }
      });
  }

  /**
   * Handles selection of a user row to open the edit dialog.
   *
   * @param row Selected user record.
   */
  selected(row: IUser): void {
    this.openUserCrud(row);
  }

  private handleCreate(payload: UserUpsert): void {
    this.userService
      .create(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((created) => {
        this.users.update((users) => UsersAdminComponent.sortUsers([...users, created]));
      });
  }

  private handleUpdate(payload: UserUpsert, existingUsername?: string): void {
    this.userService
      .update(payload, existingUsername)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((updated) => {
        this.users.update((users) =>
          UsersAdminComponent.sortUsers(
            users.map((user) =>
              user.username === (existingUsername ?? updated.username) ? updated : user,
            ),
          ),
        );
      });
  }

  private handleDelete(username: string): void {
    this.userService
      .destroy(username)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.users.update((users) => users.filter((user) => user.username !== username));
      });
  }

  private static sortUsers(users: IUser[]): IUser[] {
    return [...users].sort((a, b) => a.username.localeCompare(b.username));
  }
}
