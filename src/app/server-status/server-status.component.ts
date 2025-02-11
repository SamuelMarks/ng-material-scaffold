import { Component, Input, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { AlertsService } from '../alerts/alerts.service';
import { IServerStatus } from "../api/server-status/server-status.interfaces";
import { ServerStatusService } from "../api/server-status/server-status.service";


@Component({
    selector: 'app-server-status',
    templateUrl: './server-status.component.html',
    styleUrls: ['./server-status.component.css'],
    standalone: false
})
export class ServerStatusComponent implements OnInit {
  @Input() serverStatus: IServerStatus = {} as IServerStatus;

  constructor(private serverStatusService: ServerStatusService,
              private alertsService: AlertsService) {
  }

  ngOnInit() {
    this.serverStatus = { version: '@ 0.0.43; ' };
    this.serverStatusService
      .get()
      .subscribe(
        serverStatus => this.serverStatus.version += `API ${serverStatus.version}`,
        (error: HttpErrorResponse) => {
          const msg = error.status === 504 ? 'API server not available' : error.statusText;
          this.alertsService.add(msg);
          this.serverStatus.version += msg;
        }
      );
  }
}
