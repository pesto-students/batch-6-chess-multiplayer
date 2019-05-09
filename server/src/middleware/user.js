import User from '../models/user';

const userDataMiddleWare = async (req, res, next) => {
  const { userId } = req;
  if (userId) {
    const userData = await User.findById(userId);
    req.user = userData;
  }
  next();
};

export default userDataMiddleWare;
