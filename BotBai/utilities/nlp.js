/**
 * NLP parsing using wit.ai
 */
const {Wit, log} = require('node-wit');
var config = require('../utilities/config');
var sched = require('../utilities/schedule');
var User = require('../db/mongo/User');

const client = new Wit({
    accessToken: config.wit_token
});

const Schedule = sched.Schedule;
const DateTime = sched.DateTime;
const I_MEETING_SET = "meeting_set";
const I_MEETING_UNSET = "meeting_unset";
const I_SIGN_UP = "sign_up";
const I_LIST = "list"
const I_MEETING_MODIFY = "meeting_modify";
const I_YES = "yes";
const I_ABANDON = "abandon";


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
        tokens = message.toLowerCase().split(/[ ,;]+/);
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
        if (tokens.indexOf('@all') >= 0 || tokens.indexOf('@everyone') >= 0) {
            User.get_all_handles(function(err, user_ids){
                if (err) {
                    console.error(err);
                    cb && cb(schedule);
                } else {
                    participants = new Set(schedule.participants);
                    user_ids.forEach(function(user_id){
                        participants.add(user_id);
                    });
                    schedule.participants = Array.from(user_ids);
                    cb && cb(schedule);
                }
            });
        } else {
            cb && cb(schedule);
        }
        
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
exports.I_MEETING_SET = I_MEETING_SET;
exports.I_MEETING_UNSET = I_MEETING_UNSET;
exports.I_SIGN_UP = I_SIGN_UP;
exports.I_LIST = I_LIST;
exports.I_MEETING_MODIFY = I_MEETING_MODIFY;
exports.I_YES = I_YES;
exports.I_ABANDON = I_ABANDON;
