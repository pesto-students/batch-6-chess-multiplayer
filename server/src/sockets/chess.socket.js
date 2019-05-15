/* eslint-disable no-param-reassign */
import IO from 'socket.io';

import { assignOpponentSocket, Games } from './socket.utils';
import jwt from '../utils/jwt';
import userDataMiddleware from '../middleware/user';
import config from '../config/config';


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
  const io = IO(server, {
    handlePreflightRequest(req, res) {
      const headers = {
        'Access-Control-Allow-Headers': 'x-auth-token',
        'Access-Control-Allow-Origin': config.server.CLIENT_URL,
        'Access-Control-Allow-Credentials': true,
      };
      res.writeHead(200, headers);
      res.end();
    },
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.headers['x-auth-token'];
    const userId = jwt.verifyToken(token);
    socket.userId = userId;
    userDataMiddleware(socket, {}, next);
  });

  io.on('connection', (socket) => {
    const game = games.findGame(socket);
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
