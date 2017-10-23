var express = require('express');
var config = require('../utilities/config');
var register = require('../utilities/register');

var app = express();

app.get("/", function(req, res){
    res.send('Hello!! You should not be here');
});

app.get("/register", function(req, res){
    const {method, url} = req;
    var ind = url.indexOf("code");
    user_name = req.query.state;
    register.store_token(user_name, url.substring(ind+5));
    res.send("Thank You for registering. Please close this window.")
});


app.listen(config.port, function(){
    console.log('BotBai server listening on port 3000!');
});
