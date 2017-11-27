import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { IUser } from '../../api/user/user.interfaces';

@Component({
  selector: 'app-admin.user-crud',
  templateUrl: './admin.user-crud.component.html',
  styleUrls: ['./admin.user-crud.component.css']
})
export class UserCrudDialogComponent implements OnInit {
  static roles: string[] = ['registered', 'login', 'admin'];
  roles = UserCrudDialogComponent.roles;
  form: FormGroup;
  default_roles = UserCrudDialogComponent.roles.slice(0, 2);

  constructor(public dialogRef: MatDialogRef<UserCrudDialogComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: IUser) {}

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.minLength(3)),
      roles: new FormControl('', Validators.required)
    });
    if (this.data === null)
      this.form.patchValue({ roles: this.default_roles });
    else {
      this.form.patchValue(this.data);
      this.form.controls['password'].clearValidators();
      this.form.controls['password'].disable();
    }
  }

  onNoClick(destroy?: boolean): void {
    this.dialogRef.close(typeof destroy === 'undefined' ? this.form.value : destroy);
  }
}
