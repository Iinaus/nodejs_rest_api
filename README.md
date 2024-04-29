# NodeJS REST API

## Getting started

Instructions on how to set up and run the backend.

### Dependencies

This project relies on the following dependencies:

- **sqlite3**: To interact with SQLite database.
```bash
npm i sqlite3
```

- **express**: To handle HTTP requests and routes.
```bash
npm install express --save
```

Make sure to install these dependencies before running the project to ensure smooth execution.

### Dev setup step-by-step

1. Create `.env` in project root and add JWT SECRET to the file `JWT_SECRET=XXXXXXXXXXXX`
2. Install dependencies with command `npm install`
3. Run the project with command `npm run dev`

## API documentation

API provides endpoints to manage users. It supports basic CRUD (Create, Read, Update, Delete) operations. Detailed API documentation is provided in `openapi.json` file.

### Base URL
The base URL in a local development environment, is [http://localhost:3000/api/v1](http://localhost:3000/api/v1).