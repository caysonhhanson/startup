const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const DB = require('./database.js');
const { WebSocketServer } = require('ws');

const authCookieName = 'token';
const port = process.argv.length > 2 ? process.argv[2] : 3000;

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
app.set('trust proxy', true);

// Router for service endpoints
const apiRouter = express.Router();
app.use(`/api`, apiRouter);

// CreateAuth token for a new user
apiRouter.post('/auth/create', async (req, res) => {
  if (await DB.getUser(req.body.email)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await DB.createUser(req.body.email, req.body.password);
    setAuthCookie(res, user.token);
    res.send({ id: user._id });
  }
});

// GetAuth token for the provided credentials
apiRouter.post('/auth/login', async (req, res) => {
  const user = await DB.getUser(req.body.email);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      setAuthCookie(res, user.token);
      res.send({ id: user._id });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// DeleteAuth token if stored in cookie
apiRouter.delete('/auth/logout', (_req, res) => {
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// secureApiRouter verifies credentials for endpoints
const secureApiRouter = express.Router();
apiRouter.use(secureApiRouter);

secureApiRouter.use(async (req, res, next) => {
  const authToken = req.cookies[authCookieName];
  const user = await DB.getUserByToken(authToken);
  if (user) {
    req.user = user;
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

// Get user stats
secureApiRouter.get('/user/stats', async (req, res) => {
  const stats = await DB.getUserStats(req.user?.email);
  res.send(stats);
});

// Get upcoming sessions
secureApiRouter.get('/sessions', async (req, res) => {
  const sessions = await DB.getUpcomingSessions();
  res.send(sessions);
});

// Get leaderboard
secureApiRouter.get('/leaderboard', async (req, res) => {
  const leaders = await DB.getLeaderboard();
  res.send(leaders);
});

// Record completed workout
secureApiRouter.post('/workout/complete', async (req, res) => {
  const workout = {
    ...req.body,
    userId: req.user?._id,
    completedAt: new Date()
  };
  await DB.addWorkout(workout);
  res.send({ status: 'success' });
});

function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

// Create HTTP server
const httpService = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// Create WebSocket server
const wss = new WebSocketServer({ server: httpService });

// Store active connections
const connections = new Set();

// Handle WebSocket connection
wss.on('connection', (ws) => {
  connections.add(ws);
  
  // Send initial data
  sendLeaderboardUpdate(ws);
  sendSessionsUpdate(ws);
  
  ws.on('message', async (data) => {
    const msg = JSON.parse(data);
    
    if (msg.type === 'workout_complete') {
      await DB.addWorkout(msg.workout);
      broadcastLeaderboard();
    }
  });
  
  ws.on('close', () => {
    connections.delete(ws);
  });
});

// Broadcast functions
async function broadcastLeaderboard() {
  const leaders = await DB.getLeaderboard();
  const message = JSON.stringify({
    type: 'leaderboard_update',
    data: leaders
  });
  
  connections.forEach((client) => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
}

async function sendLeaderboardUpdate(ws) {
  const leaders = await DB.getLeaderboard();
  ws.send(JSON.stringify({
    type: 'leaderboard_update',
    data: leaders
  }));
}

async function sendSessionsUpdate(ws) {
  const sessions = await DB.getUpcomingSessions();
  ws.send(JSON.stringify({
    type: 'sessions_update',
    data: sessions
  }));
}

// Periodically update live sessions
setInterval(async () => {
  const sessions = await DB.getUpcomingSessions();
  const message = JSON.stringify({
    type: 'sessions_update',
    data: sessions
  });
  
  connections.forEach((client) => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
}, 30000);
