var mode = process.env.NODE_ENV || "development";
var mongo_path, server, slack_token;
if (mode == "production") {
  mongo_path = 'mongodb://localhost:27017/botbai';
  server = "http://ec2-54-183-186-239.us-west-1.compute.amazonaws.com";
  slack_token = 'xoxb-258088752582-QQecuT3lfQgQc9OKNeX7AQvC';
  redirect_uri="http://ec2-54-183-186-239.us-west-1.compute.amazonaws.com:3000/register"
} else {
  mongo_path = 'mongodb://localhost:27017/botbai';
  server = 'http://localhost'; 
  slack_token = 'xoxb-258088752582-QQecuT3lfQgQc9OKNeX7AQvC';
  redirect_uri="http://localhost:3000/register"
}
var module_exports = {
  mongo: mongo_path,
  mode: mode,
  server: server,
  port: '3000',
  slack_token: slack_token,
  wit_token: 'TQP4WQDJADYJVPQ3BOED4O766OP7WOAB',
  api_key: 'AIzaSyAKX0EbfMDRDspKyNMXNE7rmvS9ebzySJE',
  client_secret: {"web":{"client_id":"991892021862-ghhjeae3n671mlu6v8b0omlemi87o76b.apps.googleusercontent.com","project_id":"elite-height-183602","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://accounts.google.com/o/oauth2/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"CHQ92KdD-u1Le2qd1KCSwHOV","redirect_uris":["http://localhost:3000/register"]}},
  redirect_uri: redirect_uri
};
module.exports = module_exports;
