### Deployment
* Logon to the server you wish to deploy.
* Install ansible on your server if not present
* Download [ansible.yml](https://github.ncsu.edu/nsingh9/CSC510-Bot/blob/deployment/BotBai/ansible.yml)
* Edit the `homeDir` variable to the home folder where you wish to install the bot.
* Run `ansible-playbook -s ansible.yml`
* Login to slack: https://csc-510-project.slack.com/messages/D86ARBVK3/
#### To stop All:
* Open [stop_all.sh](https://github.ncsu.edu/nsingh9/CSC510-Bot/blob/deployment/BotBai/scripts/stop_all.sh)


Screencast: 
## Acceptance Testing
#### TA-Credentials
* ***Sign In Email***: csc510.se.ta@gmail.com
* ***Sign In Password***: csc510ta

Walkthrough of the usecases: https://youtu.be/ZhdEK4n88nY

### Use Case 0: Register

### Use Case 1: Schedule a meeting

### Use Case 2: List all meetings

### Use Case 3: Delete a Meeting

### Use Case 4: Update a meeting


## For Development

### Prerequisites

* `git >= 2.13.6`
* `npm >= 3.10.10` 
* `node >= v6.11.5`
* `mongo >= 3.20` Not required now

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

### Note: For access to the server and the private key, feel free to contact one of us.
