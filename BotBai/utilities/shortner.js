const google = require('googleapis');
const urlshortener = google.urlshortener('v1');
const googleAuth = require('google-auth-library');
const config = require('../utilities/config');

var shorten = function(long_url, callback) {
    // var authclnt = new auth.OAuth2(clientId, clientSecret, redirectUrl);
    // authclnt.apiKey = config.api_key;
    // console.log(long_url)
    urlshortener.url.insert({resource: {longUrl: long_url}, key: config.api_key}, function(err, resp){
        console.error(err);
        console.log(resp);
        if (err) {
            callback && callback(err, null);
        } else {
            callback && callback(null, resp.id);
        }
    });
}

module.exports = shorten;
shorten("https://accounts.google.com/o/oauth2/auth?access_type=offline&state=U6WGEDA2G&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fgmail.readonly&response_type=code&client_id=991892021862-ghhjeae3n671mlu6v8b0omlemi87o76b.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fregister")