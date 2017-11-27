import { Component, OnInit } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';

import { IUser } from '../../api/user/user.interfaces';
import { UserService } from '../../api/user/user.service';
import { UserCrudDialogComponent } from './admin.user-crud.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  usersDataSource: MatTableDataSource<IUser>;
  displayedColumns = ['email', 'roles', 'createdAt'];

  constructor(public dialog: MatDialog,
              private userService: UserService) { }

  ngOnInit() {
    this.userService
      .getAll()
      .subscribe(users => this.usersDataSource = new MatTableDataSource(users));
  }

  applyFilter(filterValue: string) {
    this.usersDataSource.filter = filterValue.trim().toLowerCase();
  }

  openUserCrud(row?: IUser) {
    this
      .dialog
      .open(UserCrudDialogComponent, { data: row })
      .afterClosed()
      .subscribe(data => {
        switch (typeof data) {
          case 'boolean':
          case 'number':
            if (row) this.userService
              .destroy(row)
              .subscribe(() => delete this.usersDataSource.data[this.usersDataSource.data.indexOf(row)]);
            break;
          case 'object':
            (row ?
                this.userService
                  .update(data)
                  .subscribe(user => this.usersDataSource.data[this.usersDataSource.data.indexOf(row)] = user)
                : this.userService
                  .create(data)
                  .subscribe(user => this.usersDataSource.data.push(user))
            );
        }
      });
  }

  selected(row: IUser) {
    this.openUserCrud(row);
  }
}
