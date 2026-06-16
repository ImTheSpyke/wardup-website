import express, { Request, Response } from 'express';
import path from 'path';
import axios from 'axios';
import https from 'https';

const app = express();

const appRoot = path.join(__dirname, '../public');

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${req.get('User-Agent')}`);
  next();
});

app.get('/', (_req: Request, res: Response) => {
  res.sendFile('champions.html', { root: appRoot });
});

app.get('/scoreboard', (_req: Request, res: Response) => {
  res.sendFile('scoreboard.html', { root: appRoot });
});

app.get('/player-overlay', (_req: Request, res: Response) => {
  res.sendFile('player-overlay.html', { root: appRoot });
});

app.get('/api/alldata', async (_req: Request, res: Response) => {
  try {
    const instance = axios.create({
        httpsAgent: new https.Agent({
        rejectUnauthorized: false
        })
    });

    const response = await instance.get('https://127.0.0.1:2999/liveclientdata/allgamedata');

    res.json(response.data);
  } catch(e) {
    res.status(200).json({ error: 'Failed to fetch data' });
  }
});


/* /assets/img/my-image.png
assets/blabla.png
assets/script/js/javascript/script.js
assets/data/logo.svg
*/
app.get('/assets/*path', (req: Request, res: Response) => {
  res.sendFile(req.path, { root: appRoot });
});

const port = 80;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

