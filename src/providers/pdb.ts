import { Injectable } from '@angular/core';

import PouchDB from 'pouchdb';

import { TrackerInterval } from '../models/tracker-interval';
import { Task } from '../models/task';

import moment from 'moment';

@Injectable()
export class PdbProvider {

    private pdbIdPrefix = {
        tracker: 'tracker_',
        task: 'task_'
    };

    public pdb = {
        local: null,
        remote: null
    };

    private pdbOptions = {
        local: {
            name: 'ttrack'
        }
    };

    constructor() {
        // Init LOCAL PouchDB
        this.pdb.local = new PouchDB(this.pdbOptions.local.name);
    }

    generateId(docType: string = '') {

        let result: string = '';

        if (docType != '' && typeof this.pdbIdPrefix[docType] == 'string') {
           result = this.pdbIdPrefix[docType];
        }

        return result + moment().format('YYYYMMDDHHmmss');
    }

    fetchAllTrackerIntervals(): Promise<Array<TrackerInterval>> {

        return new Promise((resolve, reject) => {

            this.pdb.local.allDocs({
                include_docs: true,
                startkey: this.pdbIdPrefix.tracker,
                endkey: this.pdbIdPrefix.tracker + '\ufff0'
            }).then(result => {

                if (!result || typeof result.rows === 'undefined' || !Array.isArray(result.rows)) {
                    reject([]);
                }

                let momentTrackerInterval: TrackerInterval;
                let trackerIntervalArray: Array<TrackerInterval> = [];

                for (let actualTrackerInterval of result.rows) {

                    if (typeof actualTrackerInterval.doc !== 'undefined') {

                        momentTrackerInterval = new TrackerInterval(
                            moment(actualTrackerInterval.doc.startedAt, moment.ISO_8601),
                            actualTrackerInterval.doc._id
                        );

                        momentTrackerInterval._rev = actualTrackerInterval.doc._rev;

                        if (actualTrackerInterval.doc.finishedAt) {
                            momentTrackerInterval.finishedAt = moment(actualTrackerInterval.doc.finishedAt, moment.ISO_8601);
                        }

                        if (actualTrackerInterval.doc.duration) {
                            momentTrackerInterval.duration = moment.duration(actualTrackerInterval.doc.duration);
                        }

                        trackerIntervalArray.push(momentTrackerInterval);

                    }

                }

                resolve(trackerIntervalArray);

            }).catch(errorInfo => {
                console.error('Failed trying to load tracker intervals from PouchDB');
                reject([]);
            });

        });

    }

    fetchAllTasks(): Promise<Array<Task>> {

        return new Promise((resolve, reject) => {

            this.pdb.local.allDocs({
                include_docs: true,
                startkey: this.pdbIdPrefix.task,
                endkey: this.pdbIdPrefix.task + '\ufff0'
            }).then(result => {

                if (!result || typeof result.rows === 'undefined' || !Array.isArray(result.rows)) {
                    reject([]);
                }

                let returnTasks: Array<Task> = [];
                let actualTask: Task;
                let actualInterval: TrackerInterval;

                for (let actualDbTask of result.rows) {

                    if (typeof actualDbTask.doc !== 'undefined') {

                        actualTask = new Task(actualDbTask.doc._id, actualDbTask.doc.description);

                        for (let actualDbInterval of actualDbTask.doc.intervals) {

                            actualInterval = new TrackerInterval(
                                moment(actualDbInterval.startedAt, moment.ISO_8601),
                                actualDbInterval._id
                            );

                            actualInterval.finishedAt = moment(actualDbInterval.finishedAt, moment.ISO_8601);
                            actualInterval.duration = moment.duration(actualDbInterval.duration);

                            actualTask.intervals.push(actualInterval);
                        }

                        returnTasks.push(actualTask);

                    }

                }

                resolve(returnTasks);

            }).catch(errorInfo => {
                console.error('Failed trying to load tasks from PouchDB');
                reject([]);
            });

        });
    }

    storeTrackerInterval(trackerInterval: TrackerInterval): Promise<TrackerInterval> {

        return new Promise((resolve, reject) => {

            let pdbDoc: any = {
                _id: trackerInterval._id,
                startedAt: trackerInterval.startedAt.toISOString()
            };

            if (trackerInterval.finishedAt) {
                pdbDoc.finishedAt = trackerInterval.finishedAt.toISOString();
            }

            if (trackerInterval.duration) {
                pdbDoc.duration = trackerInterval.duration.toISOString();
            }

            if (trackerInterval._rev != '') {
                pdbDoc._rev = trackerInterval._rev;
            }

            this.pdb.local.put(pdbDoc).then(response => {

                if (typeof response.id === 'string' && response.id != '') {
                    trackerInterval._id = response.id;
                }
                if (typeof response.rev === 'string' && response.rev != '') {
                    trackerInterval._rev = response.rev;
                }

                resolve(trackerInterval);

            }).catch(() => {
                console.error('Failed trying to store tracker interval to PouchDB');
                reject(trackerInterval);
            });

        });

    }

    storeTask(task: Task): Promise<Task> {

        return new Promise((resolve, reject) => {

            let pdbDoc: any = {
                _id: task._id,
                description: task.description,
                intervals: []
            };

            let momentInterval;

            for (let actualInterval of task.intervals) {

                momentInterval = {
                    startedAt: actualInterval.startedAt.toISOString(),
                    finishedAt: actualInterval.finishedAt.toISOString(),
                    duration: actualInterval.duration.toISOString()
                };

                pdbDoc.intervals.push(momentInterval);

            }

            this.pdb.local.put(pdbDoc).then(response => {

                if (typeof response.id === 'string' && response.id != '') {
                    task._id = response.id;
                }
                if (typeof response.rev === 'string' && response.rev != '') {
                    task._rev = response.rev;
                }

                resolve(task);

            }).catch(() => {
                console.error('Failed trying to store task to PouchDB');
                reject(task);
            });

        });

    }

}
