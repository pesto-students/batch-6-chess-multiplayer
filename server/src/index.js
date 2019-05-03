import express from 'express';
import 'dotenv/config';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import db from './config/database';
import Config from './config/config';
import auth from './routes/auth';

db.connectDb();

const app = express();
const port = Config.server.SERVER_PORT;
const { log } = console;
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

app.use('/auth', auth);
app.get('/api', (req, res) => res.json({ text: 'Online Chess Game!' }));

app
  .listen(port, () => log(`Example app listening on port ${port}!`))
  .on('close', () => db.disconnectDb());
