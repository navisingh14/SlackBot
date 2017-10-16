var db = require('./db/mongo/mongo').db;
var config = require('./utilities/config');
var controller = require('./controllers/bot_controller')

// var controller = Botkit.slackbot({
//   debug: false
// });
// connect the bot to a stream of messages
// controller.spawn({
//   token: config.slack_token,
// }).startRTM();
//
// // give the bot something to listen for.
// //controller.hears('string or regex',['direct_message','direct_mention','mention'],function(bot,message) {
// controller.hears('hello',['mention', 'direct_mention','direct_message'], function(bot,message) {
//   console.log(message);
//   bot.reply(message,"Aila!!");
// });
