import { Component, OnInit } from '@angular/core';
import { SecretService } from "./secret-service.service";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";

@Component({
  selector: 'app-secret-dashboard',
  templateUrl: './secret-dashboard.component.html',
  styleUrls: ['./secret-dashboard.component.css'],
  standalone: false
})
export class SecretDashboardComponent implements OnInit {
  secret$!: Observable<string>;
  secretError$: Observable<any> = new Observable();

  constructor(private secretService: SecretService) {
  }

  ngOnInit(): void {
    this.secret$ = this.secretService.get();
    this.secretError$ = this.secret$.pipe(catchError((err) => of(err)))
  }
}
