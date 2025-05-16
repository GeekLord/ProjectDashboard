const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware: check admin
const requireAdmin = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'No token' });
  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// GET /api/users - list users
router.get('/', requireAdmin, async (req, res) => {
  const [users] = await pool.query('SELECT id, username, role, last_login_ip, last_login_at, created_at FROM users');
  res.json(users);
});

// POST /api/users - add user
router.post('/', requireAdmin, async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) return res.status(400).json({ message: 'Missing fields' });
  const hash = await bcrypt.hash(password, 12);
  try {
    await pool.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hash, role]);
    res.json({ message: 'User created' });
  } catch (err) {
    res.status(400).json({ message: 'Error creating user', error: err.message });
  }
});

// PUT /api/users/:id - edit user
router.put('/:id', requireAdmin, async (req, res) => {
  const { username, password, role } = req.body;
  const { id } = req.params;
  let query = 'UPDATE users SET username=?, role=?';
  let params = [username, role];
  if (password) {
    query += ', password=?';
    params.push(await bcrypt.hash(password, 12));
  }
  query += ' WHERE id=?';
  params.push(id);
  try {
    await pool.query(query, params);
    res.json({ message: 'User updated' });
  } catch (err) {
    res.status(400).json({ message: 'Error updating user', error: err.message });
  }
});

// DELETE /api/users/:id - delete user
router.delete('/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM users WHERE id=?', [id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting user', error: err.message });
  }
});

module.exports = router; 