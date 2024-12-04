const express = require('express');
const app = express();

const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());

app.use(express.static('public'));

const workouts = [
  { id: 1, name: 'HIIT Training', duration: 30 },
  { id: 2, name: 'Strength Building', duration: 45 },
  { id: 3, name: 'Cardio Blast', duration: 25 }
];

const leaderboard = [
  { id: 1, name: 'John Doe', points: 1200, workouts: 15 },
  { id: 2, name: 'Jane Smith', points: 1150, workouts: 14 },
  { id: 3, name: 'Mike Johnson', points: 1100, workouts: 13 }
];

const apiRouter = express.Router();
app.use(`/api`, apiRouter);

apiRouter.post('/auth/login', (req, res) => {
  const { email } = req.body;
  res.send({ id: email, email: email });
});

apiRouter.get('/workouts', (_req, res) => {
  res.send(workouts);
});

apiRouter.get('/leaderboard', (_req, res) => {
  res.send(leaderboard);
});

app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});