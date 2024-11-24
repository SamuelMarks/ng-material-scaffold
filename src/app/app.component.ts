import { Component, HostListener } from '@angular/core';

import { Subject } from "rxjs";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    standalone: false
})
export class AppComponent {
  title = "ng-material-scaffold";
  openedSubject = new Subject<boolean>();

  // Close the sidebar when ESC is pressed
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(_: KeyboardEvent) {
    this.openedSubject.next(false);
  }
}
