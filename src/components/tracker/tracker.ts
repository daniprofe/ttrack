import { Component, Output, EventEmitter } from '@angular/core';
import { Events } from 'ionic-angular';

import { Observable } from 'rxjs/Rx';
import moment from 'moment';

import { PdbProvider } from '../../providers/pdb';
import { TrackerInterval } from '../../models/tracker-interval';
import { MomentUtilsProvider } from '../../providers/moment-utils';

@Component({
    selector: 'ttracker-tracker',
    templateUrl: 'tracker.html'
})

export class TrackerComponent {

    // @Output('new-interval') newInterval = new EventEmitter();

    private locale: string = 'es';
    private timer = null;
    private now: moment.Moment|null = null;
    private tracking: TrackerInterval|null = null;

    constructor(
        private mu: MomentUtilsProvider,
        private pdb: PdbProvider,
        private events: Events) {

        moment.locale(this.locale);
        this.timer = Observable.timer(0, 1000);
        this.timer.subscribe(t => { this.updateTimer(t); });

        this.events.subscribe('tracker:load-interval', interval => {
            this.tracking = interval;
        });

    }

    updateTimer(t) {
        this.now = moment();
    }

    startButtonClicked(): void {
        this.tracking = new TrackerInterval(this.now, this.pdb.generateId('tracker'));
        this.pdb.storeTrackerInterval(this.tracking).then(stored => {
            this.tracking = stored;
        }).catch(stored => {
            this.tracking = stored;
        });
    }

    stopButtonClicked(): void {

        this.tracking.finishedAt = this.now;
        this.tracking.duration = moment.duration(this.tracking.finishedAt.diff(this.tracking.startedAt));

        this.pdb.storeTrackerInterval(this.tracking).then(stored => {
            /* If finishedAt exists... emit the 'closed' tracker interval and
             * prepare to start tracking a new one
             */
            this.tracking = stored;
            this.events.publish('tracker:new-interval', this.tracking);
            // this.newInterval.emit(this.tracking);
            this.tracking = null;
        }).catch(stored => {
            this.tracking = stored;
        });
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
