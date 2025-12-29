const cors = require('cors');



// Make sure you have these imports
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({
  origin: [
    'http://localhost:5500',
    'http://127.0.0.1:5500'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


// Configure body-parser PROPERLY
app.use(bodyParser.json());  // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));  // Parse URL-encoded bodies

// Import database connection
const db = require('./src/config/db');

// Import routes
const authRoutes = require('./src/routes/authRoutes');

// Use routes
app.use('/api/auth', authRoutes);

// Add error handling for JSON parsing
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('❌ JSON Parsing Error:', err.message);
    return res.status(400).json({ 
      error: 'Invalid JSON format in request body',
      details: 'Make sure to send valid JSON without single quotes',
      example: {
        "full_name": "John Doe",
        "email": "john@example.com",
        "password": "secret123",
        "role": "patient"
      }
    });
  }
  next();
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    const result = await db.query('SELECT NOW() as time');
    
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        time: result.rows[0].time,
        name: process.env.DB_NAME || 'medimitra_bd'
      },
      server: 'Medimitra Backend API v1.0'
    });
  } catch (err) {
    res.json({
      status: 'WARNING',
      timestamp: new Date().toISOString(),
      database: {
        connected: false,
        error: err.message
      },
      server: 'Medimitra Backend API v1.0',
      note: 'API is running but database connection failed'
    });
  }
});

// Simple test endpoint
app.get('/api/auth/test', (req, res) => {
  res.json({ 
    message: 'Auth endpoint is working!',
    timestamp: new Date().toISOString()
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    available_endpoints: {
      health: 'GET /api/health',
      auth_test: 'GET /api/auth/test',
      signup: 'POST /api/auth/signup',
      signin: 'POST /api/auth/signin'
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('💥 Server Error:', err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server started successfully!`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`🔍 Health: http://localhost:${PORT}/api/health`);
  console.log(`👤 Auth Test: http://localhost:${PORT}/api/auth/test`);
  
  console.log(`\n📊 API Endpoints:`);
  console.log(`   POST /api/auth/signup - Register new user`);
  console.log(`   POST /api/auth/signin - Login user`);
  console.log(`   GET  /api/auth/test   - Test endpoint`);
  
  console.log(`\n📁 Database: ${process.env.DB_NAME || 'medimitra_bd'}`);
});