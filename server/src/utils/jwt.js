import jwt from 'jsonwebtoken';
import Config from '../config/config';

const generateAuthToken = (payload, _options = {}) => {
  const { JWT_SECRET } = Config.server;
  const options = Object.assign({ expiresIn: '1day' }, _options);
  const token = jwt.sign(payload, JWT_SECRET, options);
  return token;
};

export default {
  generateAuthToken,
};
