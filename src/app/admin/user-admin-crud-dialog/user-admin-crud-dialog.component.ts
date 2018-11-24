import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { IUser } from '../../../api/user/user.interfaces';


@Component({
  selector: 'app-user-admin-crud-dialog',
  templateUrl: './user-admin-crud-dialog.component.html',
  styleUrls: ['./user-admin-crud-dialog.component.scss']
})
export class UserAdminCrudDialogComponent implements OnInit {
  static roles: string[] = ['registered', 'login', 'admin'];
  roles = UserAdminCrudDialogComponent.roles;
  form: FormGroup = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.minLength(3)),
    roles: new FormControl('', Validators.required)
  });
  default_roles = UserAdminCrudDialogComponent.roles.slice(0, 2);
  destroy = false;

  constructor(public dialogRef: MatDialogRef<UserAdminCrudDialogComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: IUser) {}

  ngOnInit() {
    if (this.data === null)
      this.form.patchValue({ roles: this.default_roles });
    else {
      this.form.patchValue(this.data);
      this.form.controls['password'].clearValidators();
      this.form.controls['password'].disable();
    }
  }

  closeDialog() {
    this.dialogRef.close(this.destroy ? this.destroy : this.form.value);
  }
}
