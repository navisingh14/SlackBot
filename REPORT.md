
# Presentation

[Presentation Video](https://www.youtube.com/watch?v=TrGm6JbKymk&t=176s)


# Report

## Problem statement:
In this fast moving software world, the success of a software company can be related to how efficiently the employees use their time. Scheduling meetings is one of the many important things that the employees need to do on a daily basis. Hence, the time invested in planning meetings is a lot. If we can manage to come up with a software that can help us reduce the time spent in planning meetings, it will give the employees more time to invest in productive work.

Secondly, once the meeting is planned, if a particular attendant of the meeting notifies about his unavailability, more time is wasted for rescheduling and requesting all other attendees for approval of a rescheduled time. Human effort is also another valuable resource that is invested in this unproductive job of rescheduling meetings, which can affect the business negatively. If a universal bot is deployed for this process, both human work and time can be saved.

So basically, if the process of planning meetings, resolving conflicts and rescheduling is automated using an interactive bot, the time and efforts can be invested in more productive work which would enhance the business of the company. 


## Primary features:

### 1. Register User   
We ask new users to register so that our bot can access their google calendars.  

<br />

![img](https://github.ncsu.edu/nsingh9/CSC510-Bot/blob/master/img/register.png)        

<br />

### Success

![img](https://github.ncsu.edu/nsingh9/CSC510-Bot/blob/master/img/register%20op.png)

<br />

### 2. Create a meeting

We ask the creator for the time slot and members for the meeting.

![img](https://github.ncsu.edu/nsingh9/CSC510-Bot/blob/master/img/Schedule.png)    

<br />

### Success

![img](https://github.ncsu.edu/nsingh9/CSC510-Bot/blob/master/img/Schedule%20op.png)

<br />

![img](https://github.ncsu.edu/nsingh9/CSC510-Bot/blob/master/img/Schedule%20op2.png)

<br />

### 3. List meetings

We have created 2 meetings. We can list all the meetings in a given time frame.

![img](https://github.ncsu.edu/nsingh9/CSC510-Bot/blob/master/img/List.png)    

<br />

### Success

![img](https://github.ncsu.edu/nsingh9/CSC510-Bot/blob/master/img/List%20op.png)

<br />

### 4. Swap 2 meetings

Now, we try to swap Botbai Event 1 with Botbai Event 2.

![img](https://github.ncsu.edu/nsingh9/CSC510-Bot/blob/master/img/Swap%201.png)   
We click on first event to be swapped.

<br />

![img](https://github.ncsu.edu/nsingh9/CSC510-Bot/blob/master/img/Swap%202.png) 

Then we click on second meeting, which will be swapped with first meeting.

<br />

### Success

You can see that we have swapped the two events.

![img](https://github.ncsu.edu/nsingh9/CSC510-Bot/blob/master/img/Swap%20op.png)

<br />

![img](https://github.ncsu.edu/nsingh9/CSC510-Bot/blob/master/img/Swap%20op%202.png)

<br />

### 5. Delete a meeting

We delete a meeting. We click yes for Botbai event 2. 
<br />

![img](https://github.ncsu.edu/nsingh9/CSC510-Bot/blob/master/img/Delete.png)    

<br />

### Success
Botbai event 2 has been deleted and the time slot for that event is now free.

![img](https://github.ncsu.edu/nsingh9/CSC510-Bot/blob/master/img/Delete%20op%202.png)

<br />

![img](https://github.ncsu.edu/nsingh9/CSC510-Bot/blob/master/img/delete%20op.png)

<br />

### Developement process:
During the development process we had a lot of takeaways
* Organizing each milestone as a sprint and each task under it as a user story.
* Social and distributed coding where we distibuted tasks within the same code base.
* Design patterns like singleton, abstract and MVC.
* Working on natural language processing to parse text.
* Regular complete feature delivery with zero downtime so that the bot was always running.
* Seamless deployment to run it on most OS.


### Limitations and future work:
 * *Conflict resolution*: To add the logic to resolve conflicts between the attendees while creating or swapping meetings as this is not being taken care of right now. This could be added through voting or automatic alternative suggestions.
* *Unconditional Search*: Currently search for list, modify, delete and swap depends can be performed only using time ranges. This can be altered to support attendees and creator.
* *Location Support*: Meeting locations cannot be set in the current version of the bot. Google maps integration would be required to do this.
