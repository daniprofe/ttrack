import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Task } from '../models/task';
import { trackerSegment } from '../models/task';

@Injectable()
export class TasksProvider {

    private tasks: Array<Task> = [];

    constructor() {
    }

    newTaskFromSegment(segment: trackerSegment) {
        let newTask = new Task('Intervalo sin tarea');
        newTask.segments.push(segment);
        this.tasks.push(newTask);
    }

}
