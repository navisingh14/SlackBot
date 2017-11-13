const mongoose = require('./mongo').db;

const userSchema = new mongoose.Schema({
  slack_id: {type: String, unique: true},
  user_name: {type: String, unique: true},
  email: {type: String, unique: true},
  token: {type: String, unique: true},
  refresh_token: {type: String, unique: true},
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

User.get_by_slack_id = function(slack_id, cb) {
  User.findOne({slack_id: slack_id}, function(err, user){
    if (err) {
      cb && cb(err, null);
    } else {
      cb && cb(null, user);
    }
  });
};


User.get_all_handles = function(cb) {
  User.find({}, function(err, users){
    if (err) {
      cb && cb(err, null);
    } else {
      slack_ids = users.map(function(user){return user.slack_id});
      cb && cb(null, slack_ids);
    }
  });
}

User.get_emails = function(slack_ids, cb) {
  User.find({slack_id: {$in: slack_ids}})
  .select('email').exec(function(err, emails){
    if (err) {
      cb && cb(err, null);
    } else {
      cb && cb(null, emails);
    }
  });
}

User.get_slack_ids_by_emails = function(emails, cb) {
  User.find({email: {$in: emails}}, function(err, users){
    if (err) {
      cb && cb(err, null);
    } else {
      slack_ids = users.map(function(user){return user.slack_id});
      cb && cb(null, slack_ids);
    }
  });
}


module.exports = User;
