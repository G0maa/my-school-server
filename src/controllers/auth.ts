// To-Do Deal with eslint
import express from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { User } from '../models';
import { verifyPassword } from '../utils/helpers';

// this gets called as a middleware,
// variables are taken from req.body
passport.use(
  new LocalStrategy((username: string, password: string, callback) => {
    // PassportJS uses callbacks, only..
    // let user: User = new User();
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
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
      // eslint-disable-next-line @typescript-eslint/no-floating-promises, @typescript-eslint/no-unsafe-argument
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
  console.log('serializeUser', user);
  return callback(null, {
    id: user.id,
    username: user.username,
    role: user.role,
  });
});

// This is the data from 'express-session' store, to req.body
// Better not have a +1 DB request.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.deserializeUser((user: Express.User, callback) => {
  console.log('deserializeUser', user);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return callback(null, user);
});

const loginRouter = express.Router();

// Keep in mind that this route gets
// the object passed in local strategy callback
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
loginRouter.post('/login', passport.authenticate('local'), (req, res) => {
  if (!req.user) return res.status(401).end();

  return res
    .status(200)
    .json({
      id: req.user.id,
      username: req.user.username,
      role: req.user.role,
    })
    .end();
});

export default loginRouter;
