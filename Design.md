
## Architectural Design:
* **UI**
  - #Slack
  - Google Signup
* **Server**
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
  
  
