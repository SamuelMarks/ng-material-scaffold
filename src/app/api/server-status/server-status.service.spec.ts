import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ServerStatusService } from './server-status.service';

describe('ServerStatusService', () => {
  it('requests the server status endpoint', () => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ServerStatusService],
    });

    const service = TestBed.inject(ServerStatusService);
    const httpMock = TestBed.inject(HttpTestingController);

    service.get().subscribe((status) => {
      expect(status.version).toBe('1.0.0');
    });

    const req = httpMock.expectOne('/api');
    expect(req.request.method).toBe('GET');
    req.flush({ version: '1.0.0' });

    httpMock.verify();
  });
});
