import axios from 'axios';
import User, { validateUser } from '../models/user';

export const checkUser = async (userData) => {
  const { error } = validateUser(userData);
  if (error) return error.details[0].message;
  let user = await User.findOne({ email: userData.email });
  if (user) {
    return true;
  }
  user = new User(userData);
  user = await user.save();
  if (user) {
    return true;
  }
  return false;
};

export const generateJWT = (userData) => {
  console.log(userData); // placeholder for jwt logic
  return true;
};

export const verifyGoogleToken = async (token) => {
  const url = `${process.env.GOOGLE_OAUTH_URL}${token}`;
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
  return checkUser(userData)
    ? generateJWT(userData)
    : false;
};

export const verifyFBToken = () => {
  // FB Logic
};
