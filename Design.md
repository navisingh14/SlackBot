
## Architectural Design:
* **UI & Client**
  - **#Slack**: The UI for the bot resides in [Slack](https://slack.com/features), which is a cloud based chat app which is typically used by members of a Software Engineering Team. Members can communicate with each other through common chanels or direct messaging. An interesting feature in slack is the provision to add external tools and bots capable of aiding members of the slack team. Few common examples of bots are [WeatherBot](https://slack.com/features), [a list of TODOs](https://ai-se.slack.com/apps/A0HBTUUPK-to-do). Each member of the team needs to register with the bot to assist him/her in creating conflict free meetings.
  - **Google Signup**: Each member while registering with the bot will signup with his/her Google Account via the [Google OAuth UI](https://developers.google.com/google-apps/calendar/auth). This is to enable access to his/her calendar to check for meetings, resolve conflicts and schedule them once resolved.
* **Server**
  The Server is a [REST](https://en.wikipedia.org/wiki/Representational_state_transfer) built using the following technologies
  - [Node](https://nodejs.org/): Node is an asynchronous event driven JavaScript runtime framework which primarily is used for server side programming and is one of the first frameworks to break the notion of JavaScript as a client side programming language.
  
  

  - API layer
    - REST calls
    - Caching frequent contacts (optional)
  - Management layer
    - Google Calendar API
    - Wit.ai: Parts of speech processing and semantic parsing
    - Conflict resolution and other business logic
  - DAO layer
    - Retrieve and store data from DB
* **Database**
  - NoSQL database: To store temporary calendars, signed up users
* **Deploy**
  - Database Container: Hosted on an instance of DB
  - Primary Server: Container runnning the master instance of Server
  - Secondary: Container runnning the slave instance of Server. Becomes master if the Primary instance fails.
  
  
