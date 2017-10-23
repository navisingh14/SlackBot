var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

var Botkit = require('botkit');
var config = require('../utilities/config');
var request = require('request');

var controller = Botkit.slackbot({
  debug: false
});

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/calendar-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

var register_user  = function(usr, cb){
  // Load client secrets from a local file.
  var url = '';
    // Authorize a client with the loaded credentials, then call the
    // Google Calendar API.
    authorize(usr, config.client_secret, function(url){
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
function authorize(user_name, credentials, cb) {
  var clientSecret = credentials.web.client_secret;
  var clientId = credentials.web.client_id;
  var redirectUrl = credentials.web.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
  var url = getNewToken(oauth2Client, user_name);
  return cb(url);
};

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, user_name) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    state: user_name,
    scope: SCOPES
  });
//console.log('Authorize this app by visiting this url: ', authUrl);
//  bot.reply('Please allow this bot to access your calendar: ' + authUrl);
  return authUrl;
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

/**
 * Lists the next 10 events on the user's primary calendar.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents(auth) {
  var calendar = google.calendar('v3');
  calendar.events.list({
    auth: auth,
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

exports.register_user = register_user;
exports.store_token = store_token;