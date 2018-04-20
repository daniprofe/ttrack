import { Component } from '@angular/core';

import { Observable } from 'rxjs/Rx';
import moment from 'moment';

interface trackerSegment {
    startedAt: moment.Moment|null,
    finishedAt: moment.Moment|null,
}

@Component({
    selector: 'ttracker-tracker',
    templateUrl: 'tracker.html'
})

export class TrackerComponent {

    private locale: string = 'es';
    private timer = null;
    private now: moment.Moment|null = null;

    private nowTracking: boolean = false;
    private segments: Array<trackerSegment> = [];

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
        this.now = moment();
    }

    startButtonClicked(): void {

        this.segments.push({
            startedAt: this.now,
            finishedAt: null
        });

        this.nowTracking = true;

    }

    pauseButtonClicked(): void {
        this.segments[this.segments.length - 1].finishedAt = this.now;
        this.nowTracking = false;
    }

    showFinishedAt(segment: trackerSegment): string {
        return this.showDateTime(segment.finishedAt, (segment.startedAt.format('YYYYMMDD') !== segment.finishedAt.format('YYYYMMDD')));
    }

    showDateTime(m: moment.Moment, showDate?: boolean) {

        let format = '';

        if (typeof showDate !== 'undefined' && showDate === true) {
            format = 'DD/MM/YYYY ';
        }

        format += 'HH:mm:ss';

        return m.format(format);

    }

    showEllapsed(from: moment.Moment, to?: moment.Moment): string {

        if (typeof to === 'undefined') {
            to = this.now;
        }

        let ellapsedDuration = moment.duration(to.diff(from));

        /* Tricky way to format a moment duration as HH:mm:ss
         * https://github.com/moment/moment/issues/1048
         */
        return Math.floor(ellapsedDuration.asHours()) + moment.utc(ellapsedDuration.asMilliseconds()).format(":mm:ss");

    }

    showEllapsedTotal(): string {

        let totalDuration = null;
        let actualDuration = null;

        for (let actualSegment of this.segments) {

            if (actualSegment.finishedAt) {
                actualDuration = moment.duration(actualSegment.finishedAt.diff(actualSegment.startedAt));
            } else {
                actualDuration = moment.duration(this.now.diff(actualSegment.startedAt));
            }

            if (totalDuration === null) {
                totalDuration = actualDuration;
            } else {
                totalDuration.add(actualDuration);
            }
        }

        /* Tricky way to format a moment duration as HH:mm:ss
         * https://github.com/moment/moment/issues/1048
         */
        return Math.floor(totalDuration.asHours()) + moment.utc(totalDuration.asMilliseconds()).format(":mm:ss");

    }

}
