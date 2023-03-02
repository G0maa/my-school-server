/* eslint-disable */
// To-Do Deal with eslint
import express from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { User } from '../models';
import { verifyPassword } from '../utils/helpers';
import { validateSchema } from '../utils/middleware';
import { ZUserLogin } from '../validator/user.validator';

// this gets called as a middleware,
// variables are taken from req.body
passport.use(
  new LocalStrategy((username: string, password: string, callback) => {
    // PassportJS uses callbacks, only..
    // let user: User = new User();
    User.findOne({
      where: {
        username,
      },
    }).then((user) => {
      if (!user)
        return callback(null, false, {
          message: 'Incorrect username or password',
        });

      // If user didn't reset his password on the first login,
      // then the password is saved as plain-text
      if (!user.isReset) {
        if (password !== user.password)
          return callback(null, false, {
            message: 'Incorrect username or password',
          });
        else return callback(null, user.dataValues);
      }

      verifyPassword(password, user.dataValues.password).then(
        (isPasswordCorrect) => {
          if (!isPasswordCorrect)
            return callback(null, false, {
              message: 'Incorrect username or password',
            });

          return callback(null, user.dataValues);
        }
      );
    });
  })
);

// This gets called ONLY after call of passport.authenticate('local')
// i.e. sets which data will be stored in expess-session store
passport.serializeUser((user, callback) => {
  // console.log('serializeUser', user);
  return callback(null, {
    id: user.id,
    username: user.username,
    role: user.role,
  });
});

// This is the data from 'express-session' store, to req.body
// Better not have a +1 DB request.
passport.deserializeUser((user: Express.User, callback) => {
  // console.log('deserializeUser', user);
  return callback(null, user);
});

const loginRouter = express.Router();

// Keep in mind that this route gets
// the object passed in local strategy callback
loginRouter.post(
  '/login',
  validateSchema(ZUserLogin),
  passport.authenticate('local'),
  (req, res) => {
    // #swagger.tags = ['login']
    if (!req.user) return res.status(401).end();

    return res
      .status(200)
      .json({
        id: req.user.id,
        username: req.user.username,
        role: req.user.role,
      })
      .end();
  }
);

export default loginRouter;
