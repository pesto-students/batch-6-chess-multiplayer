/* eslint-disable no-param-reassign */
import IO from 'socket.io';

import { assignOpponentSocket, Games } from './socket.utils';

const games = new Games();

const removePlayer2 = (socket) => {
  const { player1 } = socket.game;
  const { player2 } = socket.game;
  if (socket.game.inPlay && socket.id === player1.socketId) {
    socket.game.player1 = Object.assign({}, player2);
  }
  socket.game.player2 = {};
  socket.game.inPlay = false;
};

const emitValidMove = (moveObj, socket, io, game) => {
  const opponent = assignOpponentSocket(socket.game, socket.id);
  const curTime = game.flipTimer();
  io.to(opponent.socketId).emit('movePiece', { moveObj, time: curTime });
  socket.emit('movePiece', { moveObj, time: curTime });
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
      io.to(opponent.socketId).emit('gameData', { game, time: initTime });
    }

    socket.emit('gameData', { game, time: initTime });

    socket.on('pieceMoved', (moveObj, cb) => {
      const { color } = socket.playerInfo;
      const isPlayerColor = color === moveObj.color;
      return isPlayerColor
        ? emitValidMove(moveObj, socket, io, game)
        : cb({ validMove: false, playerColor: color });
    });

    socket.on('disconnect', () => (!socket.game.inPlay ? games.removeGame(socket.id) : removePlayer2(socket)));
  });
};

export default chessSocket;
