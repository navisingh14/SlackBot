# BotBai

BotBai automates the entire process of managing meetings right from finding suitable time slots to resolving schedule conflicts. It can be triggered through a message in slack. BotBai helps a manager to plan a meeting with employees or teams of his choice. The bot goes through the Google Calendars of all listed employees and finds a suitable time slot where everyone listed is available. It will either check their availability for the specified time frame or suggest next possible time slots where all attendees are available. BotBai will also notify all employees about the meeting through a slack notification and put in reminders for the same.

In case there is a situation where the meeting is in place but an attendee has some other important work at the same time, he can inform BotBai about his unavailability. The bot will notify the manager about the problem. The manager can then decide whether to go ahead with the meeting anyway or request BotBai to reschedule or cancel the meeting. If cancelled, all other attendees will get notified by the bot about the cancellation and that time slot on their google calendar will be opened up for other appointments. If a reschedule is requested, BotBai will then scan all google calendars for the next available slot for all attendees and suggest that to the manager. It can also suggest ideas to the unavailable candidate to make changes to his schedule so that he can make time for the meeting.

Such an interactive bot is a really good solution as it will reduce the manual effort and time required for rescheduling. In big companies, separate secretaries are hired just for planning and rescheduling meetings of the employees. This bot will automate this function and hence, eliminate the overall need to hire secretaries. Hence, BotBai can function as a universal secretary for the company and provide huge monetary benefits.

### Use Cases
[See the use cases here](https://github.ncsu.edu/nsingh9/CSC510-Bot/blob/master/Design.md#use-cases)

### Mocking
[Mock folder](https://github.ncsu.edu/nsingh9/CSC510-Bot/tree/master/BotBai/mock)

### Selenium testing of each use case
[Test](https://github.ncsu.edu/nsingh9/CSC510-Bot/tree/master/BotBai/test)

### Task Tracking
[Worksheet](https://github.ncsu.edu/nsingh9/CSC510-Bot/blob/master/WORKSHEET.md)

### Screencast
MILESTONE : BOT   

[Selenium Testing and UI](https://www.youtube.com/watch?v=99zUMRw1sk0)

[Code walk-through (example)](https://www.youtube.com/watch?v=zxc_hiRo5JI&t)    


MILESTONE : SERVICE    

[Use cases Implementation](https://www.youtube.com/watch?v=ZhdEK4n88nY&feature=em-upload_owner)

### Prerequisites

* `git >= 2.13.6`
* `npm >= 3.10.10` 
* `node >= v6.11.5`
* `mongo >= 3.20` Not required now

### Setup
* Clone the repo
* Navigate to BotBai. `cd BotBai`
* Copy `utilities/config_example.js` to `utilities/config.js`
* Run `npm install`

### Run
* Start server
	`npm start`
* Stop server
	`sh scripts/stop.sh`

### Test
* Install selenium
* Run `test/WebTest.java` using an editor. (or)
* Run `npm run selenium`


#### Note:
* Replace tabs with soft tabs while commiting
* Do not commit `utilities/config.js`
* To deploy on production set environment variable export NODE_ENV=production

### Happy Coding :)
