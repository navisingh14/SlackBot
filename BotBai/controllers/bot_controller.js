var Botkit = require('botkit');
var config = require('../utilities/config');
var request = require('request');

var controller = Botkit.slackbot({
  debug: false
});

controller.spawn({
  token: config.slack_token,
}).startRTM();

controller.hears('hello',['mention', 'direct_mention','direct_message'], function(bot,message) {
  console.log(message);
  bot.reply(message, "Aila!!");
});

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
