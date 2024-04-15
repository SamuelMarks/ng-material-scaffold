import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subject } from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = "ng-material-scaffold";
  openedSubject = new Subject<boolean>();

  dismissSidebar() {
    this.openedSubject.next(false);
  }
}
