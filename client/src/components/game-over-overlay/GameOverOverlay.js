import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import './GameOverOverlay.css';
import { WHITE_PLAYER, BLACK_PLAYER } from '../../config/chess-game';

const ratingDiffString = ratingDiff => (ratingDiff < 0 ? `${ratingDiff}` : `+${ratingDiff}`);

export default class GameOver extends PureComponent {
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
      playerOneInfo, playerTwoInfo, gameOverDetails, isLoading, startGame,
      width, height, isError, errMessage, playerColor,
    } = this.props;
    const { winner = '' } = gameOverDetails;
    const message = this.getWinnerMessage(winner, playerColor);
    const { rating: playerOneRating, name: playerOneName } = playerOneInfo;
    const { rating: playerTwoRating, name: playerTwoName } = playerTwoInfo;
    const { playerOneNewRating, playerTwoNewRating } = gameOverDetails;

    const pOneRatingDiffStr = ratingDiffString(playerOneNewRating - playerOneRating);
    const pTwoRatingDiffStr = ratingDiffString(playerTwoNewRating - playerTwoRating);
    const pOneHighlightClass = pOneRatingDiffStr >= 0 ? 'success' : 'danger';
    const pTwoHighlightClass = pTwoRatingDiffStr >= 0 ? 'success' : 'danger';

    return (
      <div id="game-over-overlay" style={{ width, height }}>
        { isLoading && <div className="centered-container">Loading…</div> }
        { !isLoading && (
          <div className="centered-container">
            <p>{isError ? errMessage : message}</p>
            {!isError && (
              <>
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
              </>
            )}
            <Button color="primary" variant="contained" onClick={startGame}>Play Again</Button>
          </div>
        )}
      </div>
    );
  }
}

GameOver.propTypes = {
  playerOneInfo: PropTypes.object.isRequired,
  playerTwoInfo: PropTypes.object.isRequired,
  gameOverDetails: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
  errMessage: PropTypes.string.isRequired,
  startGame: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  playerColor: PropTypes.string.isRequired,
};
