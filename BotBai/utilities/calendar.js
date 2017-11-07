const config = require('../utilities/config');
const google = require('googleapis');
const googleAuth = require('google-auth-library');
const google_calendar = google.calendar('v3');
const google_auth = new googleAuth();

const credentials = config.client_secret;
const clientSecret = credentials.web.client_secret;
const clientId = credentials.web.client_id;
const redirectUrl = credentials.web.redirect_uris[0];

var delete_meeting = function(meeting_id, user, cb) {
    var auth_client = new google_auth.OAuth2(clientId, clientSecret, redirectUrl);
    auth_client.credentials = {
        access_token: user.access_token,
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

var list_all_meeting = function(usr, cb) {
    var auth_client = new google_auth.OAuth2(clientId, clientSecret, redirectUrl);
    auth_client.credentials = {
        access_token: usr.access_token,
        expiry_date: usr.token_expiry 
    };
    google_calendar.events.list({
        auth: auth_client,
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime'
        }, function(err, response) {
        if (err) {
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
            }
        }
    });
}

exports.delete_meeting = delete_meeting;

// user = new Object()
// user.access_token = "ya29.Glz9BPj--hjNnMIBc_3NIOvcdnXzVhgqvx71Z6i918ZBR6OfNp9PUeGzRrdgeu_bmvyne8GooN-xC24iHE8uypwNpzSph6HV42d03PV5wPP_WG2PYvnLMf31HGdhjg"
// user.token_expiry = 1510082723315;
// meeting_id = "035l4tfo952ogmaeg750ccf2p7"
// list_all_meeting(user)
// delete_meeting(meeting_id, user, function(err, msg){
//     console.error(err);
//     console.log(msg)
// });