import { Injectable } from '@angular/core';

import { Task } from '../models/task';
import { trackerSegment } from '../models/task';

@Injectable()
export class TasksProvider {

    public tracker: Array<trackerSegment> = [];
    public tasks: Array<Task> = [];

    constructor() {
    }

    newTrackerSegment(segment: trackerSegment) {
        let newTask = new Task('Sin seguimiento');
        newTask.segments.push(segment);
        this.tasksFromTracker.push(newTask);
    }

    copyFromTrackerToTask()

}
