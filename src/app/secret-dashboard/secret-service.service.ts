import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";

@Injectable()
export class SecretService {
  constructor(private http: HttpClient) {
  }

  public get(): Observable<string> {
    return this.http.get('/secured/secret', {responseType: 'text'});
  }
}
