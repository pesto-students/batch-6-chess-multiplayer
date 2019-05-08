import express from 'express';
import chessGameController from './controllers/chess-game';

const router = express.Router();

router.get('/get-rating', chessGameController.getRating);
router.get('/leaderboard', chessGameController.leaderboard);

export default router;
