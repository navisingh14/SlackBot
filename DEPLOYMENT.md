### Deployment
* Logon to the server you wish to deploy.
* Install ansible on your server if not present
* Download [ansible.yml](https://github.ncsu.edu/nsingh9/CSC510-Bot/blob/deployment/BotBai/ansible.yml)
* Edit the `homeDir` variable to the home folder where you wish to install the bot.
* Run `ansible-playbook -s ansible.yml`
* Login to slack: https://csc-510-project.slack.com/messages/D86ARBVK3/
#### To stop All:
* Run [stop_all.sh](https://github.ncsu.edu/nsingh9/CSC510-Bot/blob/deployment/BotBai/scripts/stop_all.sh)


Screencast:
[Deployment](https://www.youtube.com/watch?v=qpJOyslLtuM)
## Acceptance Testing
#### TA-Credentials
* ***Sign In Email***: csc510.se.ta@gmail.com
* ***Sign In Password***: csc510ta

Walkthrough of the usecases: https://youtu.be/ZhdEK4n88nY

### Use Case 0: Register
    0.1 User types "register".
    0.2 botbai returns a URL for user to register.
    0.3 User clicks on URL and chooses a gmail account to register.
    	* 0.3.1 Note: Since the server is deployed on amazon aws and uses public DNS, you might get safety warning. 
            * Click on Advanced and select Proceed.
    0.4 User gets registered.

### Use Case 1: Schedule/create a meeting
    1.1 User types "schedule a meeting".
    1.2 botbai asks "When do you want to start the meeting?".
    1.3 User enters start date and time. (e.g. tomorrow 3 PM)
    1.4 botbai asks "When do you want to finish the meeting?".
    1.5 User enters end date and time. (e.g. tomorrow 5 PM)
    1.6 botbai asks "Whom would you like to invite?".
    1.7 User enters the name of invitees.  (e.g. @Aditya Pandey)
    1.8 botbai returns the URL of this event.
    1.9 User clicks on the URL and lands on his/her google calendar to ensure the meeting has been created.

### Use Case 2: List all meetings
    2.1 User types "List meetings".
    2.2 botbai asks "What day would you like to list the meetings for?".
    2.3 User enters start and end date and time. (e.g. tomorrow 1PM to 10PM)
    2.4 botbai returns the list of meetings with brief summary of each meeting.


### Use Case 3: Delete a Meeting
    3.1 User types "Delete meeting".
    3.2 botbai asks "What duration do you want to see the calendar for to choose a meeting to delete?"
    3.3 User enters the start and end date and time. (e.g. tomorrow 2pm to 6pm)
    3.4 botbai returns the list of meeting in the given range.
    3.5 User clicks on link "Yes" to delete a meeting.
    3.6 The meeting has been deleted and botbai replies with message "Successfully deleted meeting".
    3.7 User checks his/her google calendar to ensure the meeting has been successfully deleted.

### Use Case 4: Update a meeting
    4.1 User types "Modify a meeting".
    4.2 botbai asks "What day would you like to modify the meetings for?"
    4.3 User enters the day. (e.g. tomorrow)
    4.4 botbai asks "Do you have a time-frame in mind?"
    4.5 User enters the start and end time. (e.g. 2pm to 6 pm)
    4.6 botbai returns the list of meetings with brief summary of each and a link to delete the meeting.
    4.7 User clicks on link "Yes".
    4.8 botbai asks for the confirmation "Are you sure you would like to change this meeting?".
    4.9 user types "Yes".
    4.10 botbai asks for new start time "When do you want to start the meeting?"
    4.11 User enters the time. (e.g. 2 PM)
    4.12 botbai asks for new end time "When do you want to finish the meeting?"
    4.13 User enters the end time. (e.g. 3:30 PM).
    4.14 botbai asks for the name of invitees "Whom would you like to invite?"
    4.15 User enters the name of invitees. (e.g. @Malayaz Sachdeva)
    4.16 botbai returns the URL of modified event.
    4.17 User clicks on the URL and it takes him/her to google calendar.


## For Development

### Prerequisites

* `git >= 2.13.6`
* `npm >= 3.10.10` 
* `node >= v6.11.5`
* `mongo >= 3.20` 

### Setup
* ***Manual***:
	* Clone the repo
	* Navigate to BotBai. `cd BotBai`
	* Copy `utilities/config_example.js` to `utilities/config.js`
	* Run `npm install`
* ***Automatic***:
	* Install ansible on your server.
	* Download [ansible.yml](https://github.ncsu.edu/nsingh9/CSC510-Bot/blob/deployment/BotBai/ansible.yml)
	* Edit the `homeDir` variable.
	* Run `ansible-playbook -s ansible.yml`

### Run
* Start server
	`npm start`
* Stop server
	`sh scripts/stop.sh`
	
## [WorkSheet](https://github.ncsu.edu/nsingh9/CSC510-Bot/blob/deployment/WORKSHEET.md)

### Note: For access to the server and the private key, feel free to contact one of us.
