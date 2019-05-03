import express from 'express';
import { verifyGoogleToken } from '../controllers/auth';

const router = express.Router();

router.post('/login', async (req, res) => {
  let result;
  if (req.body.method === 'google') {
    result = await verifyGoogleToken(req.body.access_token);
  }
  res.send(result);
});

export default router;
