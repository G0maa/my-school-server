[![codecov](https://codecov.io/gh/G0maa/my-school-server/branch/master/graph/badge.svg?token=BYFKO436TX)](https://codecov.io/gh/G0maa/my-school-server)
![CI Pipeline Badge](https://github.com/g0maa/my-school-server/actions/workflows/ci.yml/badge.svg)

# My-School-Server

- RESTful API for a School Management System
- Features:
  - Schedules (for teachers & students)
  - Uplodad/Download subject materials
  - Fees inequiry
  - Grades inequiry

## What I am working on:

- Code-wise
  - API Pagination [#37](https://github.com/G0maa/my-school-server/issues/37)
  - API Versioning [#37](https://github.com/G0maa/my-school-server/issues/37)
  - To OOP? (Maybe) [#47](https://github.com/G0maa/my-school-server/issues/47)
  - Better Error handling
  - Validations related [#34](https://github.com/G0maa/my-school-server/issues/34)
    - Trying to make sure that different entities are _always_ in a valid state
- Docs
  - Better & more detailed Readme [#46](https://github.com/G0maa/my-school-server/issues/46)
  - API Docs [#40](https://github.com/G0maa/my-school-server/issues/40)

## Backend Stack (Modules) so far:

- Nodejs & Express - JS Runtime & HTTP Server
- PassportJS - Authentication
- Express-Session - Session Manager
- ~~Amazon SDK - DBs & Emails~~ Not used yet
- Morgan - Logger
- Jest - API Testing
- Prettier & Eslint - Linting & Formatting
- AWS - IaaS
- Docker - Development Environment

## Starting up the development environment

- **NOTE: You need to have [docker](https://docs.docker.com/get-docker/) installed.**
  - And [NodeJS](https://nodejs.org/en/) (LTS version).
- After cloning the repo, open a terminal in your favourite IDE:

1. Start the DBs
   - In a terminal `docker compose -f postgres-compose.yml up`
2. Install dependencies
   - `npm install`
3. Change `.sample.env` to `.env`
4. Run the tests & make sure all of them pass:
   - `npm run test`
5. Run the app
   - `npm run dev`

## Development related:

- Docker:
  - `docker compose -f postgres-compose.yml up` for running `PostgreSQL`.
  - `docker exec -it postgres-db psql` for getting into `psql` terminal.
- Run specific test
  - `npm run test -- -t '<name>'`
- Resetting DB:
  - Through `psql`:
    - `DROP TABLE <all table names>`
    - `DELETE FROM pg_type WHERE typnamespace=2200;`
    - Trivial `SELECT typname, typnamespace FROM pg_type WHERE typnamespace=2200;`
  - Through `sequelize` using `umzug`:
    - `npm run migration:downAll`
- Access `EC2` instance:
  - Make sure that the `Security Group` allows `SSH` from your IP.
  - `ssh -i "C:\Users\Lenovo\.ssh\<.pem file>" <rest of aws ip>`
- Access `RDS` instance:
  - `psql <postgres_url>`

## Decisions:

- Use of AWS's Infrastructure as opposed to VPS or a group of containers generally.
- Using Angular for Frontend.
- Not using a _proper_ framework for Backend. (or both FE & BE)
- Use of `PassportJS` for authentication as opposed to 3rd party auth services (e.g. AWS Cognito) & open source ones (e.g. Ory Hydra).
- How to store files?
  - Server storage ✅ (for now), AWS S3, MinIO, OpenStack Swift
- Validating input (and possibily sanitizing?)
  - express-validator (very JS), runtypes, zod ✅ (puerly based on it being most used), others...
- Starting with `sequelize`, then ?eventually? switching to `sequelize-typescript`.
