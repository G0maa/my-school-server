[![codecov](https://codecov.io/gh/G0maa/my-school-server/branch/master/graph/badge.svg?token=BYFKO436TX)](https://codecov.io/gh/G0maa/my-school-server)
![CI Pipeline Badge](https://github.com/g0maa/my-school-server/actions/workflows/ci.yml/badge.svg)

## Under heavy-development.

## Backend Stack (Modules) so far:

- Nodejs & Express - JS Runtime & HTTP Server (duh).
- PassportJS - Authentication
- Express-Session - Session Manager
- Amazon SDK - DBs & Emails
- Morgan - Logger
- Jest - API Testing
- Prettier & Eslint - Linting & Formatting
- AWS - IaaS
- Docker - Development Environment

## Development:

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
