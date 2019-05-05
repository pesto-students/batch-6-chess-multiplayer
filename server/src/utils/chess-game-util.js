import Config from '../config/config';

/**
 * Following calculations of player rating are based on ELo Rating System
 * please about Elo rating system and its Mathematical details from following link
 * https://en.m.wikipedia.org/wiki/Elo_rating_system#Mathematical_details
 */

const { chessGame } = Config;
const validWinner = (winner) => {
  const validWinners = [chessGame.BLACK_PLAYER, chessGame.WHITE_PLAYER, chessGame.GAME_DRAW];
  return validWinners.includes(winner);
};

const calcExpectedScore = (_playerOneRating, _playerTwoRating) => {
  const playerOneRating = parseInt(_playerOneRating, 10);
  const playerTwoRating = parseInt(_playerTwoRating, 10);
  const playerOneExpectedScore = 1 / (1 + (10 ** ((playerTwoRating - playerOneRating) / 400)));
  return parseFloat(playerOneExpectedScore.toFixed(2));
};

const calcScores = (winner) => {
  let pOneScore;
  let pTwoScore;

  switch (winner) {
    case chessGame.WHITE_PLAYER:
      pOneScore = 1;
      pTwoScore = 0;
      break;
    case chessGame.BLACK_PLAYER:
      pOneScore = 0;
      pTwoScore = 1;
      break;
    case chessGame.GAME_DRAW:
      pOneScore = 0.5;
      pTwoScore = 0.5;
      break;
      // no default
  }

  return { pOneScore, pTwoScore };
};

const calcEloRating = (oldRatingString, score, expectedScore) => {
  const oldRating = parseInt(oldRatingString, 10);
  let KFactor;
  if (oldRating < 2100) {
    KFactor = 32;
  } else if (oldRating <= 2400) {
    KFactor = 24;
  } else {
    KFactor = 16;
  }
  return Math.round(oldRating + KFactor * (score - expectedScore));
};

const calcRating = (playerOneRating, playerTwoRating, winner) => {
  if (!validWinner(winner)) {
    return { playerOneNewRating: playerOneRating, playerTwoNewRating: playerTwoRating };
  }

  const pOneExpScore = calcExpectedScore(playerOneRating, playerTwoRating);
  const pTwoExpScore = calcExpectedScore(playerTwoRating, playerOneRating);

  const { pOneScore, pTwoScore } = calcScores(winner);

  const pOneNewRating = calcEloRating(playerOneRating, pOneScore, pOneExpScore);
  const pTwoNewRating = calcEloRating(playerTwoRating, pTwoScore, pTwoExpScore);

  return { playerOneNewRating: pOneNewRating, playerTwoNewRating: pTwoNewRating };
};

export default {
  calcRating,
};
