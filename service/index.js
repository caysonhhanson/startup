const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const app = express();
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.username}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('startup');

// Express setup
app.use(express.json());
app.use(express.static('public'));

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

const port = process.argv.length > 2 ? process.argv[2] : 4000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});