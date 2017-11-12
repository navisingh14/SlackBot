const google = require('googleapis');
const urlshortener = google.urlshortener('v1');
const googleAuth = require('google-auth-library');
const config = require('../utilities/config');

var shorten = function(long_url, callback) {
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
