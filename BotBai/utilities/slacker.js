const util = require('util');
const moment = require('moment');
DATE_FORMAT = "MM/DD/YYYY";
TIME_FORMAT = "HH:MM";
DATE_TIME_FORMAT = util.format("%s %s", DATE_FORMAT, TIME_FORMAT);

var render_schedules = function(schedules) {

};

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
    return {
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
}

exports.render_attachment = render_attachment;
exports.render_attachments = render_attachments;