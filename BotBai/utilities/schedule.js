var moment = require('moment');

class Schedule {
    /**
     * Schedule object
     */
    constructor() {
        this.id = null;
        this.intent = null;
        this.start = null;
        this.end = null;
        this.participants = null;
        this.creator = null;
    }

    static from_json(json_obj) {
        var schedule = new Schedule();
        schedule.id = json_obj.id;
        schedule.intent = json_obj.intent;
        schedule.participants = json_obj.participants;
        schedule.creator = json_obj.creator;
        schedule.start = DateTime.from_json(json_obj.start);
        schedule.end = DateTime.from_json(json_obj.end);
        return schedule;
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

    static from_json(obj) {
        if (!obj) { return null; }
        else if (obj instanceof DateTime) {
            return obj;
        } else {
            var dt = new DateTime();
            dt.time_set = true, dt.date_set = true;
            dt.timestamp = moment(obj).unix() * 1000;
            return dt;
        }
    }
}

exports.Schedule = Schedule;
exports.DateTime = DateTime;