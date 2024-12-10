const express = require('express');
const { connectToDatabase, createUser, getUser, validatePassword } = require('./database.js');
const jwt = require('jsonwebtoken');
const app = express();

const port = process.argv.length > 2 ? process.argv[2] : 4000;
const jwtSecret = 'your-secret-key-here';

let db; // Add this for database reference

app.use(express.json());
app.use(express.static('../dist'));

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// API Routes
const apiRouter = express.Router();
app.use(`/api`, apiRouter);

// Register endpoint
apiRouter.post('/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate password
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    
    // Check if user exists
    const existingUser = await getUser(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    await createUser(email, password);
    
    // Generate token and send response
    const token = jwt.sign({ email }, jwtSecret);
    res.status(201).json({ token, email });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Login endpoint
apiRouter.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await getUser(email);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Validate password
    const validPassword = await validatePassword(user, password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Generate token and send response
    const token = jwt.sign({ email }, jwtSecret);
    res.json({ token, email });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Protected routes
apiRouter.get('/workouts', (_req, res) => {
  res.json([
    { id: 1, name: 'HIIT Training', duration: 30 },
    { id: 2, name: 'Strength Building', duration: 45 }
  ]);
});

apiRouter.get('/leaderboard', (_req, res) => {
  res.json([
    { id: 1, name: 'John Doe', points: 1200, workouts: 15 },
    { id: 2, name: 'Jane Smith', points: 1150, workouts: 14 },
    { id: 3, name: 'Mike Johnson', points: 1100, workouts: 13 }
  ]);
});

apiRouter.get('/workouts/:userId', authenticateToken, (_req, res) => {
  res.json([
    { id: 1, type: 'HIIT', duration: 30, calories: 300, date: new Date() },
    { id: 2, type: 'Strength', duration: 45, calories: 400, date: new Date() }
  ]);
});

apiRouter.get('/nutrition/:userId', authenticateToken, (_req, res) => {
  res.json({
    calories: 2000,
    protein: '150g',
    carbs: '200g',
    fats: '70g'
  });
});

// Error handling
app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

// Default route handler
app.use((_req, res) => {
  res.sendFile('index.html', { root: '../dist' });
});

// Start server with database connection
async function startServer() {
  try {
    const database = await connectToDatabase();
    db = database; // Store database reference
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();