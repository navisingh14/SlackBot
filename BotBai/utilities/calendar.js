const config = require('../utilities/config');
const google = require('googleapis');
const googleAuth = require('google-auth-library');
const google_calendar = google.calendar('v3');
const google_auth = new googleAuth();

const credentials = config.client_secret;
const clientSecret = credentials.web.client_secret;
const clientId = credentials.web.client_id;
const redirectUrl = credentials.redirect_uri;
const Schedule = require('../utilities/schedule').Schedule;
const moment = require('moment');
const util = require('util');
const tz = require('moment-timezone');
var User = require('../db/mongo/User');

var delete_meeting = function(meeting_id, user, cb) {
    var auth_client = new google_auth.OAuth2(clientId, clientSecret, redirectUrl);
    auth_client.credentials = {
        access_token: user.token,
        refresh_token: user.refresh_token,
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
    console.log("start time " , start_time);
    console.log("end time ", end_time);
    var auth_client = new google_auth.OAuth2(clientId, clientSecret, redirectUrl);
    auth_client.credentials = {
        access_token: usr.token,
        refresh_token: usr.refresh_token,
        expiry_date: usr.token_expiry 
    };
    meetings = [];
    google_calendar.events.list({
        auth: auth_client,
        calendarId: 'primary',
        timeMin: tz(start_time.timestamp).tz('America/New_York').format(),
        timeMax: tz(end_time.timestamp).tz('America/New_York').format(),
       //timeMin: (new Date()).toISOString(),
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
        refresh_token: user.refresh_token,
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
                summary: 'Botbai Event',
                start: {
                    dateTime: moment(schedule.start.timestamp).format(),
                    timeZone: 'America/New_York'
                },
                end: {
                    dateTime: moment(schedule.end.timestamp).format(),
                    timeZone: 'America/New_York'
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

var update_meeting = function(schedule, user, cb) {
    var auth_client = new google_auth.OAuth2(clientId, clientSecret, redirectUrl);
    auth_client.credentials = {
        access_token: user.token,
        refresh_token: user.refresh_token,
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
                summary: 'Botbai Event',
                start: {
                    dateTime: moment(schedule.start.timestamp).format(),
                    timeZone: 'America/New_York'
                },
                end: {
                    dateTime: moment(schedule.end.timestamp).format(),
                    timeZone: 'America/New_York'
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
            google_calendar.events.update({
                auth: auth_client,
                calendarId: 'primary',
                eventId: schedule.id,
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

var get_meeting = function(meeting_id, user, cb) {
    var auth_client = new google_auth.OAuth2(clientId, clientSecret, redirectUrl);
    auth_client.credentials = {
        access_token: user.token,
        refresh_token: user.refresh_token,
        expiry_date: user.token_expiry 
    };
    google_calendar.events.get({
        auth: auth_client,
        calendarId: 'primary',
        eventId: meeting_id
    }, function(err, event) {
        if (err) {
          cb && cb('There was an error contacting the Calendar service: ' + err, null);
          return;
        }
        Schedule.from_google_json(event, function(err, schedule){
            if (err) {
                cb && cb(err, null);
                return;
            }
            cb && cb(null, schedule);
        });
    });
};

var get_event = function(meeting_id, user, cb) {
    var auth_client = new google_auth.OAuth2(clientId, clientSecret, redirectUrl);
    auth_client.credentials = {
        access_token: user.token,
        refresh_token: user.refresh_token,
        expiry_date: user.token_expiry 
    };
    google_calendar.events.get({
        auth: auth_client,
        calendarId: 'primary',
        eventId: meeting_id
    }, function(err, event) {
        if (err) {
          cb && cb('There was an error contacting the Calendar service: ' + err, null);
          return;
        }
        cb && cb(null, event);
    });
};

var swap_events = function(event1, event2, user, cb) {
    var auth_client = new google_auth.OAuth2(clientId, clientSecret, redirectUrl);
    auth_client.credentials = {
        access_token: user.token,
        refresh_token: user.refresh_token,
        expiry_date: user.token_expiry 
    };
    var new_event1 = clone_event(event1);
    var new_event2 = clone_event(event2);
    new_event1.start = event2.start;
    new_event1.end = event2.end;
    new_event2.start = event1.start;
    new_event2.end = event1.end;
    google_calendar.events.update({
        auth: auth_client,
        calendarId: 'primary',
        eventId: new_event1.id,
        resource: new_event1
    }, function(err, swapped_event1) {
        if (err) {
          console.error(err);
          cb && cb('There was an error contacting the Calendar service: ' + err, null);
          return;
        }
        google_calendar.events.update({
            auth: auth_client,
            calendarId: 'primary',
            eventId: new_event2.id,
            resource: new_event2
        }, function(err, swapped_event2) {
            if (err) {
              console.error(err);
              cb && cb('There was an error contacting the Calendar service: ' + err, null);
              return;
            }
            var msg = util.format('Meetings have been swapped. \nEvent #1: %s \nEvent #2: %s', swapped_event1.htmlLink, swapped_event2.htmlLink)
            cb && cb(null, msg);
        });
    });
};

var clone_event = function(event) {
    return JSON.parse(JSON.stringify(event));
}



exports.create_meeting = create_meeting;
exports.delete_meeting = delete_meeting;
exports.list_meeting = list_meeting;
exports.update_meeting = update_meeting;
exports.get_meeting = get_meeting;
exports.get_event = get_event;
exports.swap_events = swap_events;

// user = new Object()
// user.token = "ya29.GlsCBQUnFigj8u7udew_-eYqaErcclSntDIzxfOhwCw-hDyS4kU3-vE3BdqwocY5KO9o68GMg1bprOL62kAQ7t1qq8Vl3T1UaNFlzwhRpRYa0K80oR7TU5xkOtvF";
// user.refresh_token = "1/s8UW1Wxa7OY9sxuA7NUHBt9feOwzkfWgCpM9gwoGfmw";
// user.token_expiry = 1510537080372;
// meeting_id = "n0e6b213q8bq55k23oqth7cm18"
// // list_meeting(user);
// get_meeting(meeting_id, user, function(err, schedule){
//     console.error(err);
//     console.log(schedule);
// });
// delete_meeting(meeting_id, user, function(err, msg){
//     console.error(err);
//     console.log(msg)
// });
// sched = Schedule.from_json({id: null, intent: 'meeting_set', start: { timestamp: 1510437600000, time_set: true, date_set: true }, end: { timestamp: 1510444800000, time_set: true, date_set: true }, participants: [ 'U7MT7HUMT', 'U7R1F2KM4' ], creator: 'U6WGEDA2G' })
// create_meeting(sched, user, function(err, msg){
//     console.log(msg);
// });