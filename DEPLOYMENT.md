## Acceptance Testing

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
