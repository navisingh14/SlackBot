var sinon = require('sinon');
var nlp = require('../utilities/nlp');
var reply = require('../utilities/reply');

var create_meeting = function(schedule, cb) {

  console.log("I am at start in mock calendar");

  if(schedule.intent && schedule.intent == nlp.I_MEETING_SET) {
    reply.status = true;
    reply.message = "Success";
  } else {
    reply.status = false;
    reply.message = "Failed to create a meeting";
  }

  //var schedule = sinon.mock(schedule);
  //schedule.expects('intent').withArgs(nlp.I_MEETING_SET).returns(5);
  //storeMock.expects('set').once().withArgs('data', 1);
  console.log("I am at end in mock calendar");
  cb && cb(reply);
};


exports.create_meeting = create_meeting;
