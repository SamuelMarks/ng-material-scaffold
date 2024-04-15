import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subject } from "rxjs";
import { AppImports } from "./app.module";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: AppImports as Array<any>, // [RouterOutlet].concat(AppImports as Array<any>),
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = "ng-material-scaffold";
  openedSubject = new Subject<boolean>();

  dismissSidebar() {
    this.openedSubject.next(false);
  }
}
