/* eslint-disable */
// To-Do Deal with eslint
import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { Strategy as LocalStrategy } from 'passport-local';
import { User } from '../models';
import config from '../utils/config';
import { verifyPassword } from '../utils/helpers';

// this gets called as a middleware,
// variables are taken from req.body
passport.use(
  new LocalStrategy(
    { session: false },
    (username: string, password: string, callback) => {
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

        const tokenUser = {
          id: user.id,
          username: user.username,
          role: user.role,
        };
        // If user didn't reset his password on the first login,
        // then the password is saved as plain-text
        if (!user.isReset) {
          if (password !== user.password)
            return callback(null, false, {
              message: 'Incorrect username or password',
            });
          else return callback(null, tokenUser);
        }
        // eslint-disable-next-line @typescript-eslint/no-floating-promises, @typescript-eslint/no-unsafe-argument
        verifyPassword(password, user.dataValues.password).then(
          (isPasswordCorrect) => {
            if (!isPasswordCorrect)
              return callback(null, false, {
                message: 'Incorrect username or password',
              });

            return callback(null, tokenUser);
          }
        );
      });
    }
  )
);

const loginRouter = express.Router();

// Keep in mind that this route gets
// the object passed in local strategy callback
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
loginRouter.post(
  '/login',
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  passport.authenticate('local', { session: false }),
  (req, res) => {
    if (!req.user) return res.status(401).end();

    const token = jwt.sign(req.user, config.SECRET, {
      expiresIn: 60 * 60 * 24 * 7,
    });

    // user: {id, username, role}
    return res
      .status(200)
      .json({
        ...req.user,
        token,
      })
      .end();
  }
);

export default loginRouter;
