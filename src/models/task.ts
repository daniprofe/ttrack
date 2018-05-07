import { TrackerInterval } from './tracker-interval';

export class Task {

    public intervals: Array<TrackerInterval> = [];
    
    public _rev: string;

    constructor(public _id: string, public description: string = 'Nueva tarea') {

        this.description = this.description.trim();

    }

}
