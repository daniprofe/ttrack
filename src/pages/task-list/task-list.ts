import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';

import { Task } from '../../models/task';
import { TrackerInterval } from '../../models/tracker-interval';
import { MomentUtilsProvider } from '../../providers/moment-utils';
import { PdbProvider } from '../../providers/pdb';

@IonicPage()
@Component({
    selector: 'page-task-list',
    templateUrl: 'task-list.html',
})
export class TaskListPage {

    private tab: string = 'tracker';
    private searchingTask: boolean = false;
    private savingTrackerInterval: boolean = false;
    private descriptionFilter: string = '';
    private showTaskSave: boolean = false;
    private selectedTrackerIntervalIndex: number|null = null;
    private selectedTrackerInterval: TrackerInterval|null = null;

    private tracker: Array<TrackerInterval> = [];
    private tasks: Array<Task> = [];

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private pdb: PdbProvider,
        private mu: MomentUtilsProvider,
        private events: Events) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad TaskListPage');
        this.events.subscribe('tracker:new-interval', newInterval => {
            this.tracker.push(newInterval);
            console.log(this.tracker);
        });
        this.pdb.fetchAllTrackerIntervals().then(result => {
            this.tracker = result;
            console.log(this.tracker);
        });
        this.pdb.fetchAllTasks().then(result => {
            this.tasks = result;
            console.log(this.tasks);
        });
    }

    showFinishedAt(trackerInterval: TrackerInterval) {

        let showDate = true;

        if (trackerInterval.startedAt.format('YYYYMMDD') === trackerInterval.finishedAt.format('YYYYMMDD')) {
            showDate = false;
        }

        return this.mu.momentToString(trackerInterval.finishedAt, showDate);

    }

    trackerIntervalClicked(clickedIntervalIndex: number) {

        // Go to tasks tab and show search bar
        this.selectedTrackerIntervalIndex = clickedIntervalIndex;
        this.selectedTrackerInterval = this.tracker[clickedIntervalIndex];
        this.tab = 'tasks';
        this.savingTrackerInterval = true;
        this.searchingTask = true;
    }

    taskClicked(clickedTask: Task) {

        if (this.savingTrackerInterval) {

            clickedTask.addInterval(this.selectedTrackerInterval);

            this.pdb.storeTask(clickedTask).then(task => {
                this.pdb.deleteDoc(this.selectedTrackerInterval).then(result => {
                    this.tracker.splice(this.selectedTrackerIntervalIndex, 1);
                    this.savingTrackerInterval = false;
                    this.searchingTask = false;
                });
            });

        }

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

    searchTask(event) {
        if (event.target.value) {
            this.descriptionFilter = event.target.value;
        }
    }

    saveNewTaskButtonClicked() {

        let newTask = new Task(this.pdb.generateId('task'), this.descriptionFilter.trim());
        newTask.addInterval(this.selectedTrackerInterval);


        this.pdb.storeTask(newTask).then(task => {
            this.tasks.push(task);
            this.pdb.deleteDoc(this.selectedTrackerInterval).then(result => {
                this.tracker.splice(this.selectedTrackerIntervalIndex, 1);
                this.savingTrackerInterval = false;
                this.searchingTask = false;
            });
        });
    }

}
