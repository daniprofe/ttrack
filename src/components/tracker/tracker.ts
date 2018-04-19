import { Component } from '@angular/core';

import { Observable } from 'rxjs/Rx';
import moment from 'moment';

@Component({
    selector: 'ttracker-tracker',
    templateUrl: 'tracker.html'
})

export class TrackerComponent {

    private locale: string = 'es';
    private timer: Observable|null = null;
    private startedAtMoment = null;
    private startedAtString: string = '';
    private ellapsedDuration = null;
    private ellapsedString: string = '';

    constructor() {
        moment.locale(this.locale);
        this.timer = Observable.timer(0, 1000);
        this.timer.subscribe(t => { this.updateTimer(t); });
    }

    updateTimer(t) {

        if (this.startedAtMoment !== null) {
            this.startedAtString = this.startedAtMoment.calendar();
            this.ellapsedDuration = moment.duration(moment().diff(this.startedAtMoment));

            /* Tricky way to format a moment duration as HH:mm:ss
             * https://github.com/moment/moment/issues/1048
             */
            this.ellapsedString = Math.floor(this.ellapsedDuration.asHours()) + moment.utc(this.ellapsedDuration.asMilliseconds()).format(":mm:ss");
        }
        // console.error('*');
    }

    startButtonClicked() {
        this.startedAtMoment = moment();
        this.startedAtString = this.startedAtMoment.calendar();
    }

}
