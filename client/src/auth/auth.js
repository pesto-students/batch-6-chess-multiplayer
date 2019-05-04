import axios from 'axios';
import Config from '../config/globalConfig';

const authEndpoint = `${Config.serverUrl}/auth/login`;

const auth = {
  login(method, token, callback) {
    const data = {
      method,
      access_token: token,
    };
    axios.post(authEndpoint, data)
      .then((res) => {
        if (res.data) {
          localStorage.setItem('isAuthenticated', 'true');
          callback();
        }
      })
      .catch((err) => {
        console.log(err); // placeholder till failure reason display is built.
      });
  },

  logout(callback) {
    localStorage.setItem('isAuthenticated', 'false'); // placeholder till JWT generation is built.
    callback();
  },

  isAuthenticated() {
    return localStorage.getItem('isAuthenticated');
  },
};

export default auth;
