import IO from 'socket.io-client';

const { REACT_APP_SERVER_URL } = process.env;

let socket;

const createConnection = () => {
  socket = IO.connect(REACT_APP_SERVER_URL);
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
  socket.on('movePiece', (moveObj) => {
    cb(moveObj);
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
