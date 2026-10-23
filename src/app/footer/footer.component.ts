import { Component } from '@angular/core';

/**
 * Footer wrapper for app-level content.
 */
@Component({
  selector: 'app-footer',
  template: '<footer><ng-content /></footer>',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {}
