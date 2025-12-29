const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { full_name, email, password, role } = req.body;
    
    // Validate input
    if (!full_name || !email || !password || !role) {
      return res.status(400).json({ 
        error: 'All fields are required: full_name, email, password, role' 
      });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    
    // Insert user
    const result = await db.query(
      'INSERT INTO users (full_name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, full_name, email, role, created_at',
      [full_name, email, password_hash, role]
    );
    
    // Create JWT token
    const token = jwt.sign(
      { userId: result.rows[0].id, email: result.rows[0].email, role: result.rows[0].role },
      process.env.JWT_SECRET || 'medimitra_secret_key_2025',
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: result.rows[0].id,
        full_name: result.rows[0].full_name,
        email: result.rows[0].email,
        role: result.rows[0].role,
        created_at: result.rows[0].created_at
      },
      token: token
    });
    
  } catch (err) {
    if (err.code === '23505') { // Unique violation (duplicate email)
      return res.status(400).json({ 
        error: 'Email already exists' 
      });
    }
    console.error('Signup error:', err);
    res.status(500).json({ 
      error: 'Registration failed', 
      details: err.message 
    });
  }
});

// Signin route
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }
    
    // Find user
    const result = await db.query(
      'SELECT id, full_name, email, password_hash, role FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }
    
    const user = result.rows[0];
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'medimitra_secret_key_2025',
      { expiresIn: '24h' }
    );
    
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role
      },
      token: token
    });
    
  } catch (err) {
    console.error('Signin error:', err);
    res.status(500).json({ 
      error: 'Login failed', 
      details: err.message 
    });
  }
});

module.exports = router;