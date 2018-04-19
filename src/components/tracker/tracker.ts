import { Component } from '@angular/core';

/**
 * Generated class for the TrackerComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'ttracker-tracker',
  templateUrl: 'tracker.html'
})
export class TrackerComponent {

  text: string;

  constructor() {
    console.log('Hello TrackerComponent Component');
    this.text = 'Hello World';
  }

}
