const config = require('../utilities/config');
const google = require('googleapis');
const googleAuth = require('google-auth-library');
const google_calendar = google.calendar('v3');
const google_auth = new googleAuth();

const credentials = config.client_secret;
const clientSecret = credentials.web.client_secret;
const clientId = credentials.web.client_id;
const redirectUrl = credentials.web.redirect_uris[0];
const Schedule = require('../utilities/schedule').Schedule;
const moment = require('moment');
const tz = require('moment-timezone');
var User = require('../db/mongo/User');

var delete_meeting = function(meeting_id, user, cb) {
    var auth_client = new google_auth.OAuth2(clientId, clientSecret, redirectUrl);
    auth_client.credentials = {
        access_token: user.token,
        expiry_date: user.token_expiry 
    };
    google_calendar.events.delete({
        auth: auth_client,
        calendarId: 'primary',
        eventId: meeting_id
    }, function(err, resp){
        if (err) {
            cb && cb(err, null);
            return;
        }
        cb(null, "Successfully deleted meeting");
    });
};

var list_meeting = function(usr, start_time, end_time, cb) {
    var auth_client = new google_auth.OAuth2(clientId, clientSecret, redirectUrl);
    auth_client.credentials = {
        access_token: usr.token,
        expiry_date: usr.token_expiry 
    };
    meetings = [];
    google_calendar.events.list({
        auth: auth_client,
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        //timeMax: (),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime'
        }, function(err, response) {
        if (err) {
            console.log('inside error');
            console.log(err)
            return;
        }
        var events = response.items;

        if (events.length == 0) {
            console.log('No upcoming events found.');
        } else {
            console.log('Upcoming 10 events:');
            for (var i = 0; i < events.length; i++) {
                var event = events[i];
                var start = event.start.dateTime || event.start.date;
                console.log('%s: %s - %s', event.id, start, event.summary);
                var meeting = event + start + event.summary;
                meetings.push(event);
            }
        }
        cb && cb(meetings);
    });

}


var create_meeting = function(schedule, user, cb) {
    var auth_client = new google_auth.OAuth2(clientId, clientSecret, redirectUrl);
    console.log(user);
    auth_client.credentials = {
        access_token: user.token,
        expiry_date: user.token_expiry 
    };
    User.get_emails(schedule.participants, function(err, users){
        if (err) {
            cb && cb(err, null);
        } else {
            emails = users.map(function(user){
                return {'email': user.email};
            });
            var event = {
                // summary: 'Google I/O 2015',
                start: {
                    dateTime: moment(schedule.start.timestamp).format(),
                    timeZone: tz.tz.guess()
                },
                end: {
                    dateTime: moment(schedule.end.timestamp).format(),
                    timeZone: tz.tz.guess()
                },
                attendees: emails,
                reminders: {
                    'useDefault': false,
                    'overrides': [
                      {'method': 'email', 'minutes': 60},
                      {'method': 'popup', 'minutes': 10},
                    ],
                  },
            }
            google_calendar.events.insert({
                auth: auth_client,
                calendarId: 'primary',
                resource: event
            }, function(err, event) {
                if (err) {
                    console.error(err);
                  cb && cb('There was an error contacting the Calendar service: ' + err, null);
                  return;
                }
                cb && cb(null, ('Event created: %s', event.htmlLink));
            });
        }
    });
};


exports.create_meeting = create_meeting;
exports.delete_meeting = delete_meeting;
exports.list_meeting = list_meeting;

// user = new Object()
// user.token = "ya29.GlwBBTWXu6TvVxKBICFh8mVjHDOCl-4qXF2fX4gWja8GE0kEGtzoeMVGSslHy1wRKlDZ4GUoZjhNNqqb0UofwSh-qqzYdyv_Q9XremX2MA1kl_zxSxk3eqXczjZGLg"
// user.token_expiry = 1510378823843;
// meeting_id = "035l4tfo952ogmaeg750ccf2p7"
// list_all_meeting(user)
// delete_meeting(meeting_id, user, function(err, msg){
//     console.error(err);
//     console.log(msg)
// });
// sched = Schedule.from_json({id: null, intent: 'meeting_set', start: { timestamp: 1510437600000, time_set: true, date_set: true }, end: { timestamp: 1510444800000, time_set: true, date_set: true }, participants: [ 'U7MT7HUMT', 'U7R1F2KM4' ], creator: 'U6WGEDA2G' })
// create_meeting(sched, user, function(err, msg){
//     console.log(msg);
// });