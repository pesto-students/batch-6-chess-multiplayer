

import { Games, assignOpponentSocket } from './socket.utils';

describe('Games', () => {
  const games = new Games();
  const { live } = games;
  const socket = {
    id: '12345',
    user: {
      email: 'magnus@carlsen.com',
      name: 'magnus',
      rating: 2889,
    },
  };
  const game = games.addGame(socket);
  test('should create games object', () => {
    expect(live).toBeTruthy();
    expect(live).toBeInstanceOf(Array);
  });

  describe('addGame()', () => {
    test('should add new game to live games', () => {
      expect(game.player1).toBeTruthy();
      expect(game.player2).toBeFalsy();
      expect(game.isLive).toBeFalsy();
      expect(game.player1.socketId).toBe(socket.id);
    });
  });

  describe('findIdleGame()', () => {
    let idleGame = games.findIdleGame('email');
    test('should return an idle game from live games if an idle game exists', () => {
      expect(idleGame).toBeTruthy();
      expect(idleGame.isLive).toBeFalsy();
    });
    test('should return undefined when no idle game is exists', () => {
      const socket1 = {
        id: '12345',
        user: {
          email: 'magnus@carlsen.com',
          name: 'magnus',
          rating: 2889,
        },
      };
      idleGame = idleGame.addPlayer2(socket1);
      const idleGame2 = games.findIdleGame();
      expect(idleGame2).toBeFalsy();
    });
  });

  describe('findGame()', () => {
    const [socketId1, socketId2, socketId3] = [
      {
        id: '123454',
        user: {
          email: 'magnus@carlsen.com',
          name: 'magnus',
          rating: 2889,
        },
      }, {
        id: '123455',
        user: {
          email: 'vishy@anand.com',
          name: 'anand',
          rating: 2887,
        },
      }, {
        id: '123456',
        user: {
          email: 'hikaru@nakamura.com',
          name: 'nakamura',
          rating: 2789,
        },
      },
    ];
    test('should add a new game to live games if no live game exists and return game', () => {
      const game2 = games.findGame(socketId1);
      expect(games.live.length).toBe(2);
      expect(game2.player1.socketId).toBe(socketId1.id);
      expect(game2.isLive).toBeFalsy();
    });
    test('should add player2 to an idle game and return game', () => {
      const game2 = games.findGame(socketId2);
      expect(game2.player1.socketId).toBe(socketId1.id);
      expect(game2.player2.socketId).toBe(socketId2.id);
    });
    test('should add new game to live games if no idle live game exists and return game', () => {
      const game3 = games.findGame(socketId3);
      expect(games.live.length).toBe(3);
      expect(game3.player1.socketId).toBe(socketId3.id);
    });
  });

  describe('removeGame()', () => {
    const games2 = new Games();
    const newUser = {
      id: '123456',
      user: {
        email: 'hikaru@nakamura.com',
        name: 'nakamura',
        rating: 2789,
      },
    };
    games2.addGame(newUser);
    test('should return false if game associated with passed socketId is not found', () => {
      const value = games2.removeGame('12345212');
      expect(games2.live.length).toBe(1);
      expect(value).toBe(false);
    });
    test('should return true if a game is successfully removed', () => {
      const value = games2.removeGame('123456');
      expect(value).toBe(true);
    });

    test('should remove game from list of live games', () => {
      expect(games2.live.length).toBe(0);
    });
    test('should return false if removeGame is called if no live game exists', () => {
      const value = games2.removeGame('123456');
      expect(value).toBe(false);
    });
  });
});

describe('opponentSocket()', () => {
  const player1 = {
    socketId: '12345',
    user: {
      email: 'magnus@carlsen.com',
      name: 'magnus',
      rating: 2888,
    },
  };
  const player2 = {
    socketId: '123456',
    user: {
      email: 'fabiano@caruana.com',
      name: 'caruana',
      rating: 2861,
    },
  };
  const game = {
    player1,
    player2,
  };
  player1.opponent = assignOpponentSocket(game, player1.socketId);
  test('should assign socket id to opponent', () => {
    expect(player1.opponent.socketId).toBe(player2.socketId);
  });
});
