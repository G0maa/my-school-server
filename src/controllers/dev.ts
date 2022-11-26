import express from 'express';
const devRouter = express.Router();

// Generally checkign if cookie resolves to a logged-in user.

// devRouter.get('/printCookie', (req, res) => {
//   console.log(req.cookies['foo']);
//   res.status(200).json(req.cookies['foo']).end();
// });

devRouter.get('/testSecure', (req, res) => {
  console.log(req.user);
  if (!req.user)
    return res.status(401).json({ message: 'Unauthorized /testSecure' }).end();
  return res.status(200).json(req.user).end();
});

devRouter.get('/testUnSecure', (req, res) => {
  console.log(req.user);
  return res.status(200).json({ message: 'Authorized /testUnSecure' }).end();
});

export default devRouter;
