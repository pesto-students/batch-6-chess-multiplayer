import axios from 'axios';
import Config from '../config/globalConfig';

const getRating = ({ playerOneRating, playerTwoRating, winner }) => {
  const url = `${Config.serverUrl}/get-rating?playerOneRating=${playerOneRating}&playerTwoRating=${playerTwoRating}&winner=${winner}`;
  return axios.get(url)
    .then(response => response.data)
    .catch(err => ({ isError: true, error: err }));
};

export default {
  getRating,
};
