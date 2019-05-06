/* eslint-disable no-underscore-dangle */
import axios from 'axios';
import jwt from 'jsonwebtoken';
import User, { validateUser } from '../models/user';
import Config from '../config/config';

export const generateJWT = (userId) => {
  const { JWT_SECRET } = Config.server;
  const token = jwt.sign({ id: userId }, JWT_SECRET); // TODO: add expiry time.
  return token;
};

export const checkUser = async (userData) => {
  const { error } = validateUser(userData);
  if (error) {
    return error.details[0].message;
  }
  let user = await User.findOne({ email: userData.email });
  if (user) {
    return user._id;
  }
  user = new User(userData);
  await user.save();
  if (user) {
    return user._id;
  }
  return false;
};

export const verifyGoogleToken = async (token) => {
  const url = `${Config.server.GOOGLE_OAUTH_URL}${token}`;
  const response = await axios.get(url);
  const {
    family_name: familyName,
    given_name: givenName,
    email,
    name,
    picture,
  } = response.data;
  const userData = {
    familyName, givenName, email, name, picture,
  };
  const userId = await checkUser(userData);
  const jwtToken = generateJWT(userId);
  return jwtToken;
};

export const verifyFBToken = async (accessToken) => {
  const url = `${Config.server.FACEBOOK_OAUTH_URL}${accessToken}`;
  return axios.get(url).then((response) => {
    const {
      last_name: familyName,
      first_name: givenName,
      email,
      name,
    } = response.data;
    const userData = {
      familyName, givenName, email, name,
    };
    return checkUser(userData)
      ? generateJWT(userData)
      : false;
  }).catch(() => false);
};
