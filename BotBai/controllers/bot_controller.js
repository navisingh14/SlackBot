var Botkit = require('botkit');
var config = require('../utilities/config');
var google = require('../quickstart.js');




var controller = Botkit.slackbot({
  debug: false
});

controller.spawn({
  token: config.slack_token,
}).startRTM();


var res = google.start();


controller.hears('hello',['mention', 'direct_mention','direct_message'], function(bot,message) {
	var source_user = bot.get_source_user(message);
	console.log(source_user);
	bot.reply(message, res);
});

controller.hears('my token',['mention', 'direct_mention','direct_message'], function(bot,message) {
  bot.reply(message, "no!!");
});




module.exports = controller;
