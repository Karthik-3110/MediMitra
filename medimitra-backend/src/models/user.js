const pool = require('../config/db');

const User = {
  // Create new user
  async create(full_name, email, password_hash, role) {
    const query = `
      INSERT INTO users (full_name, email, password_hash, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, full_name, email, role, created_at
    `;
    const values = [full_name, email, password_hash, role];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Find user by email
  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  },

  // Find user by ID
  async findById(id) {
    const query = 'SELECT id, full_name, email, role, created_at FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
};

module.exports = User;