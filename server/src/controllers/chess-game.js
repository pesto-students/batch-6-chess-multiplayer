import CGUtil from '../utils/chess-game-util';

const getRating = (req, res) => {
  const { playerOneRating, playerTwoRating, winner } = req.query;
  const newRating = CGUtil.calcRating(playerOneRating, playerTwoRating, winner);
  res.json(newRating);
};

export default {
  getRating,
};
