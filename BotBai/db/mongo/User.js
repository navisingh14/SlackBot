const mongoose = require('./mongo').db;

const userSchema = new mongoose.Schema({
  slack_id: {type: String, unique: true},
  user_name: {type: String, unique: true},
  email: {type: String, unique: true},
  token: {type: String, unique: true},
  token_expiry : {type: Number},
  name: {type: String},
});

const User = mongoose.model('User', userSchema);

User.user_exists = function(slack_id, cb) {
  User.findOne({slack_id: slack_id}, function(err, user){
    if (err) {
      cb && cb(err, null);
    } else {
      console.log(user!=null);
      cb && cb(null, user!=null);
    }
  });
};

module.exports = User;
