import axios from 'axios';
import Config from '../config/globalConfig';

const handleErrorResponse = err => ({ isError: true, error: err });

const getLeaderboard = () => {
  const url = `${Config.serverUrl}/leaderboard`;
  return axios.get(url, {
    headers: {
      'x-auth-token': localStorage.getItem('jwt'),
    },
  })
    .then(response => response.data)
    .catch(handleErrorResponse);
};

export default {
  getLeaderboard,
};
