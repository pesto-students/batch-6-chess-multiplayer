import CGUtil from '../utils/chess-game-util';
import User from '../models/user';

const getRating = (req, res) => {
  const { playerOneRating, playerTwoRating, winner } = req.query;
  const newRating = CGUtil.calcRating(playerOneRating, playerTwoRating, winner);
  res.json(newRating);
};

const leaderboard = (req, res) => {
  const query = User.find();
  query.select('name rating picture');
  query.sort({ rating: 'desc' });
  query.exec((err, docs) => {
    let dataToSend = docs;
    if (err) {
      dataToSend = [];
    }
    res.json({ leaderboard: dataToSend });
  });
};

export default {
  getRating,
  leaderboard,
};
