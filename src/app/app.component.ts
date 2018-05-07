import { Component } from '@angular/core';
import { TrackerInterval } from '../models/tracker-interval';
import { Events } from 'ionic-angular';

import { TaskListPage } from '../pages/task-list/task-list';
// import { Task } from '../models/task';
// import { PdbProvider } from '../providers/pdb';

@Component({
  templateUrl: 'app.html'
})

export class TTracker {

    rootPage: any = TaskListPage;

    constructor() {
    }

    newTrackerInterval(trackerInterval) {



    }
}
