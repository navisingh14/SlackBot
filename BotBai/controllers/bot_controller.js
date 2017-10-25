var Botkit = require('botkit');
var config = require('../utilities/config');
var slacker = require('../utilities/slacker');
var request = require('request');
var nlp = require('../utilities/nlp');
//var reg = require('../utilities/register');
var http = require("http");
var mock_schedules = require("../mock/json/schedule.json");
var calendar = require("../mock/calendar");
var reg = require('../mock/register');
var moment = require('moment');
const { URL, URLSearchParams } = require('url');

var controller = Botkit.slackbot({
  debug: false
});

const cache = {}

var root_bot = controller.spawn({
  token: config.slack_token,
}).startRTM();

controller.on('interactive', function(bot, message){
  console.log(message);
});

controller.hears('hello',['mention', 'direct_mention','direct_message'], function(bot,message) {
	var source_user = controller.get_source_user(message);
  console.log(source_user);
  console.log(message);
	bot.reply(message, "hi");
});

// create a meeting
controller.hears(".*", ['mention', 'direct_mention','direct_message'], function(bot,message) {
  nlp.parse(message.text, function(schedule){
    console.log(schedule);
    user_cache = cache[controller.get_source_user(message)];
    if (user_cache && user_cache['editing']) {
      if (schedule.intent == nlp.I_YES) {
        process_schedule(user_cache.schedule, message, bot);
      } else {
        bot.reply(message, "Cancelling edit!!")
        delete cache[message.user];
      }
    } else if (schedule.intent == nlp.I_SIGN_UP) {
      console.log(bot);
      bot.reply(message, "Registering you!!");
      var source_user = controller.get_source_user(message);
      console.log("\n\n user is " + source_user + "\n\n");
      // TODO - Check if user is in DB.
      reg.register_user(source_user, function(url) {
            bot.reply(message, url);
      });
    } else {
      process_schedule(schedule, message, bot);
    }
  });
});

var update_schedule = function(schedule, user_cache) {
  if (user_cache && user_cache.schedule) {
    // console.log("Input")
    // console.log(schedule)
    var cached_schedule = user_cache.schedule;
    schedule.intent = schedule.intent || cached_schedule.intent;
    if (!cached_schedule.start || !cached_schedule.start.time_set){
      schedule.start = schedule.start || cached_schedule.start;
      schedule.end = schedule.end || cached_schedule.end;
    } else {
      schedule.end = schedule.end || cached_schedule.end || schedule.start;
      schedule.start = cached_schedule.start;
    }
    // schedule.start = schedule.start || cached_schedule.start;
    // schedule.end = schedule.end || cached_schedule.end || cached_schedule.start;
    schedule.participants = schedule.participants || cached_schedule.participants;
  }
  return schedule;
};

var process_schedule = function(schedule, message, bot){
  schedule = update_schedule(schedule, cache[message.user]);
  if (schedule.intent == nlp.I_MEETING_SET) {
    // Save in cache
    cache[message.user] = {"schedule":schedule};
    // Validate Start
    if (schedule.start == null) {
      cache[message.user]["status"] == "Start";
      bot.reply(message, "When do you want to start the meeting?");    
    } else if (!schedule.start.date_set) {
      cache[message.user]["status"] == "StartDate";
      bot.reply(message, "Which day would do you want to start the meeting?");    
    } else if  (!schedule.start.time_set) {
      cache[message.user]["status"] == "StartTime";
      bot.reply(message, "When would do you like to start the meeting?");
    } else if (schedule.end == null) {
      cache[message.user]["status"] == "End";
      bot.reply(message, "When do you want to finish the meeting?");    
    } else if (!schedule.end.date_set) {
      cache[message.user]["status"] == "EndDate";
      bot.reply(message, "Which day would do you want to end the meeting?");    
    } else if  (!schedule.end.time_set) {
      cache[message.user]["status"] == "EndTime";
      bot.reply(message, "When would do you like to finish the meeting?");
    } else if (!schedule.participants || !schedule.participants.length) {
      cache[message.user]["status"] == "Participants";
      bot.reply(message, "Whom would you like to invite?");
    } else {
      // TODO: Schedule meeting -- Call Calendar API.
      // Mock api
      calendar.create_meeting(schedule, function(reply) {
        if(reply.status) {
          bot.reply(message, "Meeting will be scheduled soon");
        } else {
          bot.reply(message, "Meeting can't be scheduled");
        }
      });
     // bot.reply(message, "Meeting will be scheduled soon");
      delete cache[message.user];
    }
  } else if (schedule.intent == nlp.I_MEETING_UNSET) {
    // TODO: Unset meeting. Follow steps from above here
    cache[message.user] = {"schedule":schedule};
    var start = moment().unix()*1000;
    if (schedule.start != null) {
      start = schedule.start.timestamp;
    }
    var meetings = calendar.list_meetings();
    console.log(meetings);
    var mssg = {
      username: 'BotBai', 
      text: 'Which of these meetings would you want to remove?',
      attachments: slacker.render_attachments_for_change(meetings, message.user, message.channel, "delete")
    }
    bot.reply(message, mssg);
  } else if (schedule.intent == nlp.I_LIST) {
    console.log("inside list");
    console.log("\n message user = " + message.user + "\n" + cache + cache[message.user]);
    // TODO: listing all the meetings
    cache[message.user] = {"schedule":schedule};
    if (schedule.start == null) {
      cache[message.user]["status"] == "Start";
      bot.reply(message, "What day would you like to list the meetings for?");    
    } else if (!schedule.start.date_set) {
      cache[message.user]["status"] == "StartDate";
      bot.reply(message, "Which day would do you want to start the meeting?");    
    } else if  (!schedule.start.time_set) {
      cache[message.user]["status"] == "StartTime";
      bot.reply(message, "Do you have a time-frame in mind?");
    } else if (schedule.end == null) {
      cache[message.user]["status"] == "End";
      bot.reply(message, "Till what time do you want me to check the calendars for?");    
    } else if (!schedule.end.date_set) {
      cache[message.user]["status"] == "EndDate";
      bot.reply(message, "Which day would do you want to end the meeting?");    
    } else if  (!schedule.end.time_set) {
      cache[message.user]["status"] == "EndTime";
      bot.reply(message, "When would do you like to finish the meeting?");
    } else {
      console.log("Meeting will be listed soon");
      var meetings = calendar.list_meetings(message.user, schedule.start, schedule.end);
      var mssg = {
        username: "botbai", 
        text: 'Here is the list of meetings',
        attachments: slacker.render_attachments(meetings)
      }
      console.log(slacker.render_attachment(meetings[0]))
      bot.reply(message, mssg);
      delete cache[message.user];
    };
     // bot.reply(message, "Meeting will be scheduled soon");
  } else if (schedule.intent == nlp.I_MEETING_MODIFY) {
    cache[message.user] = {"schedule":schedule};
    var start = moment().unix()*1000;
    if (schedule.start != null) {
      start = schedule.start.timestamp;
    }
    var meetings = calendar.list_meetings();
    var mssg = {
      username: 'BotBai', 
      text: 'Which of these meetings would you want to modify?',
      attachments: slacker.render_attachments_for_change(meetings, message.user, message.channel, "update")
    }
    bot.reply(message, mssg);
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

