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

const chessSocket = (server) => {
  const io = IO(server);
  io.on('connection', (socket) => {
    const game = games.findGame(socket.id);
    socket.game = game;
    if (game.player2) {
      const opponent = assignOpponentSocket(socket.game, socket.id);
      io.to(opponent.socketId).emit('gameData', { game });
    }

    socket.emit('gameData', { game });

    socket.on('pieceMoved', (moveObj) => {
      const opponent = assignOpponentSocket(socket.game, socket.id);
      io.to(opponent.socketId).emit('movePiece', moveObj);
    });

    socket.on('disconnect', () => {
      if (!socket.game.inPlay) {
        games.removeGame(socket.id);
      } else {
        removePlayer2(socket);
      }
    });
  });
};

export default chessSocket;
