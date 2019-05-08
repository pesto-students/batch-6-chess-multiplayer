import axios from 'axios';
import Config from '../config/globalConfig';

const handleErrorResponse = err => ({ isError: true, error: err });

const getRating = ({ playerOneRating, playerTwoRating, winner }) => {
  const url = `${Config.serverUrl}/get-rating?playerOneRating=${playerOneRating}&playerTwoRating=${playerTwoRating}&winner=${winner}`;
  return axios.get(url)
    .then(response => response.data)
    .catch(handleErrorResponse);
};

const getLeaderboard = () => {
  const url = `${Config.serverUrl}/leaderboard`;
  return axios.get(url)
    .then(response => response.data)
    .catch(handleErrorResponse);
};

export default {
  getRating,
  getLeaderboard,
};
