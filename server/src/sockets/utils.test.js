

import { Games, assignOpponentSocket } from './socket.utils';

describe('Games', () => {
  const games = new Games();
  const { live } = games;
  const socketId = '12345';
  const game = games.addGame(socketId);
  test('should create games object', () => {
    expect(live).toBeTruthy();
    expect(live).toBeInstanceOf(Array);
  });

  describe('addGame()', () => {
    test('should add new game to live games', () => {
      expect(game.player1).toBeTruthy();
      expect(game.player2).toBeFalsy();
      expect(game.isLive).toBeFalsy();
      expect(game.player1.socketId).toBe(socketId);
    });
  });

  describe('findIdleGame()', () => {
    let idleGame = games.findIdleGame();
    test('should return an idle game from live games if an idle game exists', () => {
      expect(idleGame).toBeTruthy();
      expect(idleGame.isLive).toBeFalsy();
    });
    test('should return undefined when no idle game is exists', () => {
      idleGame = idleGame.addPlayer2('123456');
      const idleGame2 = games.findIdleGame();
      expect(idleGame2).toBeFalsy();
    });
  });

  describe('findGame()', () => {
    const [socketId1, socketId2, socketId3] = ['Socket1', 'Socket2', 'Socket3'];
    test('should add a new game to live games if no live game exists and return game', () => {
      const game2 = games.findGame(socketId1);
      expect(games.live.length).toBe(2);
      expect(game2.player1.socketId).toBe(socketId1);
      expect(game2.isLive).toBeFalsy();
    });
    test('should add player2 to an idle game and return game', () => {
      const game2 = games.findGame(socketId2);
      expect(game2.player1.socketId).toBe(socketId1);
      expect(game2.player2.socketId).toBe(socketId2);
    });
    test('should add new game to live games if no idle live game exists and return game', () => {
      const game3 = games.findGame(socketId3);
      expect(games.live.length).toBe(3);
      expect(game3.player1.socketId).toBe(socketId3);
    });
  });

  describe('removeGame()', () => {
    const games2 = new Games();
    games2.addGame('12345');
    test('should return false if game associated with passed socketId is not found', () => {
      const value = games2.removeGame('12345212');
      expect(games2.live.length).toBe(1);
      expect(value).toBe(false);
    });
    test('should return true if a game is successfully removed', () => {
      const value = games2.removeGame('12345');
      expect(value).toBe(true);
    });

    test('should remove game from list of live games', () => {
      expect(games2.live.length).toBe(0);
    });
    test('should return false if removeGame is called if no live game exists', () => {
      const value = games2.removeGame('1234');
      expect(value).toBe(false);
    });
  });
});

describe('opponentSocket()', () => {
  const player1 = {
    socketId: '12345',

  };
  const player2 = {
    socketId: '123456',
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
