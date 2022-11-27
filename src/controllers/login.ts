// To-Do Deal with eslint
/* eslint-disable */
import express from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

// this gets called as a middleware,
// variables are taken from req.body
passport.use(
  new LocalStrategy((username: string, password: string, callback) => {
    // This will be replaced with actual DB logic

    // This calls serializeUser.
    if (username == 'root' && password == 'sekret')
      return callback(null, {
        username,
        password,
      });
    else
      return callback(null, false, {
        message: 'Incorrect username of password',
      });
  })
);

// From 'req.user', this is the data which 'express-session' stores in its 'store'.
passport.serializeUser((user: any, callback) => {
  console.log('user serializeUser', user);
  return callback(null, user);
});

// From 'req.user', this is the data from 'express-session' store.
passport.deserializeUser((user: any, callback) => {
  console.log('user DEserializeUser', user);
  return callback(null, user);
});

const loginRouter = express.Router();

loginRouter.post('/login', passport.authenticate('local'), (req, res) => {
  if (!req.user) return res.status(401).end();
  console.log('/login', req.user);
  console.log('HERE');
  return res
    .status(200)
    .json({
      // id: 1,
      // img: 'assets/images/user/admin.jpg',
      // username: 'admin@school.org',
      // password: 'admin@123',
      // firstName: 'Sarah',
      // lastName: 'Smith',
      role: 'Admin',
      // token: 'admin-token',
    })
    .end();
});

export default loginRouter;
