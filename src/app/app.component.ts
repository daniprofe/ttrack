import { Component } from '@angular/core';

import { TaskListPage } from '../pages/task-list/task-list';
import { Task } from '../models/task';
import { TasksProvider } from '../providers/tasks';

@Component({
  templateUrl: 'app.html'
})

export class TTracker {

    rootPage: any = TaskListPage;

    constructor(private tasks: TasksProvider) {
    }

    newSegment(segment) {
        console.error("Ay!!");
        console.error(segment);

        this.tasks.newTaskFromSegment(segment);

    }
}
