import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { IUser } from '../../api/user/user.interfaces';
import { UserCrudDialogComponent } from './user-crud.dialog.component';

describe('UserCrudDialogComponent', () => {
  let dialogRef: jasmine.SpyObj<MatDialogRef<UserCrudDialogComponent>>;

  beforeEach(() => {
    dialogRef = jasmine.createSpyObj<MatDialogRef<UserCrudDialogComponent>>('MatDialogRef', [
      'close',
    ]);
  });

  it('creates users when no data is provided', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, UserCrudDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: null },
      ],
    });

    const fixture: ComponentFixture<UserCrudDialogComponent> =
      TestBed.createComponent(UserCrudDialogComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.isEditing()).toBeFalse();
    expect(component.userForm.password().disabled()).toBeFalse();

    component.userModel.set({ username: 'sam', password: 'pw', roles: ['login'] });
    component.closeDialog();

    expect(dialogRef.close).toHaveBeenCalledWith({
      action: 'create',
      user: { username: 'sam', password: 'pw', roles: ['login'] },
    });

    dialogRef.close.calls.reset();
    component.deleteUser();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('updates and deletes users when data is provided', () => {
    const data: IUser = {
      username: 'ana',
      password: 'pw',
      roles: ['login'],
      createdAt: new Date('2020-01-01T00:00:00Z'),
      updatedAt: new Date('2020-01-02T00:00:00Z'),
    };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, UserCrudDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: data },
      ],
    });

    const fixture: ComponentFixture<UserCrudDialogComponent> =
      TestBed.createComponent(UserCrudDialogComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.isEditing()).toBeTrue();
    expect(component.userForm.password().disabled()).toBeTrue();

    component.userForm.roles().value.set(['admin']);
    component.closeDialog();

    expect(dialogRef.close).toHaveBeenCalledWith({
      action: 'update',
      user: { username: 'ana', password: '', roles: ['admin'] },
    });

    component.deleteUser();
    expect(dialogRef.close).toHaveBeenCalledWith({ action: 'delete', user: { username: 'ana' } });
  });
});
