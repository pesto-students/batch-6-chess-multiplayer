import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3001;
const { log } = console;
app.use(cors());

app.get('/api', (req, res) => res.json({ text: 'Hello World!' }));

app.listen(port, () => log(`Example app listening on port ${port}!`));
