import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import API from '../../apis/chessGameApi';
import './GameOverOverlay.css';
import { WHITE_PLAYER, BLACK_PLAYER } from '../../config/chess-game';

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
    const {
      playerOneRating, playerTwoRating, winner, playerColor,
    } = this.props;
    this.setState({ isLoading: true });
    const serverPlayerOne = playerColor === WHITE_PLAYER ? playerOneRating : playerTwoRating;
    const serverPlayerTwo = playerColor === WHITE_PLAYER ? playerTwoRating : playerOneRating;
    API.getRating({ playerOneRating: serverPlayerOne, playerTwoRating: serverPlayerTwo, winner })
      .then((response) => {
        const {
          isError, error, playerOneNewRating: sponr, playerTwoNewRating: sptnr,
        } = response;
        const playerOneNewRating = playerColor === WHITE_PLAYER ? sponr : sptnr;
        const playerTwoNewRating = playerColor === WHITE_PLAYER ? sptnr : sponr;
        let stateObj = { isLoading: false };
        if (isError) {
          stateObj = { ...stateObj, isError, errMessage: error.message };
        } else {
          stateObj = { ...stateObj, playerOneNewRating, playerTwoNewRating };
        }
        this.setState(stateObj);
      });
  }

  getWinnerMessage = (winner, player) => {
    let message = 'Draw match! You got the moves.';
    if (winner === player) {
      message = 'Well played, the game is all yours!';
    } else if (winner === WHITE_PLAYER || winner === BLACK_PLAYER) {
      message = 'Never Mind, you can always start a new game.';
    }
    return message;
  }

  render() {
    const {
      playerOneRating, playerTwoRating, winner, startGame,
      width, height, playerColor, playerOneName, playerTwoName,
    } = this.props;
    const {
      playerOneNewRating, playerTwoNewRating, isLoading, isError, errMessage,
    } = this.state;
    const message = this.getWinnerMessage(winner, playerColor);
    const pOneRatingDiffStr = ratingDiffString(playerOneNewRating - playerOneRating);
    const pTwoRatingDiffStr = ratingDiffString(playerTwoNewRating - playerTwoRating);
    const pOneHighlightClass = pOneRatingDiffStr >= 0 ? 'success' : 'danger';
    const pTwoHighlightClass = pTwoRatingDiffStr >= 0 ? 'success' : 'danger';

    return (
      <div id="game-over-overlay" style={{ width, height }}>
        { isError && (
        <p>
          {' '}
          {errMessage}
          {' '}
        </p>
        )}
        { (isLoading && !isError) && <div className="centered-container">Loading…</div> }
        { (!isLoading && !isError) && (
          <div className="centered-container">
            <p>{message}</p>
            <p>
              {playerOneName}
              {': '}
              {playerOneNewRating}
              {', '}
              <span className={pOneHighlightClass}>{pOneRatingDiffStr}</span>
            </p>
            <p>
              {playerTwoName}
              {': '}
              {playerTwoNewRating}
              {', '}
              <span className={pTwoHighlightClass}>{pTwoRatingDiffStr}</span>
            </p>
            <Button color="primary" variant="contained" onClick={startGame}>Play Again</Button>
          </div>
        )}
      </div>
    );
  }
}

GameOver.propTypes = {
  playerOneRating: PropTypes.number.isRequired,
  playerTwoRating: PropTypes.number.isRequired,
  playerColor: PropTypes.string.isRequired,
  playerOneName: PropTypes.string.isRequired,
  playerTwoName: PropTypes.string.isRequired,
  winner: PropTypes.string.isRequired,
  startGame: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};
