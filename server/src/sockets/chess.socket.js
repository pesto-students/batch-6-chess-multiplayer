/* eslint-disable no-param-reassign */
import IO from 'socket.io';

import { assignOpponentSocket, Games } from './socket.utils';

const games = new Games();

const emitValidMove = (moveObj, socket, io, game) => {
  const opponent = assignOpponentSocket(socket.game, socket.id);
  const curTime = game.flipTimer();
  socket.emit('movePiece', { moveObj, time: curTime });
  if (opponent) {
    io.to(opponent.socketId).emit('movePiece', { moveObj, time: curTime });
  }
};

const disconnectPlayers = (socket, io) => {
  const opponent = assignOpponentSocket(socket.game, socket.id);
  if (opponent) {
    io.to(opponent.socketId).emit('opponentDisconnected');
  }
  return games.removeGame(socket.id);
};

const chessSocket = (server) => {
  const io = IO(server);
  io.on('connection', (socket) => {
    const game = games.findGame(socket.id);
    const initTime = game.getTime();
    socket.game = game;
    socket.playerInfo = game.inPlay ? game.player2 : game.player1;
    if (game.player2) {
      const opponent = assignOpponentSocket(socket.game, socket.id);
      if (opponent) {
        io.to(opponent.socketId).emit('gameData', { game, time: initTime });
      }
    }

    socket.emit('gameData', { game, time: initTime });

    socket.on('pieceMoved', (moveObj, cb) => {
      const { color } = socket.playerInfo;
      const isPlayerColor = color === moveObj.color;
      return isPlayerColor
        ? emitValidMove(moveObj, socket, io, game)
        : cb({ validMove: false, playerColor: color });
    });

    socket.on('disconnect', () => {
      disconnectPlayers(socket, io);
    });
  });
};

export default chessSocket;
