import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { IServerStatus } from './server-status.interfaces';

/**
 * API client for server status.
 */
@Injectable({
  providedIn: 'root',
})
export class ServerStatusService {
  private readonly http = inject(HttpClient);

  get(): Observable<IServerStatus> {
    return this.http.get<IServerStatus>('/api');
  }
}
