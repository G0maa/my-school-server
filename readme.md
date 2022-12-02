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

## Suggestions:

- Might try a different library than `jest` for API-testing (integration testing)
  - what's the use of `supertest`?
- add (DB) dependencies as needed.
- somehwat single-click deployment, given domain name.
  - Two Options:
    - Use CloudFormation, VERY limited to AWS.
    - Use Docker... will need to eliminate most of AWS services.

# Prototyping:

- Some demos I tried before beginnging actual coding:
  - Connection to `RDS` PostgreSQL with `Sequelize`. ✅
    - Also created `IAM` role for `Database Adminstrator`. ✅
  - Try using SES (mainly using nodemialer). ✅
    - Thinking of Dropping the dependency nodemialer. ❓
  - Implement the cycle of, register, verify, login, forgot password. ✅
    - Bonus: `2FA`. ❌
    - Contemplating the idea of adding social register/login. ❌
  - TypeScript ❓✅
    - This could be helpful: https://express-validator.github.io/docs/
    - You somewhat can use `.js` but you'd have to disable eslint for it.
    - Will try applying to the other prototypes.

## Decisions:

- Use of a [3rd-pary auth service](https://youtu.be/Hh_kiZTTBr0), mainly AWS Cognito.
  - DIY? How hard is it?
  - To try: [PassportJS](https://www.passportjs.org/)
  - Honoranble mentions "Open-source" (you can host it yourself) auth services e.g. Ory Hydra.

## How X Works:

- About PassportJS:
  - When you think of Authentication & Authorization, you'd have to stumple upon `Session Management` and/or tokens..
  - Mainly uses `express-session` for [session management](https://supertokens.com/blog/should-you-use-express-session-for-your-production-app).
    - I think mostly the issues in the article can be addressed with other modules. e.g. CSRF protection module.
  - When is `serializeUser` and `deserializeUser` called?, can I change said data after authentication on server-side?
    - ?After using some authentication strategy, in some route?
    - in the incoming request `deserializeUser` works to put `req.session.passport.user` in `req.user`, depending on the function.
    - After finishing, i.e. after the route `serializeUser` to put the updated object (if it gets updated) back in `req.session.passport.user`.
    - `express-session` work before and after both of them accordingly.
    - [More?](https://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize)
  - Result of `LocalStrategy` (if successful) is put into `req.user`, makes me think that all ^ implicitly use `user`.
  - `req.login` & `req.logout` is part of `Passportjs`
  - Rest of strategies work similarly, social auth (depending on the standard) also result in something in `req.user`.. regardless of how they're configured.
  - Some security aspects:
    - SessionID cookie on the client-side is signed.
    - SessionData is in plain-text on the DB.

## Few observations:

- About Prototyping, or my way of doing it:
  - The way I tried to test new unknown things was to erm... "prototype" stuff i.e. that is to create a new folder, then test that stuff until satisfied.
    - Problem is: I should have used git branches.
    - also, sometimes I needed to compine protoypes e.g. Email service & Database, which is a hard thing to do.
  - I try to make the prototype as close as possible to development, but this proves to be hard without doing extra work, or thinking about potential problems.
    - e.g. when I was trying to make `EmailCycle` I stumpled upon, uuid for postgres, CORS with SPAs, cookie content and the connection with frontend.
    - During this you question the validity and usefulness of your prototype, either you do the extra stuff, and lose potentially important time, or do it "improperly" and face problems when incorporating this prototype to development.
- Docker:
  - `docker exec -it <ContainerName> psql`
- `Sequelize` is the one who generatres `UUIDs` NOT `PostgreSQL`

### Database Related:

- `sequelize-cli` is saved as a Dev dependency.
  - Might need `pg-hstore`, as per the [docs](https://node-postgres.com/#version-compatibility).
- Not using `umzug` (Code-level migration loader) for now, will be using `sequelize-cli` instead.
- About `Docker`:
  - `docker compose -f postgres-compose.yml up` for running `PostgreSQL`.
  - `docker exec -it postgres-db psql` for getting into `psql` terminal.

## Problem(s):

- CORS, CSRF with SPAs?
  - My frontend at `my-school.software`, my backend at `my-school-backend.tech`, what security concerns do I have to take in mind? i.e. cookies not working properly (probably).
    - Few Solutions:
      - Two domains... too much hassle I'm not going into.
      - Reverse Proxy (nginx), trivial solution, but ?not applicable? for ELB and ASG & CF, as far as I know.
      - `api.my-school.software`, `www.my-school.software` & allow CORS ✅
  - Erm... CSRF with different domains?... or anything generally with different subdomains\*
- `ESLint` doesn't produce a warnging after using `console.log`, investigate.

## To-Dos:

- Use session-manager.
- Passportjs, and the Register Verify Login Forgot Cycle (auth).
