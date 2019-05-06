import jwt from 'jsonwebtoken';
import Config from '../config/config';

const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) res.status(401).send('Access denied. No Token in header');

  const { JWT_SECRET } = Config.server;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (ex) {
    res.status(401).send('Access Denied. Token Invalid');
  }
};

export default auth;
