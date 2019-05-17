/* eslint-disable no-underscore-dangle */
import { WHITE_PLAYER, BLACK_PLAYER, DEFAULT_TIME } from '../config/gameConfig';
import User from '../models/user';
import chessGameUtil from '../utils/chess-game-util';

function Player({ id, user }, color) {
  this.socketId = id;
  this.user = {
    email: user.email,
    name: user.name ? user.name : user.email,
    rating: user.rating,
    userId: user._id,
  };
  this.color = color;
}

class Game {
  constructor(socket) {
    this.player1 = new Player(socket, WHITE_PLAYER);
    this.inPlay = false;
    this.timer = {
      playerOneIntervalId: null,
      playerTwoIntervalId: null,
      playerOneTime: DEFAULT_TIME,
      playerTwoTime: DEFAULT_TIME,
    };
    this.currentPlayer = WHITE_PLAYER;
    this.newRating = null;
  }

  addPlayer2(socket) {
    this.player2 = new Player(socket, BLACK_PLAYER);
    this.inPlay = true;
    return this;
  }

  startPlayerOneTimer() {
    return setInterval(() => {
      this.timer.playerOneTime -= 1;
    }, 1000);
  }

  startPlayerTwoTimer() {
    return setInterval(() => {
      this.timer.playerTwoTime -= 1;
    }, 1000);
  }

  flipTimer() {
    if (this.currentPlayer === WHITE_PLAYER) {
      clearInterval(this.timer.playerOneIntervalId);
      this.timer.playerTwoIntervalId = this.startPlayerTwoTimer(); //
      this.currentPlayer = BLACK_PLAYER;
    } else {
      clearInterval(this.timer.playerTwoIntervalId);
      this.timer.playerOneIntervalId = this.startPlayerOneTimer();
      this.currentPlayer = WHITE_PLAYER;
    }
    return this.getTime();
  }

  clearBothTimers() {
    clearInterval(this.playerOneIntervalId);
    clearInterval(this.playerTwoIntervalId);
  }

  getTime() {
    return {
      playerOneTime: this.timer.playerOneTime,
      playerTwoTime: this.timer.playerTwoTime,
    };
  }

  async calcPlayersNewRating(winner) {
    if (this.newRating === null) {
      const { user: { userId: playerOneUserId = '' } = {} } = this.player1;
      const { user: { userId: playerTwoUserId = '' } = {} } = this.player2;

      const playerOne = await User.findById(playerOneUserId);
      const playerTwo = await User.findById(playerTwoUserId);
      const { rating: playerOneRating = 0 } = playerOne;
      const { rating: playerTwoRating = 0 } = playerTwo;

      const rating = chessGameUtil.calcRating(playerOneRating, playerTwoRating, winner);
      const { playerOneNewRating, playerTwoNewRating } = rating;
      playerOne.rating = playerOneNewRating;
      await playerOne.save();
      playerTwo.rating = playerTwoNewRating;
      await playerTwo.save();

      this.newRating = rating;
    }
    return this.newRating;
  }
}

class Games {
  constructor() {
    this.live = [];
  }

  addGame(socket) {
    const game = new Game(socket);
    this.live.push(game);
    return game;
  }

  findIdleGame(email) {
    if (!email) {
      return false;
    }
    return this.live.find(x => !x.inPlay && x.player1.user.email !== email);
  }

  findGame(socket) {
    let game = '';
    const { live } = this;
    if (live.length === 0) {
      game = this.addGame(socket);
    } else {
      game = this.findIdleGame(socket.user.email)
        ? this.findIdleGame(socket.user.email).addPlayer2(socket)
        : this.addGame(socket);
    }
    return game;
  }

  removeGame(socketId) {
    const { live } = this;
    if (live.length === 0 || !socketId) {
      return false;
    }
    const gameIdx = live.findIndex((game) => {
      const {
        player1: { socketId: pOneSocketId = '' } = {},
        player2: { socketId: pTwoSocketId = '' } = {},
      } = game;
      return (pOneSocketId === socketId || pTwoSocketId === socketId);
    });
    if (gameIdx === -1) {
      return false;
    }
    const game = live.splice(gameIdx, 1)[0];
    game.inPlay = false;
    game.clearBothTimers();
    return true;
  }
}

const assignOpponentSocket = (game, id) => {
  const isPlayer1 = game.player1.socketId === id;
  return isPlayer1 ? game.player2 : game.player1;
};

export {
  Games,
  assignOpponentSocket,
};
