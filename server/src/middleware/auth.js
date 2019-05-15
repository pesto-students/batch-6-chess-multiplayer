
import jwt from '../utils/jwt';

const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) res.status(401).send('Access denied. No Token in header');

  const userId = jwt.verifyToken(token);
  if (userId) {
    req.userId = userId;
    return next();
  }
  return res.status(401).send('Access Denied. Token Invalid');
};

export default auth;
