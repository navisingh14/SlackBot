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


var parse = function(message, cb) {
    client.message(message, {}).then(function(data){
        var schedule = new Schedule();
        if (data.entities.intent && data.entities.intent.length > 0) {
            schedule.intent = data.entities.intent[0].value;
        }
        var datetimes = [];
        if (data.entities.datetime && data.entities.datetime.length > 0) {
            for (var e_i in data.entities.datetime) {
                var entity = data.entities.datetime[e_i];
                dt = new DateTime();
                console.log(entity);
                for (var v_i in entity.values) {
                    var value = entity.values[v_i];
                    dt.date_set = true;
                    if (['hour', 'minute', 'second'].includes(value.grain)) {
                        dt.time_set = true;       
                    }
                    console.log(value.value);
                    dt.set_timestamp(value.value);
                }
                datetimes.push(dt);
            }
        }
        if (datetimes.length == 1) {
            schedule.start = datetimes[0];
        } else if (datetimes.length > 1) {
            schedule.start = datetimes[0];
            schedule.end = datetimes[1];
        }
        schedule.users = extract_user_ids(message);
        cb && cb(schedule);
    });
};

var extract_user_ids = function(msg) {
    var reg = /\<\@([A-Z0-9]+)\>/g;
    var m;
    var users = []
    do {
        m = re.exec(s);
        if (m) {
            users.push(m);
        }
    } while (m);
    return users;
}

exports.parse = parse;