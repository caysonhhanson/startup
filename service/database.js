const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('fitness');
const userCollection = db.collection('user');
const workoutCollection = db.collection('workout');
const leaderboardCollection = db.collection('leaderboard');

// Test connection
(async function testConnection() {
  await client.connect();
  await db.command({ ping: 1 });
})().catch((ex) => {
  console.log(`Unable to connect to database with ${url} because ${ex.message}`);
  process.exit(1);
});

// User functions
function getUser(email) {
  return userCollection.findOne({ email: email });
}

function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}

async function createUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    email: email,
    password: passwordHash,
    token: uuid.v4(),
    fitnessScore: 0,
    workoutsCompleted: 0,
    joinDate: new Date(),
  };
  await userCollection.insertOne(user);
  return user;
}

// Stats and workout functions
async function getUserStats(email) {
  const stats = await userCollection.findOne(
    { email: email },
    { projection: { 
      fitnessScore: 1, 
      workoutsCompleted: 1,
      _id: 0 
    }}
  );
  return stats || { fitnessScore: 0, workoutsCompleted: 0 };
}

async function addWorkout(workout) {
  const result = await workoutCollection.insertOne(workout);
  
  // Update user stats
  await userCollection.updateOne(
    { _id: workout.userId },
    { 
      $inc: { 
        workoutsCompleted: 1,
        fitnessScore: calculateWorkoutScore(workout)
      }
    }
  );
  
  return result;
}

function calculateWorkoutScore(workout) {
  // Example scoring logic
  return workout.duration * 10;
}

async function getUpcomingSessions() {
  const sessions = await workoutCollection.find({
    startTime: { $gt: new Date() }
  })
  .sort({ startTime: 1 })
  .limit(10)
  .toArray();
  
  return sessions;
}

// Leaderboard functions
async function getLeaderboard() {
  const leaders = await userCollection
    .find({})
    .sort({ fitnessScore: -1 })
    .limit(10)
    .project({
      email: 1,
      fitnessScore: 1,
      workoutsCompleted: 1,
      _id: 0
    })
    .toArray();
  return leaders;
}

module.exports = {
  getUser,
  getUserByToken,
  createUser,
  getUserStats,
  addWorkout,
  getUpcomingSessions,
  getLeaderboard,
};