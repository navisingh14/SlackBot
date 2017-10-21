/**
 * NLP parsing using wit.ai
 */
const {Wit, log} = require('node-wit');
var config = require('../utilities/config');
var sched = require('../utilities/schedule');

const client = new Wit({
    accessToken: config.wit_token
});

const Schedule = sched.Schedule;
const DateTime = sched.DateTime;

var create_date_time = function(date_time_json) {
    dt = new DateTime();
    dt.date_set = true;
    if (['hour', 'minute', 'second'].includes(date_time_json.grain)) {
        dt.time_set = true;       
    }
    dt.set_timestamp(date_time_json.value);
    return dt;
};

var parse = function(message, cb) {
    client.message(message, {}).then(function(data){
        var schedule = new Schedule();
        if (data.entities.intent && data.entities.intent.length > 0) {
            schedule.intent = data.entities.intent[0].value;
        }
        var datetimes = [];
        if (data.entities.datetime && data.entities.datetime.length > 0) {
            entity = data.entities.datetime[0];
            if (entity.type == "value") {
                schedule.start = create_date_time(entity);
            } else if (entity.type == "interval") {
                schedule.start = create_date_time(entity.from);
                schedule.end = create_date_time(entity.to);
            }
        }
        schedule.participants = extract_user_ids(message);
        cb && cb(schedule);
    });
};

var extract_user_ids = function(msg) {
    var reg = /\<\@([A-Z0-9]+)\>/g;
    var m;
    var users = []
    do {
        m = reg.exec(msg);
        if (m) {
            users.push(m[1]);
        }
    } while (m);
    return users;
}

exports.parse = parse;