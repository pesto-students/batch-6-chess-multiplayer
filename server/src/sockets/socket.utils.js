import { WHITE_PLAYER, BLACK_PLAYER, DEFAULT_TIME } from '../config/gameConfig';

class Game {
  constructor(socket) {
    this.player1 = {
      socketId: socket.id,
      user: {
        name: socket.user.name,
        rating: socket.user.rating,
      },
      color: WHITE_PLAYER,
    };
    this.inPlay = false;
    this.timer = {
      playerOneIntervalId: null,
      playerTwoIntervalId: null,
      playerOneTime: DEFAULT_TIME,
      playerTwoTime: DEFAULT_TIME,
    };
    this.currentPlayer = WHITE_PLAYER;
  }

  addPlayer2(socket) {
    this.player2 = {
      socketId: socket.id,
      user: {
        name: socket.user.name,
        rating: socket.user.rating,
      },
      color: BLACK_PLAYER,
    };
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

  findIdleGame() {
    return this.live.find(x => !x.inPlay);
  }

  findGame(socket) {
    let game = '';
    const { live } = this;
    if (live.length === 0) {
      game = this.addGame(socket);
    } else {
      game = this.findIdleGame()
        ? this.findIdleGame().addPlayer2(socket)
        : this.addGame(socket);
    }
    return game;
  }

  removeGame(socketId) {
    const { live } = this;
    if (live.length === 0 || !socketId) {
      return false;
    }
    const gameIdx = live.findIndex(x => x.player1.socketId === socketId);
    if (gameIdx === -1) {
      return false;
    }
    const game = live.splice(gameIdx, 1)[0];
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
