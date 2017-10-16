var mongoose = require('./mongo').mongoose;

var userSchema = new mongoose.Schema({
  user_name: {type: String, unique: true},
  email: {type: String, unique: true},
  token: {type: String, unique: true},
  name: {type: String},
});

module.exports = mongoose.model('User', userSchema);
