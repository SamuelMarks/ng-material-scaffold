import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { SecretService } from './secret-service.service';

describe('SecretService', () => {
  it('requests the secret endpoint', () => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SecretService],
    });

    const service = TestBed.inject(SecretService);
    const httpMock = TestBed.inject(HttpTestingController);

    service.get().subscribe((secret) => {
      expect(secret).toBe('shh');
    });

    const req = httpMock.expectOne('/secured/secret');
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('text');
    req.flush('shh');

    httpMock.verify();
  });
});
