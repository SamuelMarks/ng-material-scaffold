import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAdminCrudDialogComponent } from './user-admin-crud-dialog.component';

describe('UserAdminCrudDialogComponent', () => {
  let component: UserAdminCrudDialogComponent;
  let fixture: ComponentFixture<UserAdminCrudDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserAdminCrudDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAdminCrudDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
