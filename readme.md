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

## Suggestions:

- Might try a different library than `jest` for API-testing (integration testing)
  - what's the use of `supertest`? HTTP Testing Server.
- CI/CD
- somehwat single-click deployment, given domain name.
  - Two Options:
    - Use CloudFormation, VERY limited to AWS.
    - Use Docker... will need to eliminate most of AWS services.

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

## Problem(s):

- CORS, CSRF with SPAs?
  - My frontend at `my-school.software`, my backend at `my-school-backend.tech`, what security concerns do I have to take in mind? i.e. cookies not working properly (probably).
    - `api.my-school.software`, `www.my-school.software` & allow CORS ✅
    - Erm... CSRF with different domains?... or anything generally with different subdomains
- `ESLint` doesn't produce a warnging after using `console.log`, investigate.
- Types of sequelize != types of zod != types of ???

## To-Dos: ✅❌❓

- Use session-manager. ✅
- Passportjs, and the Register Verify Login Forgot Cycle (auth).
- `sequelize-typescript` or find a way to have a type for models.
  - [see](https://sequelize.org/docs/v6/other-topics/typescript/)
  - Find a way to put model typing in `types.ts`
- Think about validation.
- [envalid](https://www.npmjs.com/package/envalid)
- You validated the input, now to sanitize it?
