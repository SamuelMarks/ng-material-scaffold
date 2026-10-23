import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { UserService } from '../../api/user/user.service';
import { IUser, UserUpsert } from '../../api/user/user.interfaces';
import { UsersAdminComponent } from './users-admin.component';
import { UserDialogResult } from '../user-crud-dialog/user-crud.dialog.component';

describe('UsersAdminComponent', () => {
  let fixture: ComponentFixture<UsersAdminComponent>;
  let component: UsersAdminComponent;
  let dialog: { nextResult?: UserDialogResult; open: jasmine.Spy };
  let userService: {
    getAll: jasmine.Spy;
    create: jasmine.Spy;
    update: jasmine.Spy;
    destroy: jasmine.Spy;
  };

  const makeUser = (username: string, roles: string[]): IUser => ({
    username,
    password: 'pw',
    roles,
    createdAt: new Date('2020-01-01T00:00:00Z'),
    updatedAt: new Date('2020-01-02T00:00:00Z'),
  });

  beforeEach(async () => {
    dialog = {
      open: jasmine.createSpy('open').and.callFake(() => ({
        afterClosed: () => of(dialog.nextResult),
      })),
    };

    userService = {
      getAll: jasmine.createSpy('getAll').and.returnValue(of([makeUser('ana', ['login'])])),
      create: jasmine
        .createSpy('create')
        .and.callFake((payload: UserUpsert) => of(makeUser(payload.username, payload.roles))),
      update: jasmine
        .createSpy('update')
        .and.callFake((payload: UserUpsert) => of(makeUser(payload.username, payload.roles))),
      destroy: jasmine.createSpy('destroy').and.returnValue(of(void 0)),
    };

    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, UsersAdminComponent],
      providers: [{ provide: UserService, useValue: userService }],
    });
    TestBed.overrideProvider(MatDialog, { useValue: dialog });
    await TestBed.compileComponents();

    fixture = TestBed.createComponent(UsersAdminComponent);
    component = fixture.componentInstance;
  });

  it('loads users on init', () => {
    expect(component.users().length).toBe(1);
    expect(userService.getAll).toHaveBeenCalled();
  });

  it('applies the filter value', () => {
    const input = document.createElement('input');
    input.value = ' ANA ';
    const event = { target: input } as unknown as Event;

    component.applyFilter(event);

    expect(component.filterValue()).toBe('ana');
  });

  it('filters users by username or role using computed signal', () => {
    component.users.set([makeUser('ana', ['login']), makeUser('zoe', ['admin'])]);
    expect(component.filteredUsers().length).toBe(2);

    component.filterValue.set('zoe');
    expect(component.filteredUsers().map((u) => u.username)).toEqual(['zoe']);

    component.filterValue.set('admin');
    expect(component.filteredUsers().map((u) => u.username)).toEqual(['zoe']);
  });

  it('ignores filter events without input targets', () => {
    component.filterValue.set('initial');

    const event = { target: {} } as unknown as Event;
    component.applyFilter(event);

    expect(component.filterValue()).toBe('initial');
  });

  it('creates a user from dialog result', () => {
    dialog.nextResult = {
      action: 'create',
      user: { username: 'zoe', password: 'pw', roles: ['admin'] },
    };

    component.openUserCrud();

    expect(userService.create).toHaveBeenCalledWith({
      username: 'zoe',
      password: 'pw',
      roles: ['admin'],
    });
    expect(component.users().some((user) => user.username === 'zoe')).toBeTrue();
  });

  it('ignores empty dialog results', () => {
    dialog.nextResult = undefined;

    component.openUserCrud();

    expect(userService.create).not.toHaveBeenCalled();
    expect(userService.update).not.toHaveBeenCalled();
    expect(userService.destroy).not.toHaveBeenCalled();
  });

  it('updates a user from dialog result', () => {
    const existing = makeUser('ana', ['login']);
    component.users.set([existing]);
    dialog.nextResult = {
      action: 'update',
      user: { username: 'ana', password: 'pw', roles: ['admin'] },
    };

    component.openUserCrud(existing);

    expect(userService.update).toHaveBeenCalledWith(
      { username: 'ana', password: 'pw', roles: ['admin'] },
      'ana',
    );
    expect(component.users()[0].roles).toEqual(['admin']);
  });

  it('updates a user when no existing username is supplied', () => {
    dialog.nextResult = {
      action: 'update',
      user: { username: 'zoe', password: 'pw', roles: ['admin'] },
    };

    component.openUserCrud();

    expect(userService.update).toHaveBeenCalledWith(
      { username: 'zoe', password: 'pw', roles: ['admin'] },
      undefined,
    );
    expect(component.users().some((user) => user.username === 'zoe')).toBeFalse();
  });

  it('deletes a user from dialog result', () => {
    const existing = makeUser('ana', ['login']);
    component.users.set([existing]);
    dialog.nextResult = { action: 'delete', user: { username: 'ana' } };

    component.openUserCrud(existing);

    expect(userService.destroy).toHaveBeenCalledWith('ana');
    expect(component.users().length).toBe(0);
  });

  it('delegates selection to openUserCrud', () => {
    const spy = spyOn(component, 'openUserCrud');
    const row = makeUser('sam', ['login']);

    component.selected(row);

    expect(spy).toHaveBeenCalledWith(row);
  });
});
