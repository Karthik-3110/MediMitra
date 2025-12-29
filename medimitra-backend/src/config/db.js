const { Pool } = require('pg');
require('dotenv').config();

// Database configuration - FIXED VERSION
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'medimitra_bd',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Initialize database on startup
(async () => {
  console.log('🔧 Initializing database connection...');
  
  try {
    const client = await pool.connect();
    console.log(`✅ Connected to PostgreSQL database: ${process.env.DB_NAME || 'medimitra_bd'}`);
    
    // Create users table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table ready (created if not exists)');
    
    client.release();
  } catch (err) {
    if (err.code === '3D000') { // Database doesn't exist
      console.log('⚠️  Database does not exist. Creating it...');
      await createDatabase();
    } else {
      console.error('❌ Database initialization error:', err.message);
      console.log('💡 Check your .env file and PostgreSQL service');
    }
  }
})();

// Function to create database (only if needed)
async function createDatabase() {
  const { Client } = require('pg');
  
  // Connect to default 'postgres' database
  const adminClient = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: 'postgres',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
  });

  try {
    await adminClient.connect();
    await adminClient.query(`CREATE DATABASE ${process.env.DB_NAME || 'medimitra_bd'}`);
    console.log(`✅ Database "${process.env.DB_NAME || 'medimitra_bd'}" created`);
    await adminClient.end();
    
    // Now wait and reconnect
    console.log('🔄 Reconnecting to new database...');
    setTimeout(() => {
      // The pool will automatically reconnect to the new database
      console.log('✅ Database setup complete!');
    }, 2000);
  } catch (err) {
    console.error('❌ Failed to create database:', err.message);
  }
}

// Export the pool for use in other files
module.exports = pool;