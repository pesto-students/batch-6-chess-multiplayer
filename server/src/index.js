import express from 'express';
import 'dotenv/config';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import http from 'http';
import db from './config/database';
import Config from './config/config';
import auth from './routes/auth';
import Socket from './sockets/chess.socket';
import router from './router';
import authMiddleware from './middleware/auth';

const app = express();
const server = http.createServer(app);
const port = Config.server.SERVER_PORT;
const { log } = console;

db.connectDb();
app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/auth', auth);
app.use('/', router);
app.get('/dashboard', authMiddleware, (req, res) => {
  res.send('User'); // placeholder
  // TODO: have a separate route which uses token in header to get user data using User model.
});

server
  .listen(port, () => log(`Example app listening on port ${port}!`))
  .on('close', () => db.disconnectDb());

Socket(server);
