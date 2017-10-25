var sinon = require('sinon');
var nlp = require('../utilities/nlp');
var Reply = require('../utilities/reply');
var Schedule = require('../utilities/schedule').Schedule;
var mock_calendars = require('./json/schedule.json');
var moment = require('moment');
var calendar_mock = sinon.mock(require('./calendarOne'));

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
        /*var start_time_check = (parseInt(mock_calendars[m_i].start, 10) >= (parseInt(moment(start_time).unix() * 1000)));
        var end_time_check = (parseInt(mock_calendars[m_i].end, 10) >= (parseInt(moment(end_time).unix() * 1000)));
        var creator_check = mock_calendars[m_i].creator == user;
        
    if (creator_check   && start_time_check && end_time_check ) {
        meetings.push(Schedule.from_json(mock_calendars[m_i]));
    }*/

    meetings.push(Schedule.from_json(mock_calendars[m_i]));
  }

  calendar_mock.list_meetings();

  var calendar_mock = sinon.mock(calendarAPI);
  calendar_mock.expects("list_meetings").returns(meetings);
  return calendar_mock.list_meetings();

  // register_mock.expects("register_user").withArgs(usr, cb).returns(cb("https://accounts.google.com/o/oauth2/auth?access_type=offline&state=U7KA4MQ4V&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar.readonly&response_type=code&client_id=991892021862-ghhjeae3n671mlu6v8b0omlemi87o76b.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fregister"));
  // console.log("In resiter user 1");
  // return register_mock.register_user(source_user, cb);

};

var delete_meeting = function(meeting_id, user, cb) {
  cb(null, "Successfully deleted meeting");
};

exports.create_meeting = create_meeting;
exports.list_meetings = list_meetings;
exports.delete_meeting = delete_meeting;
