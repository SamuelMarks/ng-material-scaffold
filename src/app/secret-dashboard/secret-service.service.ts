import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

/**
 * API client for loading the secret dashboard content.
 */
@Injectable({
  providedIn: 'root',
})
export class SecretService {
  private readonly http = inject(HttpClient);

  get(): Observable<string> {
    return this.http.get('/secured/secret', { responseType: 'text' });
  }
}
