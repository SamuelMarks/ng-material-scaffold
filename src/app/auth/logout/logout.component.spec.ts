import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AuthService } from '../auth.service';
import { LogoutComponent } from './logout.component';

describe('LogoutComponent', () => {
  it('calls logout on init', () => {
    const authService = jasmine.createSpyObj<AuthService>('AuthService', ['logout']);
    authService.logout.and.returnValue(of(void 0));

    TestBed.configureTestingModule({
      imports: [LogoutComponent],
      providers: [{ provide: AuthService, useValue: authService }],
    });

    const component = TestBed.createComponent(LogoutComponent).componentInstance;
    component.ngOnInit();

    expect(authService.logout).toHaveBeenCalled();
  });
});
