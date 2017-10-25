const util = require('util');
const moment = require('moment');
const { URL, URLSearchParams } = require('url');
const config = require('../utilities/config');

DATE_FORMAT = "MM/DD/YYYY";
TIME_FORMAT = "HH:MM";
DATE_TIME_FORMAT = util.format("%s %s", DATE_FORMAT, TIME_FORMAT);


var render_attachments_for_change = function(schedules, user, channel, key) {
    return schedules.map(function(sched){
        var attcmt = render_attachment(sched);
        var url = new URL(key, util.format("%s:%s", config.server, config.port));
        url.searchParams.set("user", user);
        url.searchParams.set("channel", channel);
        url.searchParams.set("meeting_id", sched.id);
        attcmt['fields'].push({"title" : util.format("Do you want to %s this?", key), "value" : util.format("<%s|YES>", url)});
        console.log(attcmt);
        return attcmt;
    });
}

var render_attachments = function(schedules) {
    return schedules.map(function(sched){
        return render_attachment(sched);
    });
}

var render_attachment =  function(schedule) {
    var start_date = moment(schedule.start.timestamp).format(DATE_FORMAT);
    var start_date_time = moment(schedule.start.timestamp).format(DATE_TIME_FORMAT);
    var end_date = moment(schedule.end.timestamp).format(DATE_FORMAT);
    var end_date_time = moment(schedule.end.timestamp).format(DATE_TIME_FORMAT);
    var fallback = util.format("Meeting on %s until %s", start_date_time, end_date_time);
    var title = util.format("Meeting on %s", start_date);
    var participants = schedule.participants.map(function(ptcpt){ return '@' + ptcpt }).join(", ");
    var attachment = {
        "fallback" : fallback,
        "title" : title,
        "color" : "#36a64f",
        "fields" : [
            {"title" : "Creator", "value" : schedule.creator, "short": true},
            {"title" : "Starts", "value" : start_date_time, "short": true},
            {"title" : "Ends", "value" : end_date_time, "short": true},
            {"title" : "Participants", "value" : participants, "short": true}
        ]
    };
    return attachment;
}

exports.render_attachment = render_attachment;
exports.render_attachments = render_attachments;
exports.render_attachments_for_change = render_attachments_for_change;