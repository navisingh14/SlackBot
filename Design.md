
## Architectural Design:
* **UI & Client**
  - **#Slack**: The UI for the bot resides in [Slack](https://slack.com/features), which is a cloud based chat app which is typically used by members of a Software Engineering Team. Members can communicate with each other through common chanels or direct messaging. An interesting feature in slack is the provision to add external tools and bots capable of aiding members of the slack team. Few common examples of bots are [WeatherBot](https://slack.com/features), [a list of TODOs](https://ai-se.slack.com/apps/A0HBTUUPK-to-do). Each member of the team needs to register with the bot to assist him/her in creating conflict free meetings.
  - **Google Signup**: Each member while registering with the bot will signup with his/her Google Account via the [Google OAuth UI](https://developers.google.com/google-apps/calendar/auth). This is to enable access to his/her calendar to check for meetings, resolve conflicts and schedule them once resolved.
* **Server**
  The Server is a [REST](https://en.wikipedia.org/wiki/Representational_state_transfer) built using the following technologies
  - **Node**: [Node](https://nodejs.org/) is an asynchronous event driven JavaScript runtime framework which primarily is used for server side programming and is one of the first frameworks to break the notion of JavaScript as a client side programming language.
  - **ExpressJS**: [ExpressJS](https://expressjs.com/) is an additional minimal framework on Node primarily for web based applications that reduces and simplifies REST based calls and caters to an [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) architecture.
  
  Since the server is the layer of the framework with most fuctionality, we granularize it into three essential components based on its responsibilities. This further complies with the *Template Design Pattern* where there is placeholder for each layer and each layer which can be chosen based on the developers just has to adhere to the template's placeholder.
  - **API layer**: To and from communications with the client happens in this layer.
    - ***REST***: The API for this layer is exposed via REST which allows the client to communicate with the server via HTTP requests. The choice of REST was made over other contemprories like [SOAP](https://en.wikipedia.org/wiki/SOAP) and [GraphQL](http://graphql.org/) due to the following reasons
      * **Stateless**: Since REST is stateless, it makes each request to the server independent of each other thus limiting the data shared and additional bookkeeping.
      * **HTTP based**: Since REST is built on HTTP, it enables users to follow standard HTTP methods like *GET*, *POST* etc and easier validation over the webbrowser.
    - ***Caching (optional)***: This is an optional feature we plan on implementing if the base features of our project is completed on time. Here we cache the frequent requests made by the user using [MemCache](https://www.npmjs.com/package/node-cache) or [Redis](https://redis.io/) to help the user with auto complete and thus give him a better chat experience.
  - **Management layer**: This layer is primarily responsible for data Processing and the business logic of the application.
    - Google Calendar API
    - Wit.ai: Parts of speech processing and semantic parsing
    - Conflict resolution and other business logic
  - **DAO layer**: Database Access Object(DAO) layer is responsible for interactions of the server with the database.
    - Retrieve and store data from DB
* **Database**
  - NoSQL database: To store temporary calendars, signed up users
* **Deploy**
  - Database Container: Hosted on an instance of DB
  - Primary Server: Container runnning the master instance of Server
  - Secondary: Container runnning the slave instance of Server. Becomes master if the Primary instance fails.
  
  
