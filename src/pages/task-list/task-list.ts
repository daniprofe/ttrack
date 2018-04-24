import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { MomentUtilsProvider } from '../../providers/moment-utils';
import { TasksProvider } from '../../providers/tasks';
import { trackerSegment } from '../../models/task';

@IonicPage()
@Component({
    selector: 'page-task-list',
    templateUrl: 'task-list.html',
})
export class TaskListPage {

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private mu: MomentUtilsProvider,
        private tp: TasksProvider
    ) {
    }

    ionViewDidEnter() {

    }

    showFinishedAt(segment: trackerSegment) {

        let showDate = true;

        if (segment.startedAt.format('YYYYMMDD') === segment.finishedAt.format('YYYYMMDD')) {
            showDate = false;
        }

        return this.mu.momentToString(segment.finishedAt, showDate);

    }

}
