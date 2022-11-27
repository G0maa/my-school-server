import express from 'express';
const devRouter = express.Router();

// Generally checkign if cookie resolves to a logged-in user.

// devRouter.get('/printCookie', (req, res) => {
//   console.log(req.cookies['foo']);
//   res.status(200).json(req.cookies['foo']).end();
// });

// GET localhost:8080/testSecure
devRouter.get('/testSecure', (req, res) => {
  console.log(req.user);
  if (!req.user)
    return res.status(401).json({ message: 'Unauthorized /testSecure' }).end();
  return res
    .status(200)
    .json([
      {
        id: '001',
        img: 'assets/images/user/user1.jpg',
        gender: 'male',
        email: 'test@email.com',
        date: '2018-02-25T14:22:18Z',
        department: 'mathematics',
        mobile: '1234567890',
        name: 'Gomaa',
        degree: 'M.Sc., PHD.',
      },
    ])
    .end();
});

devRouter.get('/testUnSecure', (req, res) => {
  console.log(req.user);
  return res.status(200).json({ message: 'Authorized /testUnSecure' }).end();
});

export default devRouter;
