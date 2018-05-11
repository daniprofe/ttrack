// https://ttrack-couchdb-server-daniprofe.c9users.io/

import { Injectable } from '@angular/core';

import PouchDB from 'pouchdb';

import { TrackerInterval } from '../models/tracker-interval';
import { Task } from '../models/task';

import moment from 'moment';

export interface PdbDoc {
    _id: string,
    _rev: string
}

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

    deleteDoc(doc: PdbDoc): Promise<boolean> {

        return new Promise((resolve, reject) => {
            this.pdb.local.remove(doc).then(result => {
                if (typeof result.ok === 'boolean' && result.ok === true) {
                    resolve(true);
                } else {
                    console.error('Failed trying to delete on PouchDB this doc: ' + JSON.stringify(doc));
                    reject(false);
                }
            }).catch(errorInfo => {
                console.error('Failed trying to delete on PouchDB this doc: ' + JSON.stringify(doc));
                reject(false);
            });

        });
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

                let actualTrackerInterval: TrackerInterval;
                let loadedIntervals: Array<TrackerInterval> = [];

                for (let dbTrackerInterval of result.rows) {

                    if (typeof dbTrackerInterval.doc !== 'undefined') {

                        actualTrackerInterval = new TrackerInterval(
                            moment(dbTrackerInterval.doc.startedAt, moment.ISO_8601),
                            dbTrackerInterval.doc._id
                        );

                        actualTrackerInterval._rev = dbTrackerInterval.doc._rev;

                        if (dbTrackerInterval.doc.finishedAt) {
                            actualTrackerInterval.finishedAt = moment(dbTrackerInterval.doc.finishedAt, moment.ISO_8601);
                        }

                        if (dbTrackerInterval.doc.duration) {
                            actualTrackerInterval.duration = moment.duration(dbTrackerInterval.doc.duration);
                        }

                        loadedIntervals.push(actualTrackerInterval);

                    }

                }

                resolve(loadedIntervals);

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
                        actualTask._rev = actualDbTask.doc._rev;

                        for (let actualDbInterval of actualDbTask.doc.intervals) {

                            actualInterval = new TrackerInterval(
                                moment(actualDbInterval.startedAt, moment.ISO_8601),
                                actualDbInterval._id
                            );

                            actualInterval.finishedAt = moment(actualDbInterval.finishedAt, moment.ISO_8601);
                            actualInterval.duration = moment.duration(actualDbInterval.duration);

                            actualTask.addInterval(actualInterval);
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

            if (task._rev != '') {
                pdbDoc._rev = task._rev;
            }

            let momentInterval;
            let totalDuration: moment.Duration = moment.duration(0);

            for (let actualInterval of task.intervals) {

                momentInterval = {
                    startedAt: actualInterval.startedAt.toISOString(),
                    finishedAt: actualInterval.finishedAt.toISOString(),
                    duration: actualInterval.duration.toISOString()
                };

                pdbDoc.intervals.push(momentInterval);

                totalDuration.add(actualInterval.duration);

            }

            pdbDoc.duration = totalDuration.toISOString();

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
