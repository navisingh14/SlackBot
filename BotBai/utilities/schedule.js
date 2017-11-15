const moment = require('moment');
const User = require('../db/mongo/User');

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

    static from_google_json(calender_obj, cb) {
        var schedule = new Schedule();
        schedule.id = calender_obj.id;
        User.get_slack_ids_by_emails([calender_obj.creator.email], function(err, slack_ids){
            if (err) {
                cb && cb(err, null);
                return;
            } else if (slack_ids.length == 0) {
                cb && cb("User " + calender_obj.creator.email + " not found in DB", null);
                return;
            }
            schedule.creator = slack_ids[0];
            schedule.start = new DateTime();
            schedule.start.set_timestamp(calender_obj.start.dateTime);
            schedule.start.date_set = true; schedule.start.time_set = true;
            schedule.end = new DateTime(calender_obj.end.dateTime);
            schedule.end.set_timestamp(calender_obj.end.dateTime);
            schedule.end.date_set = true; schedule.end.time_set = true;
            if (calender_obj.attendees) {
                var attendees = calender_obj.attendees.map(function(attendee){ return attendee.email;});
                User.get_slack_ids_by_emails(attendees, function(err, slack_ids){
                    if (err) {
                        cb && cb(err, null);
                        return;
                    }
                    schedule.participants = slack_ids;
                    cb && cb(null, schedule);
                });
            } else {
                schedule.participants = [];
                cb && cb(null, schedule);
            }
            
        });
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
            dt.time_set = obj.time_set && true
            dt.date_set = obj.date_set && true
            if (obj.timestamp) {
                dt.timestamp = moment(obj.timestamp).unix() * 1000;    
            } else {
                dt.timestamp = moment(obj).unix() * 1000;
            }
            return dt;
        }
    }
}

exports.Schedule = Schedule;
exports.DateTime = DateTime;