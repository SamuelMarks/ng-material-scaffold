import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

import { IUser } from '../../api/user/user.interfaces';
import { UserService } from '../../api/user/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  usersDataSource: MatTableDataSource<IUser>;
  displayedColumns = ['email', 'roles', 'createdAt'];

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService
      .users()
      .subscribe(
        users => this.usersDataSource = new MatTableDataSource(users)
      );
  }

  applyFilter(filterValue: string) {
    this.usersDataSource.filter = filterValue.trim().toLowerCase();
  }
}
