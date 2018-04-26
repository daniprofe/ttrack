import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Task } from '../../models/task';
import { trackerSegment } from '../../models/task';
import { MomentUtilsProvider } from '../../providers/moment-utils';
import { TasksProvider } from '../../providers/tasks';

@IonicPage()
@Component({
    selector: 'page-task-list',
    templateUrl: 'task-list.html',
})
export class TaskListPage {

    private tab: string = 'tracker';
    private searchingTask: boolean = false;
    private descriptionFilter: string = '';
    private showTaskSave: boolean = false;
    private savingTrackerSegment: trackerSegment|null = null;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private tp: TasksProvider,
        private mu: MomentUtilsProvider) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad TaskListPage');
    }

    filterByDescription(task: Task): boolean {

        let descriptionFilter = this.descriptionFilter.trim().toLowerCase();

        if (descriptionFilter == '') {
            return true;
        } else if (task.description.toLowerCase().indexOf(descriptionFilter) > -1) {
            return true;
        } else {
            return false;
        }

    }

    showFinishedAt(segment: trackerSegment) {

        let showDate = true;

        if (segment.startedAt.format('YYYYMMDD') === segment.finishedAt.format('YYYYMMDD')) {
            showDate = false;
        }

        return this.mu.momentToString(segment.finishedAt, showDate);

    }

    trackerTaskClicked(clickedSegment: trackerSegment) {

        // Go to tasks tab and show search bar
        this.tab = 'tasks';
        this.searchingTask = true;
        this.savingTrackerSegment = clickedSegment;

    }

    searchTask(event) {
        if (event.target.value) {
            this.descriptionFilter = event.target.value;
        }
    }

    saveNewTaskButtonClicked() {
        let newTask = new Task(this.descriptionFilter.trim());
        newTask.segments.push(this.savingTrackerSegment);
        this.tp.tasks.push(newTask);
    }
}
