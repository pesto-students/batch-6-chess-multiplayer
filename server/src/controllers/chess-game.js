import User from '../models/user';

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
  leaderboard,
};
