var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var sinon = require('sinon');
var config = require('../utilities/config');
var Botkit = require('botkit');
var config = require('../utilities/config');
var request = require('request');
var store = require('store');
var register_mock = sinon.mock(require('../utilities/register'));

var register_user  = function(usr, cb) {
  if (config.mode == "production") {
    register_mock.expects("register_user").withArgs(usr, cb).returns(cb("https://accounts.google.com/o/oauth2/auth?access_type=offline&state=U7KA4MQ4V&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar.readonly&response_type=code&client_id=991892021862-ghhjeae3n671mlu6v8b0omlemi87o76b.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Fec2-54-183-96-241.us-west-1.compute.amazonaws.com%3A3000%2Fregister"));
  } else {
    register_mock.expects("register_user").withArgs(usr, cb).returns(cb("https://accounts.google.com/o/oauth2/auth?access_type=offline&state=U7KA4MQ4V&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar.readonly&response_type=code&client_id=991892021862-ghhjeae3n671mlu6v8b0omlemi87o76b.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fregister"));
  }
  return register_mock.register_user(usr, cb);
};


/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
var store_token = function (user_name, token) {
  return "Token stored";
};

/**
 * Lists the next 10 events on the user's primary calendar.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents(auth) {
  
};

exports.register_user = register_user;
exports.store_token = store_token;