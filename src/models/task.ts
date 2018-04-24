import moment from 'moment';

export interface trackerSegment {
    startedAt: moment.Moment|null,
    finishedAt: moment.Moment|null,
    duration: moment.Duration|null
}

export class Task {

    public segments: Array<trackerSegment> = [];

    constructor(private description: string = 'Nueva tarea') {

            this.description = this.description.trim();

    }

}
