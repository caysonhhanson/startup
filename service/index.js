const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const { WebSocketServer } = require('ws');
const app = express();
const config = require('./dbConfig.json');

// MongoDB setup
const url = `mongodb+srv://${config.username}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('startup');

// Express setup
app.use(express.json());
app.use(express.static('public'));

// Create HTTP server
const port = process.argv.length > 2 ? process.argv[2] : 4000;
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// Create WebSocket server
const wss = new WebSocketServer({ server });

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('New client connected');

  // Send initial leaderboard data
  sendLeaderboardUpdate(ws);

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Function to broadcast leaderboard updates to all connected clients
function broadcastLeaderboard(leaderboardData) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'leaderboardUpdate',
        data: leaderboardData
      }));
    }
  });
}

// Function to send leaderboard update to a specific client
async function sendLeaderboardUpdate(ws) {
  try {
    const leaderboard = await db.collection('leaderboard').find().toArray();
    ws.send(JSON.stringify({
      type: 'leaderboardUpdate',
      data: leaderboard
    }));
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
  }
}

// MongoDB connection
(async function () {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
})();

// Authentication endpoints
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      res.status(409).send({ message: 'User already exists' });
      return;
    }

    const result = await db.collection('users').insertOne({
      email,
      password: hashedPassword,
      createdAt: new Date()
    });

    // Create initial leaderboard entry for new user
    await db.collection('leaderboard').insertOne({
      userId: result.insertedId,
      name: email.split('@')[0], // Use email username as display name
      points: 0,
      workouts: 0
    });

    // Broadcast updated leaderboard
    const leaderboard = await db.collection('leaderboard').find().toArray();
    broadcastLeaderboard(leaderboard);

    res.send({ id: result.insertedId, email });
  } catch (error) {
    res.status(500).send({ message: 'Error creating user' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      res.status(401).send({ message: 'Invalid credentials' });
      return;
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).send({ message: 'Invalid credentials' });
      return;
    }

    res.send({ id: user._id, email: user.email });
  } catch (error) {
    res.status(500).send({ message: 'Error logging in' });
  }
});

// Protected data endpoints
const authMiddleware = async (req, res, next) => {
  const userId = req.headers['user-id'];
  if (!userId) {
    res.status(401).send({ message: 'Unauthorized' });
    return;
  }
  next();
};

app.get('/api/workouts', authMiddleware, async (req, res) => {
  try {
    const workouts = await db.collection('workouts').find().toArray();
    res.send(workouts);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching workouts' });
  }
});

app.get('/api/leaderboard', authMiddleware, async (req, res) => {
  try {
    const leaderboard = await db.collection('leaderboard').find().toArray();
    res.send(leaderboard);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching leaderboard' });
  }
});

// Update leaderboard endpoint
app.post('/api/leaderboard/update', authMiddleware, async (req, res) => {
  try {
    const { userId, points, workouts } = req.body;
    await db.collection('leaderboard').updateOne(
      { userId },
      { 
        $set: { points, workouts },
        $setOnInsert: { 
          name: (await db.collection('users').findOne({ _id: userId }))?.email.split('@')[0] 
        }
      },
      { upsert: true }
    );
    
    // Fetch and broadcast updated leaderboard
    const leaderboard = await db.collection('leaderboard').find().toArray();
    broadcastLeaderboard(leaderboard);
    
    res.send({ message: 'Leaderboard updated' });
  } catch (error) {
    res.status(500).send({ message: 'Error updating leaderboard' });
  }
});

// Error handling middleware
app.use(function (err, req, res, next) {
  console.error(err);
  res.status(500).send({ type: err.name, message: err.message });
});

// Default route handler
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});