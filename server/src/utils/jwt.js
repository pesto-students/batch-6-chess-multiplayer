import jwt from 'jsonwebtoken';
import Config from '../config/config';

const { JWT_SECRET } = Config.server;


const generateAuthToken = (payload, _options = {}) => {
  const options = Object.assign({ expiresIn: '1day' }, _options);
  const token = jwt.sign(payload, JWT_SECRET, options);
  return token;
};

const verifyToken = (token) => {
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
    return decoded.id;
  } catch (ex) {
    return null;
  }
};

export default {
  generateAuthToken,
  verifyToken,
};
