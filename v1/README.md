<img src="./docs/assets/pomi-logo.png" width="450px"/>

# Pomi

**Content:**

- [About](#about)
- [Documentation](#documentation)
- [Instructions](#instructions)

## About
Pomi is a web application designed for tracking time spent using a timeboxing methodology (e.g. Pomodoro Technique™). 

See the [Documentation](#documentation) section for in-depth functional and technical specifications, or check out the [Functionality](#key-functionality) and [Technologies](#technologies-used) sections for a quick summary.

<!--Un-comment upon release-->
<!--The application is live at [pomi.pawelgrimm.com](https://pomi.pawelgrimm.com). You can also view a gif of the app in action at [www.pawelgrimm.com/pomi](https://www.pawelgrimm.pomi) -->

It's **not recommended** since the app is not yet released, but if you'd like to build and run the app locally, see the [Instructions](#instructions) section.


### Key Functionality

 - [x] Web client
 - [x] Configurable timer
 - [x] Logging work sessions to database
 - [x] Searching for tasks and projects and linking them to work sessions
 - [x] Creating and editing projects and tasks
 - [x] Viewing and filtering logged sessions
 - [x] User authentication
 - [x] Native notifications

### Technologies Used

 - [x] React (front-end library)
 - [x] HTML5/JSX and CSS3 (front-end layout and styling)
 - [x] Material UI (UI library)
 - [x] Redux (client state management)
 - [x] Firebase Authentication (OAuth 2.0 authentication solution)
 - [x] TypeScript (JavaScript superset with static typing for client and server code)
 - [x] Node.js (back-end JavaScript runtime)
 - [x] Express.js (HTTP server framework)
 - [x] PostgreSQL (SQL database)
 - [x] Jest, React Testing Library (testing frameworks)
 - [x] Webpack (module bundler)
 
## Documentation

 - [Functional Specification]
 - [REST API Specification]

## Instructions

**NOTE**: Version 1 of this application has not yet been released. For now, Use the `feature/add-database` branch to see a working prototype or the `update-models` branch to see the current development state.

### To install
1. Install [Node.js](https://nodejs.org/en/), [Yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable), and [PostgreSQL](https://www.postgresql.org/download/)

2. Clone the repository:

   ```
   $ git clone https://github.com/pawelgrimm/pomi.git
   ```
   
3. Set up PostgreSQL (see [tutorial](https://www.postgresql.org/docs/12/tutorial-createdb.html) or [blog](https://blog.logrocket.com/setting-up-a-restful-api-with-node-js-and-postgresql-d96d6fc892d8/) for help)
   - Connect to the default database (called postgres): 
     
     ```
     $ psql
     ```
     
   - Create a new user: 
   
     ```
     postgres=# CREATE ROLE pomi WITH LOGIN PASSWORD 'root';
     ```
     
   - Create a new database called `pomi_dev`, owned by the `pomi` user: 
     
     ```
     postgres=# CREATE DATABASE pomi_example WITH OWNER = pomi;
     ```
     
   - Quit psql: 
   
     ```
     postgres=# \q
     ```
     
   - Connect to the new database: 
   
     ```
     $ psql pomi_dev
     ```
     
   - Enable the pgcrypto extension: 
   
     ```
     pomi_dev=# CREATE EXTENSION pgcrypto;
     ```
     
   - Quit psql: 
   
     ```
     postgres=# \q
     ```

4. Set up the config file

   - Create a file called `src/server/config/.env.development`
   - Edit it as follows:
   
     ```
     DATABASE_URL=postgresql://pomi:root@localhost:5432/pomi_dev
     PORT=3001
     ```
     
5. Provision a new [Firebase Authentication application](https://firebase.google.com/docs/auth/web/custom-auth#before-you-begin), download the service account key, name them `firebaseServiceAccountKey.json`, and move to `src/server/config/`

6. Install dependencies: 

   ```
   $ yarn install
   ```
   
7. Migrate the database: 

   ```
   $ yarn reset-dev-db
   ```

8. Start the app in development mode:

   ```
   $ yarn develop
   ```

### To run tests
1. Set up a new database called `pomi_test` owned by the `pomi` user (don't forget connect to the new database: `$ psql pomi_test` and enable the pgcrypto extension `pomi_test# CREATE EXTENSION pgcrypto;`)

2. Set up the config file:

   - Create a file called `src/server/config/.env.test`
   - Edit it as follows:
   
     ```
     DATABASE_URL=postgresql://pomi:root@localhost:5432/pomi_test
     PORT=3001
     ```
     
3. Run all tests: 

   ```
   $ yarn test
   ``` 
   
   or run client tests:
   
   ```
   $ yarn test:client
   ```
   
   or run server tests:
   
   ```
   $ yarn test:server
   ```
   
   or run shared tests:
   
   ```
   $ yarn test:shared
   ```

### To build and run production

1. Set up a new database called `pomi_prd` owned by the `pomi` user (don't forget connect to the new database: `$ psql pomi_prd` and enable the pgcrypto extension `pomi_prd=# CREATE EXTENSION pgcrypto;`)
2. Set up the config file:

   - Create a file called `src/server/config/.env.production`
   - Edit it as follows:
   
     ```
     DATABASE_URL=postgresql://pomi:root@localhost:5432/pomi_prd
     PORT=3001
     ```
     
3. Build the app:

   ```
   $ yarn build
   ```
   
4. Migrate the database:
   
   ```
   $ yarn migrate-db prd
   ```
   
5. Serve the app:
   
   ```
   $ yarn start
   ```

### Other useful scripts

 - Generate a new component (with tests) or database model (with queries, routes, validation, and tests):
   
   ```
   $ yarn generate {component|model}
   ```
   
 - Migrate a database to a given version:
   
   ```
   $ yarn migrate-db {dev|test|prd} {version}
   ```
   
 - Reset the dev by dropping all contents and running migrations up to highest version:
   
   ```
   $ yarn reset-dev-db
   ``` 
   
   or do the same for the test database:
   
   ```
   $ yarn reset-test-db
   ```
   
 - Kill the Node.js server (if it misbehaved and didn't exit gracefully):
   
   ```
   $ yarn killnode
   ````

[Pomodoro]: https://francescocirillo.com/pages/pomodoro-technique
[Functional Specification]: ./docs/pomi-functional-spec.md
[REST API Specification]: ./docs/api/api-spec-v1.md
