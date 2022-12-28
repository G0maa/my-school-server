/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import { isAuthenticated } from '../utils/middleware';

const devRouter = express.Router();

// Another option to test GET requests
devRouter.get('/login', (_req, res) => {
  return res.status(200).send(
    `<html>
      <head>
        <script>
          const login = async () => {
            await fetch('/api/auth/login', {
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              method: 'POST',
              credentials: 'include',
              body: JSON.stringify({ username: 'A0001',
              password: '000000' })
            })
          }
        </script>
      </head>
      <body>
        <button type="button" onclick="login()">Sign in</button>
      </body>
      </html>`
  );
});

// try auth middleware here.
devRouter.get('/testAuth', isAuthenticated, (req, res) => {
  return res.status(200).json(req.user).end();
});

devRouter.get('/testUnAuth', (_req, res) => {
  return res.status(200).json({ message: 'Authorized /testUnAuth' }).end();
});

export default devRouter;
