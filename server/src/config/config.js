// DB_HOST, DB_PORT, DB_NAME, CONNECTION_STRING, DB_OPTIONS
const {
  DB_HOST, DB_PORT, DB_NAME, CONNECTION_STRING, DB_OPTIONS = {},
  SERVER_PORT,
} = process.env;

export default {
  db: {
    DB_HOST: DB_HOST || 'localhost',
    DB_PORT: DB_PORT || 27017,
    DB_NAME: DB_NAME || 'chess_dev',
    CONNECTION_STRING: CONNECTION_STRING || null,
    DB_OPTIONS: DB_OPTIONS || {},
  },
  server: {
    SERVER_PORT: SERVER_PORT || 3001,
  },
};
