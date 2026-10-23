import { Component } from '@angular/core';

import { UsersAdminComponent } from './users-admin/users-admin.component';

/**
 * Admin area shell.
 */
@Component({
  selector: 'app-admin',
  template: '<app-users-admin />',
  imports: [UsersAdminComponent],
})
export class AdminComponent {}
