/* eslint-disable no-underscore-dangle */
import axios from 'axios';
import User, { validateUser } from '../models/user';
import Config from '../config/config';
import jwtUtil from '../utils/jwt';

export const checkUser = async (userData) => {
  const { error } = validateUser(userData);
  if (error) {
    return { errorMessage: error.details[0].message };
  }
  let user = await User.findOne({ email: userData.email });
  if (user) {
    return { userId: user._id };
  }
  user = new User(userData);
  await user.save();
  if (user) {
    return { userId: user._id };
  }
  return {};
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
  const { errorMessage, userId } = await checkUser(userData);
  if (errorMessage) {
    return { errorMessage };
  }

  if (userId) {
    const jwtToken = jwtUtil.generateJWT({ id: userId }, { expiresIn: '1d' });
    return { accessToken: jwtToken };
  }
  return {};
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
    const { errorMessage, userId } = checkUser(userData);
    if (errorMessage) {
      return { errorMessage };
    }

    if (userId) {
      const jwtToken = jwtUtil.generateJWT({ id: userId }, { expiresIn: '1d' });
      return { accessToken: jwtToken };
    }
    return {};
  }).catch(err => ({ isError: true, errorMessage: err.message }));
};
