var mongoose = require('./mongo').db;

var userSchema = new mongoose.Schema({
  slack_id: {type: String, unique: true},
  user_name: {type: String, unique: true},
  email: {type: String, unique: true},
  token: {type: String, unique: true},
  token_expiry : {type: Number},
  name: {type: String},
});

module.exports = mongoose.model('User', userSchema);
