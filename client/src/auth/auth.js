const auth = {
  login(token, callback) {
    localStorage.setItem('isAuthenticated', 'true'); // default true till server is setup.
    console.log(token);
    callback(); // This callback is only to spoof successful login till server is setup.
    //             Will be moved to .then later
  },

  logout(callback) {
    localStorage.setItem('isAuthenticated', 'false');
    callback();
  },

  isAuthenticated() {
    return localStorage.getItem('isAuthenticated');
  },
};

export default auth;
