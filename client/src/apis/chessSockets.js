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


const sendMove = (moveObj) => {
  socket.emit('pieceMoved', moveObj);
};

const receiveMove = (cb) => {
  socket.on('movePiece', (moveData) => {
    cb(moveData);
  });
};

const disconnect = () => {
  socket.disconnect();
};

export {
  receiveGameData,
  createConnection,
  sendMove,
  receiveMove,
  disconnect,
};
