// DB_HOST, DB_PORT, DB_NAME, CONNECTION_STRING, DB_OPTIONS
const {
  DB_HOST, DB_PORT, DB_NAME, CONNECTION_STRING, DB_OPTIONS = {},
  PORT, JWT_SECRET,
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
    SERVER_PORT: PORT || 3001,
    // TODO: sanitize these urls
    GOOGLE_OAUTH_URL: 'https://oauth2.googleapis.com/tokeninfo?id_token=',
    FACEBOOK_OAUTH_URL: 'https://graph.facebook.com/me?fields=name,email,first_name,last_name,picture&access_token=',
    JWT_SECRET: JWT_SECRET || 'local_env_secret',
  },
  chessGame: {
    WHITE_PLAYER: 'w',
    BLACK_PLAYER: 'b',
    GAME_DRAW: 'draw',
  },
};
