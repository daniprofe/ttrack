import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { trackerSegment } from '../../models/task';
import { MomentUtilsProvider } from '../../providers/moment-utils';
import { TasksProvider } from '../../providers/tasks';

/**
 * Generated class for the TaskListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-task-list',
  templateUrl: 'task-list.html',
})
export class TaskListPage {

    private filter: string = '';

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private tp: TasksProvider,
        private mu: MomentUtilsProvider) {
    }

    ionViewDidLoad() {
    console.log('ionViewDidLoad TaskListPage');
    }

    showFinishedAt(segment: trackerSegment) {

        let showDate = true;

        if (segment.startedAt.format('YYYYMMDD') === segment.finishedAt.format('YYYYMMDD')) {
            showDate = false;
        }

        return this.mu.momentToString(segment.finishedAt, showDate);

    }

}
