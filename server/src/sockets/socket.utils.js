
class Game {
  constructor(socketId) {
    this.player1 = {
      socketId,
      color: 'w',
    };
    this.inPlay = false;
  }

  addPlayer2(socketId) {
    this.player2 = {
      socketId,
      color: 'b',
    };
    this.inPlay = true;
    return this;
  }
}

class Games {
  constructor() {
    this.live = [];
  }

  addGame(socketId) {
    const game = new Game(socketId);
    this.live.push(game);
    return game;
  }

  findIdleGame() {
    return this.live.find(x => !x.inPlay);
  }

  findGame(socketId) {
    let game = '';
    const { live } = this;
    if (live.length === 0) {
      game = this.addGame(socketId);
    } else {
      game = this.findIdleGame()
        ? this.findIdleGame().addPlayer2(socketId)
        : this.addGame(socketId);
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
    live.splice(gameIdx, 1);
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
