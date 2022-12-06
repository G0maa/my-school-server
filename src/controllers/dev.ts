import express from 'express';
const devRouter = express.Router();

devRouter.get('/testAuth', (req, res) => {
  if (!req.user)
    return res.status(401).json({ message: 'Unauthorized /testAuth' }).end();

  return res.status(200).json(req.user).end();
});

devRouter.get('/testUnAuth', (_req, res) => {
  return res.status(200).json({ message: 'Authorized /testUnAuth' }).end();
});

export default devRouter;
