/* eslint-disable react/jsx-one-expression-per-line */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { BLACK_PLAYER, WHITE_PLAYER } from '../../config/chess-game';
import API from '../../apis/chessGameApi';
import './GameOverOverlay.css';

const ratingDiffString = ratingDiff => (ratingDiff < 0 ? `${ratingDiff}` : `+${ratingDiff}`);

export default class GameOver extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      playerOneNewRating: 0,
      playerTwoNewRating: 0,
      isError: false,
      errMessage: '',
    };
  }

  componentDidMount() {
    this.updateRating();
  }

  updateRating = () => {
    const { playerOneRating, playerTwoRating, winner } = this.props;
    this.setState({ isLoading: true });
    API.getRating({ playerOneRating, playerTwoRating, winner })
      .then((response) => {
        const {
          isError, error, playerOneNewRating, playerTwoNewRating,
        } = response;

        let stateObj = { isLoading: false };
        if (isError) {
          stateObj = { ...stateObj, isError, errMessage: error.message };
        } else {
          stateObj = { ...stateObj, playerOneNewRating, playerTwoNewRating };
        }
        this.setState(stateObj);
      });
  }

  getWinnerMessage = (winner) => {
    let message = 'Draw !!';
    if (winner === WHITE_PLAYER) {
      message = 'White player wins !!';
    } else if (winner === BLACK_PLAYER) {
      message = 'Black player wins !!';
    }
    return message;
  }

  render() {
    const {
      playerOneRating, playerTwoRating, winner, startGame,
      width, height,
    } = this.props;
    const {
      playerOneNewRating, playerTwoNewRating, isLoading, isError, errMessage,
    } = this.state;
    const message = this.getWinnerMessage(winner);
    const pOneRatingDiffStr = ratingDiffString(playerOneNewRating - playerOneRating);
    const pTwoRatingDiffStr = ratingDiffString(playerTwoNewRating - playerTwoRating);
    return (
      <div id="game-over-overlay" style={{ width, height }}>
        { isError && <p> {errMessage} </p>}
        { (isLoading && !isError) && <p>Loading...</p> }
        { (!isLoading && !isError) && (
          <div>
            <p>{message}</p>
            <p>Player one rating: {playerOneNewRating}, {pOneRatingDiffStr}</p>
            <p>Player two rating: {playerTwoNewRating}, {pTwoRatingDiffStr}</p>
            <button type="button" onClick={startGame}>Play Again</button>
          </div>
        )}
      </div>
    );
  }
}

GameOver.propTypes = {
  playerOneRating: PropTypes.number.isRequired,
  playerTwoRating: PropTypes.number.isRequired,
  winner: PropTypes.string.isRequired,
  startGame: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};
