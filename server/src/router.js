import express from 'express';
import chessGameController from './controllers/chess-game';

const router = express.Router();

router.get('/get-rating', chessGameController.getRating);

export default router;
