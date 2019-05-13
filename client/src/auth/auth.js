import axios from 'axios';
import jwt from 'jsonwebtoken';
import Config from '../config/globalConfig';

const authEndpoint = `${Config.serverUrl}/auth/login`;

const auth = {
  login(method, token) {
    const data = {
      method,
      access_token: token,
    };
    return axios.post(authEndpoint, data)
      .then((res) => {
        const { accessToken } = res.data;
        if (!accessToken) {
          return { loggedIn: false };
        }
        localStorage.setItem('jwt', accessToken);
        return { loggedIn: true };
      });
  },

  fetchUserData() {
    return axios.get(`${Config.serverUrl}/get-user`, {
      headers: {
        'x-auth-token': localStorage.getItem('jwt'),
      },
    }).then(res => res.data);
  },

  logout(callback) {
    localStorage.removeItem('jwt');
    callback();
  },

  isAuthenticated() {
    const token = jwt.decode(localStorage.getItem('jwt'));
    if (token) {
      const { exp: expInSecs } = token;
      const expiryTimeMs = parseInt(expInSecs, 10) * 1000;
      const currentTimeMs = Date.now();
      if (currentTimeMs < expiryTimeMs) {
        return true;
      }
    }
    return false;
  },
};

export default auth;
