# NodeJS REST API

## Table of contents
- [About](#about)
- [Getting started](#getting-started)
  - [Dependencies](#dependencies)
  - [Dev setup step-by-step](#dev-setup-step-by-step)
- [API documentation](#api-documentation)
  - [Base URL](#base-url)
  - [Endpoints](#endpoints)


## About

This project is a NodeJS based RESTful API designed to manage user data and store information. It serves as a practical exercise for learning web programming interfaces and backend development concepts. The project was developed as part of the coursework for the Web Programming Interfaces course at Lapland University of Applied Sciences.

With this exercise we practiced:
- Setting up a NodeJS backend with Express.
- Implementing CRUD (Create, Read, Update, Delete) operations.
- Implementing authentication using JWT tokens.
- Handling HTTP requests and responses to interact with the frontend or other services.
- Working with SQLite database using sqlite3 for data storage and retrieval.
- Writing API documentation to provide clear guidelines for API usage.

## Getting started

Instructions on how to set up and run the backend.

### Dependencies

This project relies on the following dependencies:

- **sqlite3**: To interact with SQLite database.
- **express**: To handle HTTP requests and routes.
- **bcrypt**: To handle password hashing.
- **jsonwebtoken**: To handle authentication and token generation.
- **cookie-parser**: To parse cookies in HTTP requests.
- **crypto**: To generate cryptographic hashes and manage secure random numbers.

Make sure to install these dependencies before running the project to ensure smooth execution.

### Dev setup step-by-step

1. Create `.env` in project root and add JWT SECRET to the file `JWT_SECRET=XXXXXXXXXXXX`
2. Install dependencies with command `npm install`
3. Run the project with command `npm run dev`

## API documentation

API provides endpoints to manage users and stores. It supports basic CRUD (Create, Read, Update, Delete) operations. Detailed API documentation is also provided in `openapi.json` file.

### Base URL
The base URL in a local development environment, is [http://localhost:3000/api/v1](http://localhost:3000/api/v1).

### Endpoints

#### GET /user
- **Description:** Retrieves information about all users. _(Requires authentication and admin privileges)_
- **Response:** Returns an array of user objects.

#### GET /user/account
- **Description:** Retrieves information about the authenticated user's account.
- **Response:** Returns the user object.

#### GET /user/{id}
- **Description:** Retrieves information about a specific user based on their ID.
- **Path Parameter:** {id} - ID of the user.
- **Response:** Returns the user object if found.

#### POST /user/login
- **Description:** Authenticates a user and generates an access token.
- **Request Body:** Expects JSON object with username and password.
- **Response:** If successful, returns a message indicating successful login and sets a cookie with an access token.

#### POST /user
- **Description:** Creates a new user with provided data.
- **Request Body:** Expects a JSON object representing user data (username, password, age, role).
- **Response:** If successful, returns a message indicating successful user creation.

#### PUT /user
- **Description:** Updates information about a specific user identified by the provided id. _(Requires authentication and admin privileges)_
- **Request Body:** Expects JSON object with username, age, and id.
- **Response:** Returns a message indicating successful user update.

#### PATCH /user
- **Description:** Updates the age of the authenticated user.
- **Request Body:** Expects a JSON object with the new age.
- **Response:** Returns a message indicating a successful age update.

#### DELETE /user/{id}
- **Description:** Deletes a specific user based on their ID. _(Requires authentication and admin privileges)_
- **Path Parameter:** {id} - ID of the user.
- **Response:** Returns a message indicating successful user deletion.

#### POST /store
- **Description:** Creates a new store with provided data. _(Requires authentication and admin privileges)_
- **Request Body:** Expects a JSON object representing store data (name, address).
- **Response:** If successful, returns a message indicating successful store creation.

#### GET /store
- **Description:** Retrieves information about all stores.
- **Response:** Returns a list of store objects.

#### GET /store/{id}
- **Description:** Retrieves information about a specific store based on its ID.
- **Path Parameter:** {id} - ID of the store.
- **Response:** Returns the store object if found.

#### PUT /store
- **Description:** Updates information about a specific store identified by the provided id. _(Requires authentication and admin privileges)_
- **Request Body:** Expects JSON object with id, name, and address.
- **Response:** Returns a message indicating successful store update.

#### DELETE /store/{id}
- **Description:** Deletes a specific store based on its ID. _(Requires authentication and admin privileges)_
- **Path Parameter:** {id} - ID of the store.
- **Response:** Returns a message indicating successful store deletion.
