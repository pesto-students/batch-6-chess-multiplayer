import express from 'express';
import chessGameController from './controllers/chess-game';

const router = express.Router();

router.get('/leaderboard', chessGameController.leaderboard);
router.get('/get-user', (req, res) => {
  const { user = {} } = req;
  res.json(user);
});
export default router;
