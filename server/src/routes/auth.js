import express from 'express';
import { verifyGoogleToken, verifyFBToken } from '../controllers/auth';

const router = express.Router();
const emptyString = str => str === undefined || str === '';

router.post('/login', async (req, res) => {
  let result;
  if (req.body.method === 'google') {
    result = await verifyGoogleToken(req.body.access_token);
  } else if (req.body.method === 'facebook') {
    result = await verifyFBToken(req.body.access_token);
  } else {
    return res.status(422).send('Invalid login method');
  }

  const { errorMessage, accessToken } = result;
  if (errorMessage) {
    return res.status(422).send(errorMessage);
  }
  if (emptyString(accessToken)) {
    return res.status(422).send('Not allowed to login');
  }
  return res.json({ accessToken });
});

export default router;
