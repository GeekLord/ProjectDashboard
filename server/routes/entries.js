const express = require('express');
const pool = require('../db');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware: check authenticated
const requireAuth = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'No token' });
  try {
    const token = auth.split(' ')[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// GET /api/entries - list entries (admin: all, pm: own)
router.get('/', requireAuth, async (req, res) => {
  if (req.user.role === 'admin') {
    const [entries] = await pool.query('SELECT * FROM project_data_entries');
    return res.json(entries);
  } else {
    const [entries] = await pool.query('SELECT * FROM project_data_entries WHERE user_id=?', [req.user.id]);
    return res.json(entries);
  }
});

// POST /api/entries - submit entry (pm only)
router.post('/', requireAuth, async (req, res) => {
  if (req.user.role !== 'project_manager') return res.status(403).json({ message: 'Forbidden' });
  const { project_id, data, gps_location } = req.body;
  if (!project_id || !data) return res.status(400).json({ message: 'Missing fields' });
  try {
    await pool.query(
      'INSERT INTO project_data_entries (project_id, user_id, data, ip_address, gps_location, user_agent) VALUES (?, ?, ?, ?, ?, ?)',
      [
        project_id,
        req.user.id,
        JSON.stringify(data),
        req.ip,
        gps_location || null,
        req.headers['user-agent'] || null
      ]
    );
    res.json({ message: 'Entry submitted' });
  } catch (err) {
    res.status(400).json({ message: 'Error submitting entry', error: err.message });
  }
});

// PUT /api/entries/:id - edit own entry (pm only)
router.put('/:id', requireAuth, async (req, res) => {
  if (req.user.role !== 'project_manager') return res.status(403).json({ message: 'Forbidden' });
  const { id } = req.params;
  const { data, gps_location } = req.body;
  try {
    // Only allow editing own entries
    const [rows] = await pool.query('SELECT * FROM project_data_entries WHERE id=? AND user_id=?', [id, req.user.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Entry not found' });
    await pool.query(
      'UPDATE project_data_entries SET data=?, gps_location=?, user_agent=? WHERE id=?',
      [JSON.stringify(data), gps_location || null, req.headers['user-agent'] || null, id]
    );
    res.json({ message: 'Entry updated' });
  } catch (err) {
    res.status(400).json({ message: 'Error updating entry', error: err.message });
  }
});

// DELETE /api/entries/:id - delete own entry (pm only)
router.delete('/:id', requireAuth, async (req, res) => {
  if (req.user.role !== 'project_manager') return res.status(403).json({ message: 'Forbidden' });
  const { id } = req.params;
  try {
    // Only allow deleting own entries
    const [rows] = await pool.query('SELECT * FROM project_data_entries WHERE id=? AND user_id=?', [id, req.user.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Entry not found' });
    await pool.query('DELETE FROM project_data_entries WHERE id=?', [id]);
    res.json({ message: 'Entry deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting entry', error: err.message });
  }
});

module.exports = router; 