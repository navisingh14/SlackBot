# Task Tracking


## Week 1

| Deliverable       | Item/Status       |  Issues/Tasks
| -------------     | ------------      |  ------------
| Change name       | Completed         |  -
| Created issues    | Completed         |  [Issues](https://github.ncsu.edu/nsingh9/CSC510-Bot/issues)
| NLP Parsing       | In progress       |  #6, Interpreting user input by finding keywords
| User Registration | Completed         |  #5
| Use Case 1        | Create Meeting    
| Subflow 1         | In progress       |  #9, Creating meeting- time, members

Firstly, we changed our name to BotBai after receiving feedback from you about the Design.
We started working on our bot by creating initial repository and issues and dividing the tasks into modules.
We started working on the modules- User registration, context tokenization and use case 1.


## Week 2

| Deliverable       | Item/Status       |  Issues/Tasks
| -------------     | ------------      |  ------------
| Use Case 1        | Create Meeting    
| Subflow 1 (Happy) | Completed         |  #9, Meeting creation module
| Subflow 2 (Alternative) | Completed        |  #9, Wrong Timing input
| Mocking      | In progress       |  #7
| NLP Parsing       | Completed         |  #6, Keyword matching
| Selenium Testing  | Use Case 1 Completed |  #9
| Use Case 3        | Modify Meeting    
| Subflow 1 (Happy) | Completed         |  #11, Making changes in time, members
| Subflow 2 (Alternative)       | In progress       | #11, if no meetings

We completed the first use case entirely this week. Our bot is now able to properly create meetings. 
We started creating mock calendar values that members can have so as to test efficiency of our bot.
We completed selenium testing for use case 1 (both subflows).
We completed NLP parsing and tested our tokens.
We completed tokenization of input using Intents, wit.ai.
We started working on use case 3- Modify meeting.



## Week 3

| Deliverable       | Item/Status       |  Issues/Tasks
| -------------     | ------------      |  ------------
| Use Case 2        | List Meetings   
| Subflow 1 (Happy)        | Completed         |  #12, List all meetings
| Subflow 2 (Alternative)        | Completed         |  #12, if no meetings
| Use Case 3        | Modify Meeting    
| Subflow 2 (Alternative)        | Completed         |  #11, if no meetings
| Selenium Testing  | Use Case 2,3 Completed |  #12, #11
| Mocking      | Completed         |  #7
| Abandon Feature   | Completed         |  For abandoning the session
| Use Case 4        | Delete Meeting    |  
| Subflow 1         | Completed         |  #10, for deleting a meeting
| Selenium Testing  | Use Case 4 Completed |  #10
| Milestone: Bot       | Completed


In week 3, we managed to complete Milestone : BOT.
We completed use case 2,3 (all subflows).
We added an abandon meeting feature to exit the session altogether.
We also finished adding mock data for tests. These mock values will be replaced by google calendar values of users.
We completed use case 4 and ran selenium tests for all 4 use cases successfully.




## Week 4

| Deliverable       | Item/Status       |  Issues/Tasks
| -------------     | ------------      |  ------------
| Feature           | User Registration 
| User google calendar access token  | Completed         |  #5, Registered user -> Database
| Use Case 4        | Delete Meeting    |  
| Workflow         | In Progress        |  #10, Remove entry from attendee's calendar
|  URL Shortening        | Completed         |  #10, for better UI
| Use Case 1        | Create Meeting   |  
|  Workflow         | Completed         |  #9, Adding entry in attendee's calendar
| Use Case 2       | List Meetings   |  
|  Workflow           | In progress      |  #12, Listing entries from attendee's calendar

In week 4, we received feedback about Milestone-BOT and we removed our errors. 
We needed to replace mock calendar data with google calendars of creator and members of the meeting.
We added the registration functionality and once a user registers, we save the information and calendar access token in Mongo DB. We started implementation of our use cases with member's google calendar data.


## Week 5

| Deliverable       | Item/Status       |  Issues/Tasks
| -------------     | ------------      |  ------------
| Use Case 3        | Modify Meeting   |  
| Workflow         | Completed         |  #11, Modifying time slot in attendee's calendar
| Use Case 4        | Delete Meeting    |  
| Debugging      | Completed        |  #10, Minor errors, refactoring
|  Workflow         | Completed         |  #10, Successful deletion
| Use Case 2       | List Meetings   |  
|  Workflow       | Completed      |  #12, All meetings listed


In week 5, we completed implementation of all use cases. 
We have the first working prototype of our bot with successful implementation of proposed use cases.
We can see appropriate changes taking place in the google calendars. We hence, completed our Milestone : Service.


## Week 6

| Deliverable       | Item/Status       |  Issues/Tasks
| -------------     | ------------      |  ------------
| Create Branch Deployment      | Completed  |  #8, for working on deployment of the bot
| Ansible playbook      | In progress       |  #8, Writing ansible script 
| Acceptance testing    | In progress       |  Writing Testing Instructions so that TAs can easily run our bot
| Created AWS EC2 Ubuntu instance | Completed | A cloud instance for remote invocation of the bot

In week 6, we started working on the deployment of the bot. We created AWS EC2 Microsinstance where we will run our bot.
We start writing ansible scripts for configuration management of the bot. We created DEPLOYMENT.md where we will add Acceptance testing instructions.


## Week 7

| Deliverable       | Item/Status       |  Issues/Tasks
| -------------     | ------------      |  ------------
| Ansible playbook      | Completed     |  #8, Writing ansible script 
| Acceptance testing    | Completed      |  Writing Testing Instructions so that TAs can easily run our bot  
| Debugging      | Completed        |  #8, Minor bugs in deployment
| Merged Branch      | Completed        |  #8, Merged deployment with main branch

In week 7, we completed successful deployment of our bot. 
We have our bot running online with 100% success. We pulled the code onto the AWS micro instance so that the bot can remotely keep running. We have successfully running ansible playbook. We hence, completed our Milestone: Deployment.

