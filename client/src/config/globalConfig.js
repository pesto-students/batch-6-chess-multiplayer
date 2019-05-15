
const {
  REACT_APP_SERVER_HOST: serverHost = 'http://localhost:3001',
} = process.env;

export default {
  serverUrl: `${serverHost}`,
  loginRoute: '/',
  dashboardRoute: '/dashboard',
  chessGameRoute: '/chess-game',
  leaderboardRoute: '/leaderboard',
};
