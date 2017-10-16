var Botkit = require('botkit');
var config = require('../utilities/config');

var controller = Botkit.slackbot({
  debug: false
});

controller.spawn({
  token: config.slack_token,
}).startRTM();

controller.hears('hello',['mention', 'direct_mention','direct_message'], function(bot,message) {
  bot.reply(message, "Aila!!");
});

module.exports = controller;
