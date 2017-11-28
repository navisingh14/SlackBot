var Botkit = require('botkit');
var config = require('../utilities/config');
var slacker = require('../utilities/slacker');
var shorten = require('../utilities/shortner');
var request = require('request');
var nlp = require('../utilities/nlp');
var http = require("http");
var moment = require('moment');
const { URL, URLSearchParams } = require('url');
const Schedule = require('../utilities/schedule').Schedule;
const DateTime = require('../utilities/schedule').DateTime;
var reg, calendar;
if (config.mode == "production") {
  // TODO: change to utilities in service milestone
  reg = require('../utilities/register');
  calendar = require('../utilities/calendar');   
} else {
  reg = require('../utilities/register');
  calendar = require('../utilities/calendar');   
}
var User = require('../db/mongo/User');

var controller = Botkit.slackbot({
  debug: false
});

const cache = {}

var root_bot = controller.spawn({
  token: config.slack_token,
}).startRTM();

controller.hears('hello',['mention', 'direct_mention','direct_message'], function(bot,message) {
	var source_user = controller.get_source_user(message);
  console.log(source_user);
  console.log(message);
	bot.reply(message, "hi");
});

// create a meeting
controller.hears(".*", ['mention', 'direct_mention','direct_message'], function(bot,message) {
  nlp.parse(message.text, function(schedule){
    var source_user = controller.get_source_user(message); 
    var user_cache = cache[controller.get_source_user(message)];
    if (schedule.participants.indexOf(source_user) >= 0) {
      schedule.participants.splice(schedule.participants.indexOf(source_user), 1);
    }
    console.log(schedule)
    User.user_exists(source_user, function(err, is_user){
      if (err) {
        bot.reply(message, "Error: " + err);
      } else if (!is_user && schedule.intent != nlp.I_SIGN_UP) {
        bot.reply(message, "You have not registered. Please register!");
        return;
      } else if (user_cache && user_cache['editing']) {
               
        if (schedule.intent != nlp.I_ABANDON && (schedule.intent == nlp.I_YES || user_cache.schedule.intent == nlp.I_MEETING_SET)) {
          schedule.intent = nlp.I_MEETING_SET;
          process_schedule(schedule, message, bot);
        } else {
          bot.reply(message, "Cancelling edit!")
          delete cache[message.user];
        }
      } else if (schedule.intent == nlp.I_SIGN_UP) {
        if (is_user) {
          bot.reply(message, "You have already registered.");
        } else {
          reg.register_user(source_user, function(url) {
            bot.reply(message, url);
            // shorten(url, function(err, shortened) {
            //   if (err) {
            //     console.error(err);
            //     bot.reply(message, url);
            //   } else {
            //     bot.reply(message, shortened);
            //   }
            // });
          });
        }
      } else {
        process_schedule(schedule, message, bot);
      }
    });
  });
});

var get_date_timestamp = function(unix_time) {
  return moment(moment(unix_time).format("MM/DD/YYYY")).unix()*1000;
}

var get_time_timestamp = function(unix_time) {
  return unix_time - moment(unix_time).subtract(0, "days").startOf('day').unix()*1000;
}

var update_schedule = function(schedule, user_cache) {
  if (user_cache && user_cache.schedule) {
    var cached_schedule = user_cache.schedule;
    var status = user_cache.status;
    schedule.id = cached_schedule.id;
    schedule.intent = schedule.intent || cached_schedule.intent;
    if (!status || (status!="StartTime" && status !="EndTime")) {
      if (!cached_schedule.start || !cached_schedule.start.time_set){
        schedule.start = schedule.start || cached_schedule.start;
        schedule.end = schedule.end || cached_schedule.end;
      } else {
        schedule.end = schedule.end || cached_schedule.end || schedule.start;
        schedule.start = cached_schedule.start;
      }
    } else if (status == "StartTime") {
      // schedule.start = Process date from cached and time from uncached
      if (schedule.start) {
        schedule.start.timestamp = get_date_timestamp(cached_schedule.start.timestamp) +  get_time_timestamp(schedule.start.timestamp);
        schedule.start.date_set = true;
        schedule.start.time_set = true;
      } else {
        schedule.start = cached_schedule.start;
      }
    } else if (status == "EndTime") {
      // schedule.end = Process date from cached and time from uncached
      if (schedule.start) {
        schedule.end = new DateTime()
        schedule.end.timestamp = get_date_timestamp(cached_schedule.end.timestamp) +  get_time_timestamp(schedule.start.timestamp);
        schedule.end.date_set = true;
        schedule.end.time_set = true;
      } else {
        schedule.end = cached_schedule.end;
      }
      schedule.start = cached_schedule.start;
    }
    if (cached_schedule.participants && cached_schedule.participants.length) {
      schedule.participants = cached_schedule.participants;  
    }
    
  }
  return schedule;
};

