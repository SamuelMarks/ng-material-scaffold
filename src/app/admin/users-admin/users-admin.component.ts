import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { IUser } from "../../api/user/user.interfaces";
import { UserService } from "../../api/user/user.service";
import { UserCrudDialogComponent } from '../user-crud-dialog/user-crud.dialog.component';

@Component({
    selector: 'app-users-admin',
    templateUrl: './users-admin.component.html',
    styleUrls: ['./users-admin.component.css'],
    standalone: false
})
export class UsersAdminComponent implements OnInit {
  usersDataSource: MatTableDataSource<IUser> | undefined;
  displayedColumns = ['email', 'roles', 'createdAt'];

  constructor(public dialog: MatDialog,
              private userService: UserService) {
  }

  ngOnInit() {
    this.userService
      .getAll()
      .subscribe((users: IUser[]) => this.usersDataSource = new MatTableDataSource(users.sort()));
  }

  applyFilter(filterTarget: EventTarget | null) {
    const filterValue: string | null = filterTarget != null && filterTarget.hasOwnProperty("value") ?
      (filterTarget as EventTarget & { value: string })["value"]
      : null;
    if (this.usersDataSource != null && filterValue != null)
      this.usersDataSource.filter = filterValue.trim().toLowerCase();
  }

  openUserCrud(row?: IUser) {
    if (this.usersDataSource != null) {
      this
        .dialog
        .open(UserCrudDialogComponent, { data: row })
        .afterClosed()
        .subscribe((data: IUser | boolean) => {
          switch (typeof data) {
            case 'boolean':
            case 'string':
            case 'number':
              if (row) this.userService
                .destroy(row.username)
                .subscribe(() => {
                  this.usersDataSource!.data.splice(this.usersDataSource!.data.indexOf(row), 1);
                  this.usersDataSource!._updateChangeSubscription();
                });
              break;
            case 'object':
              (row ?
                  this.userService
                    .update(data as IUser)
                    .subscribe((user: IUser) => {
                      /* TODO: Figure out how to update in-place, like:
                       `this.usersDataSource.data[this.usersDataSource.data.indexOf(row)] = user;` */
                      this.usersDataSource!.data.splice(this.usersDataSource!.data.indexOf(row), 1);
                      this.usersDataSource!.data.push(Object.assign(row, data as IUser));
                      this.usersDataSource!.data.sort((a, b) => a.username.localeCompare(b.username));
                      this.usersDataSource!._updateChangeSubscription();
                    })
                  : this.userService
                    .create(data as IUser)
                    .subscribe(user => {
                      this.usersDataSource!.data.push(user);
                      this.usersDataSource!.data.sort((a, b) => a.username.localeCompare(b.username));
                      this.usersDataSource!._updateChangeSubscription();
                    })
              );
          }
        });
    }
  }

  selected(row: IUser) {
    this.openUserCrud(row);
  }
}
