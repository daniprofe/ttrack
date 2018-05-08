import { TrackerInterval } from './tracker-interval';

import moment from 'moment';

export class Task {

    public intervals: Array<TrackerInterval> = [];
    public totalDuration: moment.Duration;

    public _rev: string;

    constructor(public _id: string, public description: string = 'Nueva tarea') {

        this.description = this.description.trim();
        this.totalDuration = moment.duration(0);

    }

    addInterval(interval: TrackerInterval) {
        this.intervals.push(interval);
        this.totalDuration.add(interval.duration);
    }

}
