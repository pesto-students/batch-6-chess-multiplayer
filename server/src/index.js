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

server
  .listen(port, () => log(`Example app listening on port ${port}!`))
  .on('close', () => db.disconnectDb());

Socket(server);