var process_schedule = function(schedule, message, bot){
  schedule = update_schedule(schedule, cache[message.user]);
  if (schedule.intent == nlp.I_MEETING_SET) {
    // Save in cache
    status = cache[message.user] && cache[message.user]["status"]
    cache[message.user] = {"schedule":schedule, editing: cache[message.user] && cache[message.user]["editing"]}
    if (status) {
      cache[message.user]["status"] = status;
    }
    // Validate Start
    if (schedule.start == null) {
      cache[message.user]["status"] = "Start";
      bot.reply(message, "When do you want to start the meeting?");    
    } else if (!schedule.start.date_set) {
      cache[message.user]["status"] = "StartDate";
      bot.reply(message, "Which day would do you want to start the meeting?");    
    } else if  (!schedule.start.time_set) {
      cache[message.user]["status"] = "StartTime";
      bot.reply(message, "What time would do you like to start the meeting?");
    } else if (schedule.end == null) {
      cache[message.user]["status"] = "End";
      bot.reply(message, "When do you want to finish the meeting?");    
    } else if (!schedule.end.date_set) {
      cache[message.user]["status"] = "EndDate";
      bot.reply(message, "Which day would do you want to end the meeting?");    
    } else if  (!schedule.end.time_set) {
      cache[message.user]["status"] = "EndTime";
      bot.reply(message, "What time would do you like to finish the meeting?");
    } else if  (schedule.end.timestamp <= schedule.start.timestamp) {
      cache[message.user]["status"] ="EndTimeInvalid";
      cache[message.user]["schedule"].end = null;
      bot.reply(message, "The meeting cannot finish before it starts. What time would do you like to finish the meeting?");
    } else if (!schedule.participants || !schedule.participants.length) {
      if (cache[message.user]["status"] == "Participants") {
        bot.reply(message, "They are not valid participants.");
      } else {
        cache[message.user]["status"] = "Participants";
        bot.reply(message, "Whom would you like to invite?");
      }
    } else {
      // TODO: Schedule meeting -- Call Calendar API.
      // Mock api
      schedule.creator = message.user;
      User.get_by_slack_id(message.user, function(err, user){
        if (err) {
          bot.reply(message, "Oops! Error occurred: " + err);
        } else {

          if(cache[message.user] && cache[message.user]['editing']) {
            calendar.update_meeting(schedule, user, function(err, reply) {
              if(err) {
                bot.reply(message, "Oops! Error occured: " + err);
              } else {
                bot.reply(message, reply);
              }
            });
          } else {
            calendar.create_meeting(schedule, user, function(err, reply) {
              if(err) {
                bot.reply(message, "Oops! Error occured: " + err);
              } else {
                bot.reply(message, reply);
              }
            });
          }
        }
        delete cache[message.user];
      });
     // bot.reply(message, "Meeting will be scheduled soon");
      
    }
  } else if (schedule.intent == nlp.I_MEETING_UNSET) {
    // TODO: Unset meeting. Follow steps from above here
    cache[message.user] = {"schedule":schedule};
    var start = moment().unix()*1000;
    if (schedule.start == null) {
      cache[message.user]["status"] = "Start";
      bot.reply(message, "What duration do you want to see the calendar for to choose a meeting to delete?");    
    } else if (!schedule.start.date_set) {
      cache[message.user]["status"] = "StartDate";
      bot.reply(message, "Which day would you want to delete the meeting?");    
    } else if  (!schedule.start.time_set) {
      cache[message.user]["status"] = "StartTime";
      bot.reply(message, "Do you have a time-frame in mind?");
    } else if (schedule.end == null) {
      cache[message.user]["status"] = "End";
      bot.reply(message, "Till what time do you want me to check the calendars for?");    
    } else if (!schedule.end.date_set) {
      cache[message.user]["status"] = "EndDate";
      bot.reply(message, "Till which day would do you want me to check the meeting?");    
    } else if  (!schedule.end.time_set) {
      cache[message.user]["status"] = "EndTime";
      bot.reply(message, "Till what time?");
    } else {
      User.get_by_slack_id(message.user, function(err, user){
        if (err) {
          bot.reply(message, "Oops! Error occurred: " + err);
        } else {
          calendar.list_meeting(user, schedule.start, schedule.end, function(meetings){
              if (meetings.length == 0)
                bot.reply(message, "You do not have any scheduled meeting or you're not the creator of the meeting");
              else {
                var mssg = {
                  username: 'BotBai', 
                  text: 'Which of these meetings would you want to remove?',
                  attachments: slacker.render_attachments_for_change(meetings, message.user, message.channel, "delete")
                }
                bot.reply(message, mssg);
              }
              delete cache[message.user];
          });
        }
      });
    }
  } else if (schedule.intent == nlp.I_LIST) {
    console.log("inside list");
    console.log("\n message user = " + message.user + "\n" + cache + cache[message.user]);
    // TODO: listing all the meetings
    cache[message.user] = {"schedule":schedule};
    if (schedule.start == null) {
      cache[message.user]["status"] = "Start";
      bot.reply(message, "What day would you like to list the meetings for?");    
    } else if (!schedule.start.date_set) {
      cache[message.user]["status"] = "StartDate";
      bot.reply(message, "Which day would you want to start the meeting?");    
    } else if  (!schedule.start.time_set) {
      cache[message.user]["status"] = "StartTime";
      bot.reply(message, "Do you have a time-frame in mind?");
    } else if (schedule.end == null) {
      cache[message.user]["status"] = "End";
      bot.reply(message, "Till what time do you want me to check the calendars for?");    
    } else if (!schedule.end.date_set) {
      cache[message.user]["status"] = "EndDate";
      bot.reply(message, "Till which day would do you want me to check the meeting?");    
    } else if  (!schedule.end.time_set) {
      cache[message.user]["status"] = "EndTime";
      bot.reply(message, "Till what time?");
    } else {
      console.log("Meeting will be listed soon");
      User.get_by_slack_id(message.user, function(err, user){
        if (err) {
          bot.reply(message, "Oops! Error occurred: " + err);
        } 
        else {
          calendar.list_meeting(user, schedule.start, schedule.end, function(meetings){
              if (meetings.length == 0)
                bot.reply(message, "You do not have any scheduled meeting or you're not the creator of the meeting");
              else {
                var mssg = {
                  username: 'BotBai', 
                  text: 'Here is a list of meetings',
                  attachments: slacker.render_attachments(meetings)
                }
                bot.reply(message, mssg);
              }
            delete cache[message.user];
          });
        };
     // bot.reply(message, "Meeting will be scheduled soon");
     });
  }
} else if (schedule.intent == nlp.I_MEETING_MODIFY) {
    cache[message.user] = {"schedule":schedule};

    if (schedule.start == null) {
      cache[message.user]["status"] = "Start";
      bot.reply(message, "What day would you like to modify the meetings for?");    
    } else if (!schedule.start.date_set) {
      cache[message.user]["status"] = "StartDate";
      bot.reply(message, "Which day would you want to start modifying the meeting?");    
    } else if  (!schedule.start.time_set) {
      cache[message.user]["status"] = "StartTime";
      bot.reply(message, "Do you have a time-frame in mind?");
    } else if (schedule.end == null) {
      cache[message.user]["status"] = "End";
      bot.reply(message, "Till what time do you want me to check the calendars for?");    
    } else if (!schedule.end.date_set) {
      cache[message.user]["status"] = "EndDate";
      bot.reply(message, "Which day would do you want to end the meeting?");    
    } else if  (!schedule.end.time_set) {
      cache[message.user]["status"] = "EndTime";
      bot.reply(message, "When would do you like to finish the meeting?");
    } else {
      console.log("Meeting will be modified soon");
      console.log(message.user);
      User.get_by_slack_id(message.user, function(err, user){
        if (err) {
          bot.reply(message, "Oops! Error occurred: " + err);
        } 
        else {
          calendar.list_meeting(user, schedule.start, schedule.end, function(meetings){
              if (meetings.length == 0)
                bot.reply(message, "You do not have any scheduled meeting or you're not the creator of the meeting");
              else {
                var mssg = {
                  username: 'BotBai', 
                  text: 'Please select meeting to modify',
                  attachments: slacker.render_attachments_for_change(meetings, message.user, message.channel, "update")
                }
                bot.reply(message, mssg);
              }
            delete cache[message.user];
          });
        };
     });
    }
  } else if(schedule.intent == "abandon"){
    delete cache[message.user];
  }
};

controller.get_source_user = function(message) {
  return message.user;
}

controller.get_users = function (cb){
  request.post("https://slack.com/api/users.list", {form: {token: config.slack_token}}, function(err, resp, body){
    body = JSON.parse(body);
    users = {}
    for(var i in body.members) {
      member = body.members[i];
      users[member.id] = member;
    }
    cb && cb(users);
  });
}

controller.set_cache = function(usr, obj) {
  cache[usr] = obj;
};

controller.get_cache = function(usr) {
  return cache[usr];
}

exports.bot = root_bot;
exports.controller = controller;
