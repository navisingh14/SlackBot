var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

var Botkit = require('botkit');
var config = require('../utilities/config');
var request = require('request');


var credentials = config.client_secret;
var clientSecret = credentials.web.client_secret;
var clientId = credentials.web.client_id;
var redirectUrl = config.redirect_uri;
var auth = new googleAuth();
var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/calendar-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/gmail.readonly'];

var register_user  = function(usr, cb) {
  // Load client secrets from a local file.
  var url = '';
  // Authorize a client with the loaded credentials, then call the
  // Google Calendar API.
  console.log("Slack User : " + usr)
  authorize(usr, function(url){
      console.log("url : " + url);
      return cb(url);
  });
};


/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(user_name, cb) {
  var url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    state: user_name,
    scope: SCOPES
  });
  return cb(url);
};

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
var store_token = function (user_name, token) {
  console.log(user_name);
  console.log(token);
  // TODO: Store in DB --  Mock it.
  console.log('Token stored to db: ' + token);
};

var get_access_tokens = function(access_code, cb) {
  oauth2Client.getToken(access_code, function (err, tokens) {
    // Now tokens contains an access_token and an optional refresh_token. Save them.
    // if (!err) {
    //   oauth2Client.setCredentials(tokens);
    // }
    cb && cb(null, tokens);
  });
}

/**
 * Lists the next 10 events on the user's primary calendar.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents(authclnt) {
  var calendar = google.calendar('v3');
  calendar.events.list({
    auth: authclnt,
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime'
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var events = response.items;
    console.log(response);
    if (events.length == 0) {
      console.log('No upcoming events found.');
    } else {
      console.log('Upcoming 10 events:');
      for (var i = 0; i < events.length; i++) {
        var event = events[i];
        var start = event.start.dateTime || event.start.date;
        console.log('%s - %s', start, event.summary);
      }
    }
  });
};

var get_user_email = function(access_token, expiry_date, cb) {
  var authclnt = new auth.OAuth2(clientId, clientSecret, redirectUrl);
  authclnt.credentials = { 
    access_token: access_token,
    expiry_date: expiry_date 
  };
  var gmail = google.gmail({
    auth: authclnt,
    version: 'v1'
  });
  gmail.users.getProfile({
    auth: authclnt,
    userId: 'me'
    }, function(err, res) {
      if (err) {
        cb && cb(err);
      } else {
        cb && cb(null, res.emailAddress);
      }
  });
}

exports.register_user = register_user;
exports.store_token = store_token;
exports.get_access_tokens = get_access_tokens;
exports.get_user_email =  get_user_email;
