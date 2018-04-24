import { Injectable } from '@angular/core';

import moment from 'moment';

@Injectable()
export class MomentUtilsProvider {

    constructor() {
    }

    /**
     * Shows a moment as a string
     * @param moment.Moment moment Moment to be converted to a string
     * @param boolean showDate true if we want to show the date, false if we only
                               want to show the time
     * @return Moment converted to a string
     */
    momentToString(moment: moment.Moment, showDate: boolean = true) {

        let format = '';

        if (typeof showDate !== 'undefined' && showDate === true) {
            format = 'DD/MM/YYYY ';
        }

        format += 'HH:mm:ss';

        return moment.format(format);

    }

    /**
     * Shows a duration as HH:mm:ss, where HH could be > 24 (ex: 120:23:12)
     * @param  duration Duration (moment)
     * @return string Duration converted to a string
     */
    durationToHours(duration: moment.Duration) {

        /* Tricky way to format a moment duration as HH:mm:ss
         * https://github.com/moment/moment/issues/1048
         */
        return Math.floor(duration.asHours()) + moment.utc(duration.asMilliseconds()).format(":mm:ss");

    }

}
