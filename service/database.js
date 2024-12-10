const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');
const bcrypt = require('bcrypt');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('realtime_fitness');

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected successfully to database');
    return db;
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }
}

// User authentication functions
async function createUser(email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await db.collection('users').insertOne({
    email,
    password: hashedPassword,
    createdAt: new Date()
  });
  return result;
}

async function getUser(email) {
  return await db.collection('users').findOne({ email });
}

async function validatePassword(user, password) {
  return await bcrypt.compare(password, user.password);
}

module.exports = {
  connectToDatabase,
  getDb: () => db,
  createUser,
  getUser,
  validatePassword
};