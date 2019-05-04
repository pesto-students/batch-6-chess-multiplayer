
const {
  REACT_APP_SERVER_HOST: serverHost = 'http://localhost',
  REACT_APP_SERVER_PORT: serverPort = 3001,
} = process.env;

export default {
  serverUrl: `${serverHost}:${serverPort}`,
};
