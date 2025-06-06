// data/database.js
const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Missing MongoDB URI in environment variables.');
}

let client;
let db;

async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Connected to MongoDB');
    db = client.db('contacts_db'); // Specify your database name here
  }
  return client;
}

// Alternative function name for compatibility
async function initDb() {
  return await connectToDatabase();
}

function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call connectToDatabase first.');
  }
  return db;
}

// Alternative function name for compatibility
function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized. Call connectToDatabase first.');
  }
  return { db: () => db };
}

module.exports = { 
  connectToDatabase, 
  initDb,
  getDb,
  getDatabase
};