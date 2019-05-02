import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import db from './config/database';
import Config from './config/config';

db.connectDb();

const app = express();
const port = Config.server.SERVER_PORT;
const { log } = console;
app.use(cors());

app.get('/api', (req, res) => res.json({ text: 'Online Chess Game!' }));

app
  .listen(port, () => log(`Example app listening on port ${port}!`))
  .on('close', () => db.disconnectDb());
