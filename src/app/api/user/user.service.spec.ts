import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { UserService } from './user.service';
import { UserUpsert } from './user.interfaces';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('creates a user and parses date fields', () => {
    const payload: UserUpsert = { username: 'zoe', password: 'pw', roles: ['admin'] };
    const response = {
      username: 'zoe',
      password: 'pw',
      roles: ['admin'],
      createdAt: '2020-01-01T00:00:00Z',
      updatedAt: '2020-01-02T00:00:00Z',
    };

    service.create(payload).subscribe((user) => {
      expect(user.createdAt).toEqual(new Date('2020-01-01T00:00:00Z'));
      expect(user.updatedAt).toEqual(new Date('2020-01-02T00:00:00Z'));
    });

    const req = httpMock.expectOne('/api/user');
    expect(req.request.method).toBe('POST');
    req.flush(response);
  });

  it('reads a user without id', () => {
    service.read().subscribe((user) => {
      expect(user.username).toBe('alex');
    });

    const req = httpMock.expectOne('/api/user');
    expect(req.request.method).toBe('GET');
    req.flush({
      username: 'alex',
      password: 'pw',
      roles: ['login'],
      createdAt: '2020-01-01T00:00:00Z',
      updatedAt: '2020-01-02T00:00:00Z',
    });
  });

  it('reads a user with id', () => {
    service.read('123').subscribe((user) => {
      expect(user.username).toBe('sam');
    });

    const req = httpMock.expectOne('/api/user/123');
    expect(req.request.method).toBe('GET');
    req.flush({
      username: 'sam',
      password: 'pw',
      roles: ['admin'],
      createdAt: '2020-01-01T00:00:00Z',
      updatedAt: '2020-01-02T00:00:00Z',
    });
  });

  it('updates a user with id', () => {
    const payload: UserUpsert = { username: 'sam', password: 'pw', roles: ['admin'] };

    service.update(payload, '123').subscribe((user) => {
      expect(user.username).toBe('sam');
    });

    const req = httpMock.expectOne('/api/user/123');
    expect(req.request.method).toBe('PUT');
    req.flush({
      username: 'sam',
      password: 'pw',
      roles: ['admin'],
      createdAt: '2020-01-01T00:00:00Z',
      updatedAt: '2020-01-02T00:00:00Z',
    });
  });

  it('updates a user without id', () => {
    const payload: UserUpsert = { username: 'sam', password: 'pw', roles: ['admin'] };

    service.update(payload).subscribe((user) => {
      expect(user.username).toBe('sam');
    });

    const req = httpMock.expectOne('/api/user');
    expect(req.request.method).toBe('PUT');
    req.flush({
      username: 'sam',
      password: 'pw',
      roles: ['admin'],
      createdAt: '2020-01-01T00:00:00Z',
      updatedAt: '2020-01-02T00:00:00Z',
    });
  });

  it('destroys a user', () => {
    service.destroy('abc').subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne('/api/user/abc');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('gets all users sorted by username', () => {
    service.getAll().subscribe((users) => {
      expect(users[0].username).toBe('ana');
      expect(users[1].username).toBe('zoe');
    });

    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('GET');
    req.flush({
      users: [
        {
          username: 'zoe',
          password: 'pw',
          roles: ['admin'],
          createdAt: '2020-01-01T00:00:00Z',
          updatedAt: '2020-01-02T00:00:00Z',
        },
        {
          username: 'ana',
          password: 'pw',
          roles: ['login'],
          createdAt: '2020-01-03T00:00:00Z',
          updatedAt: '2020-01-04T00:00:00Z',
        },
      ],
    });
  });
});
