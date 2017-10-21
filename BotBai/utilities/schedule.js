var moment = require('moment');

class Schedule {
    /**
     * Schedule object
     */
    constructor() {
        this.intent = null;
        this.start = null;
        this.end = null;
        this.participants = null;
        this.creator = null;
    }
}

class DateTime {
    constructor() {
        this.timestamp = null;
        this.time_set = false;
        this.date_set = false;
    }

    set_timestamp(time_str) {
        this.timestamp = moment(time_str).unix() * 1000;
    }
}

exports.Schedule = Schedule;
exports.DateTime = DateTime;