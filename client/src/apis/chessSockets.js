import IO from 'socket.io-client';
import Config from '../config/globalConfig';

let socket;

const createConnection = () => {
  const token = localStorage.getItem('jwt');
  socket = IO.connect(Config.serverUrl, {
    transportOptions: {
      polling: {
        extraHeaders: {
          'x-auth-token': token,
        },
      },
    },
  });
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

const gameOver = (winner, resign = false) => {
  socket.emit('gameOver', winner, resign);
};

const receiveGameOverData = (cb) => {
  socket.on('receiveGameOver', (gameOverDetails) => {
    cb(gameOverDetails);
  });
};

const onDisconnect = (cb) => {
  socket.on('disconnect', (message) => {
    if (!message.match('server disconnect')) {
      cb();
    }
  });
};
export {
  receiveGameData,
  createConnection,
  sendMove,
  receiveMove,
  disconnect,
  opponentDisconnected,
  gameOver,
  receiveGameOverData,
  onDisconnect,
};
