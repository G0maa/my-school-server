/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import { changePassword, resetPassword } from '../services/user.service';
import { isAuthenticated } from '../utils/middleware';
import { ZUserResetPassword, ZUserGetOne } from '../validator/user.validator';

const userRouter = express.Router();

// Should probably remove that partcular session if passwrod changes.
// The errors here needs refactoring, e.g. use middleware,
// throw actual error, use expres-async-error, etc...
// Will be refactored when we introduce sending emails.
// https://stackoverflow.com/questions/3077229/restful-password-reset
userRouter.post('/:id/reset-password', isAuthenticated, async (req, res) => {
  // Less code, less "meaningful"
  // Or More code i.e. ZUserResetPassword?
  const { params } = ZUserGetOne.parse(req);

  if (req.user?.role === 'Admin') {
    const user = await resetPassword(params.id);

    if (!user)
      return res.status(400).json({ error: 'Admin: User non-existent' }).end();

    return res.status(200).json(user).end();
  } else if (req.user?.id === params.id) {
    const { currentPassword, newPassword } = ZUserResetPassword.parse(req.body);
    const user = await changePassword(params.id, currentPassword, newPassword);

    if (!user)
      return res
        .status(401)
        .json({ error: 'Incorrect current password' })
        .end();

    return res.status(200).json(user).end();
  }

  return res
    .status(401)
    .json({ error: 'User does not have authority to change password.' })
    .end();
});

export default userRouter;
