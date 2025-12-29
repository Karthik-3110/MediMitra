const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRoutes = require('./routes/authroutes');

// Routes
app.use('/api/auth', authRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Medimitra Backend API is working!' });
});

// Health check route
app.get('/api/health', async (req, res) => {
  try {
    const db = require('./config/db');
    // Test database connection
    const result = await db.query('SELECT NOW()');
    
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        time: result.rows[0].now,
        name: process.env.DB_NAME || 'medimitra_bd'
      },
      server: 'Medimitra Backend API v1.0'
    });
  } catch (error) {
    res.json({ 
      status: 'WARNING', 
      timestamp: new Date().toISOString(),
      database: {
        connected: false,
        error: error.message
      },
      server: 'Medimitra Backend API v1.0',
      note: 'API is running but database connection failed'
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;