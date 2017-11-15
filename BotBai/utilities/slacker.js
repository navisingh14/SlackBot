const util = require('util');
const moment = require('moment');
const buildURL = require('build-url');
const config = require('../utilities/config');
const request = require('request');

DATE_FORMAT = "MM/DD/YYYY";
TIME_FORMAT = "HH:mm";
DATE_TIME_FORMAT = util.format("%s %s", DATE_FORMAT, TIME_FORMAT);


var render_attachments_for_change = function(schedules, user, channel, key) {
    return schedules.map(function(sched){
        var attcmt = render_attachment(sched);
        var url = buildURL(util.format("%s:%s", config.server, config.port),
                    {
                        path: key,
                        queryParams: {
                            user: user,
                            channel: channel,
                            meeting_id: sched.id
                        }
                    });
        attcmt['fields'].push({"title" : util.format("Do you want to %s this?", key), "value" : util.format("<%s|YES>", url)});
        return attcmt;
    });
}

var render_attachments = function(schedules) {
    return schedules.map(function(sched){
        return render_attachment(sched);
    });
}

var render_attachment =  function(schedule) {
    var start_date = moment(schedule.start.dateTime).format(DATE_FORMAT);
    var start_date_time = moment(schedule.start.dateTime).format(DATE_TIME_FORMAT);
    var end_date = moment(schedule.end.dateTime).format(DATE_FORMAT);
    var end_date_time = moment(schedule.end.dateTime).format(DATE_TIME_FORMAT);
    var fallback = util.format("Meeting on %s until %s", start_date_time, end_date_time);
    var title = util.format("Meeting on %s", start_date);
//    var participants = schedule.participants.map(function(ptcpt){ return '@' + ptcpt }).join(", ");
    var summary = schedule.summary;
    var attachment = {
        "fallback" : fallback,
        "title" : title,
        "color" : "#36a64f",
        "fields" : [
            {"title" : "Creator", "value" : schedule.organizer.email, "short": true},
            {"title" : "Starts", "value" : start_date_time, "short": true},
            {"title" : "Ends", "value" : end_date_time, "short": true},
            {"title" : "Summary", "value" : summary, "short" : true},
//            {"title" : "Participants", "value" : participants, "short": true}
        ]
    };
    return attachment;
}

var get_slack_users = function(cb) {
    request.post("https://slack.com/api/users.list", {form: {token: config.slack_token}}, function(err, resp, body){
        body = JSON.parse(body);
        users = {}
        for(var i in body.members) {
          member = body.members[i];
          users[member.id] = member;
        }
        cb && cb(users);
    });
}

var get_slack_user = function(user_id, cb) {
    request.post("https://slack.com/api/users.info", {form: {token: config.slack_token, user: user_id}}, function(err, resp, body){
        if (err) {
            cb && cb(err, null);
            console.error(err);
            return;
        }
        body = JSON.parse(body);
        if (!body.ok) {
            cb && cb(body.error, null);
            console.error(body.error);
            return;
        }
        return cb(null, body.user);
    });
};

exports.render_attachment = render_attachment;
exports.render_attachments = render_attachments;
exports.render_attachments_for_change = render_attachments_for_change;
exports.get_slack_users = get_slack_users;
exports.get_slack_user = get_slack_user;