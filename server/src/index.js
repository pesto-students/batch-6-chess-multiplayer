import express from 'express';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());

app.get('/', (req, res) => res.json({ text: 'Hello World!' }));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
