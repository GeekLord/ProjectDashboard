const express = require('express');
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

// Ensure forms table exists
const ensureTable = async () => {
  await pool.query(`CREATE TABLE IF NOT EXISTS forms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    schema JSON NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
  )`);
};

// GET /api/forms/:project_id - get form schema for a project
router.get('/:project_id', requireAuth, async (req, res) => {
  await ensureTable();
  const { project_id } = req.params;
  const [rows] = await pool.query('SELECT * FROM forms WHERE project_id=?', [project_id]);
  if (rows.length === 0) return res.status(404).json({ message: 'Form not found' });
  res.json(rows[0]);
});

// POST /api/forms/:project_id - create form schema (admin)
router.post('/:project_id', requireAdmin, async (req, res) => {
  await ensureTable();
  const { project_id } = req.params;
  const { schema } = req.body;
  if (!schema) return res.status(400).json({ message: 'Schema required' });
  try {
    await pool.query('INSERT INTO forms (project_id, schema) VALUES (?, ?)', [project_id, JSON.stringify(schema)]);
    res.json({ message: 'Form created' });
  } catch (err) {
    res.status(400).json({ message: 'Error creating form', error: err.message });
  }
});

// PUT /api/forms/:project_id - update form schema (admin)
router.put('/:project_id', requireAdmin, async (req, res) => {
  await ensureTable();
  const { project_id } = req.params;
  const { schema } = req.body;
  if (!schema) return res.status(400).json({ message: 'Schema required' });
  try {
    await pool.query('UPDATE forms SET schema=? WHERE project_id=?', [JSON.stringify(schema), project_id]);
    res.json({ message: 'Form updated' });
  } catch (err) {
    res.status(400).json({ message: 'Error updating form', error: err.message });
  }
});

// DELETE /api/forms/:project_id - delete form schema (admin)
router.delete('/:project_id', requireAdmin, async (req, res) => {
  await ensureTable();
  const { project_id } = req.params;
  try {
    await pool.query('DELETE FROM forms WHERE project_id=?', [project_id]);
    res.json({ message: 'Form deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting form', error: err.message });
  }
});

module.exports = router; 