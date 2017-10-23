var sinon = require('sinon');
var nlp = require('../utilities/nlp');
var Reply = require('../utilities/reply');
var Schedule = require('../utilities/schedule').Schedule;
var mock_calendars = require('./json/schedule.json') 

var create_meeting = function(schedule, cb) {

  console.log("I am at start in mock calendar");
  var reply = new Reply();
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


var list_meetings = function(user, start_time, end_time) {
  meetings = [];
  for(var m_i in mock_calendars){
    meetings.push(Schedule.from_json(mock_calendars[m_i]));
  }
  return meetings;
}

console.log(list_meetings());
exports.create_meeting = create_meeting;
exports.list_meetings = list_meetings;
