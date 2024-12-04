const express = require('express');
const app = express();
const DB = require('./database.js');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');

const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());

app.use(cookieParser());

app.use(express.static('public'));

const apiRouter = express.Router();
app.use(`/api`, apiRouter);

apiRouter.post('/auth/create', async (req, res) => {
  if (await DB.getUser(req.body.email)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await DB.createUser(req.body.email, req.body.password);
    res.send({
      id: user._id,
    });
  }
});

apiRouter.post('/auth/login', async (req, res) => {
  const user = await DB.getUser(req.body.email);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send({ id: user._id });
    } else {
      res.status(401).send({ msg: 'Unauthorized' });
    }
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

apiRouter.get('/leaderboard', async (_req, res) => {
  const leaderboard = await DB.getLeaderboard();
  res.send(leaderboard);
});

apiRouter.post('/workout', async (req, res) => {
  const workout = await DB.addWorkout(req.body);
  res.send(workout);
});

apiRouter.get('/workouts/:userId', async (req, res) => {
  const workouts = await DB.getUserWorkouts(req.params.userId);
  res.send(workouts);
});

app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});