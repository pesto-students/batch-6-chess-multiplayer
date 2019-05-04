import express from 'express';
import { verifyGoogleToken, verifyFBToken } from '../controllers/auth';

const router = express.Router();

router.post('/login', async (req, res) => {
  let result;
  if (req.body.method === 'google') {
    result = await verifyGoogleToken(req.body.access_token);
  } else if (req.body.method === 'facebook') {
    result = await verifyFBToken(req.body.access_token);
  } else {
    return res.status(401);
  }
  return res.send(result);
});

export default router;
