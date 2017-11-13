var express = require('express');
var config = require('../utilities/config');
var Schedule = require('../utilities/schedule').Schedule;
var register, calendar;
if (config.mode == "production") {
    // TODO: change to utilities in service milestone
    register = require('../utilities/register');
    calendar = require('../mock/calendar');
} else {
    register = require('../utilities/register');
    calendar = require('../utilities/calendar');   
}
var slacker = require('../utilities/slacker');
var User = require('../db/mongo/User');

var app = express();
var bot_controller_module = require('../controllers/bot_controller');
var nlp = require('../utilities/nlp');
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
    user_id = req.query.state;
    // register.store_token(user_name, url.substring(ind+5));
    register.get_access_tokens(url.substring(ind+5), function(err, tokens){
        register.get_user_email(tokens.access_token, tokens.expiry_date, function(err, email){
            console.log("Email : " + email);
            slacker.get_slack_user(user_id, function(err, slack_user) {
                if (err) {
                    console.error(err)
                    return;
                }
                var user = new User({
                    slack_id: user_id,
                    user_name: slack_user.name,
                    email: email,
                    token: tokens.access_token,
                    refresh_token: tokens.refresh_token,
                    token_expiry: tokens.expiry_date,
                    name: slack_user.real_name
                });
                user.save(function(err){
                    if (err) {
                        res.send(err)
                    } else {
                        res.send("Thanks for registering. Please close this window");
                    }
                });
            })
        });
    });
});

/**
 * Delete calendar
 */
app.get("/delete", function(req, res){
    const {method, url} = req;
    slack_id = req.query.user;
    channel = req.query.channel;
    meeting_id = req.query.meeting_id;
    User.get_by_slack_id(slack_id, function(err, user) {
        res.send("<script>window.close();</script>");
        if (err) {
            bot.say({
                'text': 'Oops!! Error occured: ' + err,
                'channel': channel
            });
            return;
        }
        calendar.delete_meeting(meeting_id, user, function(err, msg){
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
            }
        });
    })
    
});

app.get("/update", function(req, res){
    const {method, url} = req;
    user_name = req.query.user;
    channel = req.query.channel;
    meeting_id = req.query.meeting_id;
    var new_meeting = new Schedule();
    new_meeting.id = meeting_id;
    // new_meeting.intent = nlp.I_MEETING_SET;
    User.get_by_slack_id(user_name, function(err, user) {
        res.send("<script>window.close();</script>");
        if (err) {
            bot.say({
                'text': "Error!! : " + err,
                'channel': channel    
            });
            return;
        }
        calendar.get_meeting(meeting_id, user, function(err, schedule){
            if (err) {
                bot.say({
                    'text': "Error!! : " + err,
                    'channel': channel    
                });
                return;
            }
            console.log(schedule);
            bot_controller.set_cache(user_name, {"schedule": new_meeting, "editing": true});
            bot.say({
                'text': "Are you sure you would like to change this meeting?",
                'channel': channel
            });
        });
    });
});



app.listen(config.port, function(){
    console.log('BotBai server listening on port 3000!');
});

exports.controller = app;