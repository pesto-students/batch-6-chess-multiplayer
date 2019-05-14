import IO from 'socket.io-client';
import Config from '../config/globalConfig';

let socket;

const createConnection = () => {
  socket = IO.connect(Config.serverUrl);
};

const receiveGameData = (cb) => {
  socket.on('gameData', (gameData) => {
    cb(gameData);
  });
};


const sendMove = (moveObj, callBack) => {
  socket.emit('pieceMoved', moveObj, callBack);
};

const receiveMove = (cb) => {
  socket.on('movePiece', (moveData) => {
    cb(moveData);
  });
};

const disconnect = () => {
  socket.disconnect();
};


const opponentDisconnected = (cb) => {
  socket.on('opponentDisconnected', (message) => {
    socket.disconnect();
    cb(message);
  });
};

export {
  receiveGameData,
  createConnection,
  sendMove,
  receiveMove,
  disconnect,
  opponentDisconnected,
};
