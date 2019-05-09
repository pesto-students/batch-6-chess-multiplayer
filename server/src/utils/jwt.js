import jwt from 'jsonwebtoken';
import Config from '../config/config';

const generateJWT = (payload, options) => {
  const { JWT_SECRET } = Config.server;
  const token = jwt.sign(payload, JWT_SECRET, options);
  return token;
};

export default {
  generateJWT,
};
