var express = require('express');
var config = require('../utilities/config');
//var register = require('../utilities/register');
var register = require('../mock/register');
var calendar = require('../mock/calendar')
var app = express();
var bot_controller_module = require('../controllers/bot_controller');
var bot_controller = bot_controller_module.controller;
var bot = bot_controller_module.bot;

app.get("/", function(req, res){
    res.send('Hello!! You should not be here');
});

/**
 * Redirect URI from google apis
 */
app.get("/register", function(req, res){
    const {method, url} = req;
    const ind = url.indexOf("code");
    user_name = req.query.state;
    register.store_token(user_name, url.substring(ind+5));
    res.send("Thank You for registering. Please close this window.")
});

/**
 * Delete calendar
 */
app.get("/delete", function(req, res){
    const {method, url} = req;
    user_name = req.query.user;
    channel = req.query.channel;
    meeting_id = req.query.id;
    calender.delete_meeting(meeting_id, user_name, function(err, msg){
        if (err) {
            bot.say({
                'text': 'Oops!! Error occured: ' + err,
                'channel': channel
            });
        } else {
            bot.say({
                'text': msg,
                'channel': channel
            });
            console.log(channel)
        }
        res.send("<script>window.close();</script>");
    });
});


app.listen(config.port, function(){
    console.log('BotBai server listening on port 3000!');
});

exports.controller = app;