import { Component, Output, EventEmitter } from '@angular/core';

import { Observable } from 'rxjs/Rx';
import moment from 'moment';

import { MomentUtilsProvider } from '../../providers/moment-utils';

interface trackerSegment {
    startedAt: moment.Moment|null,
    finishedAt: moment.Moment|null,
    duration: moment.Duration|null
}

@Component({
    selector: 'ttracker-tracker',
    templateUrl: 'tracker.html'
})

export class TrackerComponent {

    @Output('new-segment') newSegment = new EventEmitter();

    private locale: string = 'es';
    private timer = null;
    private now: moment.Moment|null = null;
    private tracking: trackerSegment = {
        startedAt: null,
        finishedAt: null,
        duration: null
    };

    constructor(private mu: MomentUtilsProvider) {
        moment.locale(this.locale);
        this.timer = Observable.timer(0, 1000);
        this.timer.subscribe(t => { this.updateTimer(t); });
    }

    updateTimer(t) {
        this.now = moment();
    }

    startButtonClicked(): void {
        this.tracking.startedAt = this.now;
    }

    stopButtonClicked(): void {
        this.tracking.finishedAt = this.now;
        this.tracking.duration = moment.duration(this.tracking.finishedAt.diff(this.tracking.startedAt));
        this.newSegment.emit(this.tracking);
        this.tracking = {
            startedAt: null,
            finishedAt: null,
            duration: null
        };
    }

    showStartedAt(): string {
        return this.mu.momentToString(this.tracking.startedAt);
    }
    /*
    showFinishedAt(segment: trackerSegment): string {
        return this.task.showDateTime(segment.finishedAt, (segment.startedAt.format('YYYYMMDD') !== segment.finishedAt.format('YYYYMMDD')));
    }
     */

    showEllapsed(from: moment.Moment, to?: moment.Moment): string {
        return this.mu.durationToHours(moment.duration(this.now.diff(this.tracking.startedAt)));
    }

}
