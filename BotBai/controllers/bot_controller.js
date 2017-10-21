var Botkit = require('botkit');
var config = require('../utilities/config');
var request = require('request');
var nlp = require('../utilities/nlp');

var controller = Botkit.slackbot({
  debug: false
});

const cache = {}

controller.spawn({
  token: config.slack_token,
}).startRTM();

controller.hears('hello',['mention', 'direct_mention','direct_message'], function(bot,message) {
  console.log(message);
  bot.reply(message, "Aila!!");
});

controller.hears(".*", ['mention', 'direct_mention','direct_message'], function(bot,message) {
  // console.log(message);

  nlp.parse(message.text, function(schedule){
    // console.log(schedule)
    process_schedule(schedule, message, bot);
    // bot.reply(message, "Coming Soon ....");
  });
});

var update_schedule = function(schedule, user_cache) {
  if (user_cache && user_cache.schedule) {
    console.log("Input")
    console.log(schedule)
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
  if (schedule.intent == "meeting_set") {
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
      console.log("Meeting will be scheduled soon");
      // TODO: Schedule meeting -- Call Calendar API.
      bot.reply(message, "Meeting will be scheduled soon");
      delete cache[message.user];
    }
  } else if (schedule.intent == "meeting_unset") {
    // TODO: Unset meeting. Follow steps from above here
  }

  // console.log(cache);
};

controller.get_users = function (cb){
  request.post("https://slack.com/api/users.list", {form: {token: config.slack_token}}, function(err, resp, body){
    body = JSON.parse(body);
    users = {}
    for(var i in body.members) {
      member = body.members[i];
      users[member.id] = member;
    }
    cb && cb(users);
    // console.log(users);
  });
}
module.exports = controller;
