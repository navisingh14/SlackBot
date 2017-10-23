var mongoose = require('./mongo').mongoose;

var userSchema = function(user_name, email, token, name) {
  this.user_name = user_name,
  this.email = email,
  this.token = token
};

function testFun() {

  userSchema("Aditya Pandey", "apandey@test.com", "1234567890");
  

}