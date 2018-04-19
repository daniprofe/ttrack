import { Component } from '@angular/core';

import { TaskListPage } from '../pages/task-list/task-list';

@Component({
  templateUrl: 'app.html'
})

export class TTracker {

    rootPage: any = TaskListPage;

    constructor() {
    }
}
