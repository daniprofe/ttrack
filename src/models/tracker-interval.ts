import { PdbProvider } from '../providers/pdb';

import moment from 'moment';

export class TrackerInterval {

    public finishedAt: moment.Moment;
    public duration: moment.Duration;
    public _rev: string;

    constructor(public startedAt: moment.Moment, public _id: string) {

    }

}
