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

// GET /api/projects - list all projects (admin) or assigned (pm)
router.get('/', requireAuth, async (req, res) => {
  if (req.user.role === 'admin') {
    const [projects] = await pool.query('SELECT * FROM projects');
    return res.json(projects);
  } else {
    const [projects] = await pool.query(
      `SELECT p.* FROM projects p
       JOIN project_manager_assignments a ON p.id = a.project_id
       WHERE a.user_id = ?`,
      [req.user.id]
    );
    return res.json(projects);
  }
});

// POST /api/projects - create project (admin)
router.post('/', requireAdmin, async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ message: 'Name required' });
  try {
    await pool.query('INSERT INTO projects (name, description, created_by) VALUES (?, ?, ?)', [name, description, req.user.id]);
    res.json({ message: 'Project created' });
  } catch (err) {
    res.status(400).json({ message: 'Error creating project', error: err.message });
  }
});

// PUT /api/projects/:id - update project (admin)
router.put('/:id', requireAdmin, async (req, res) => {
  const { name, description } = req.body;
  const { id } = req.params;
  try {
    await pool.query('UPDATE projects SET name=?, description=? WHERE id=?', [name, description, id]);
    res.json({ message: 'Project updated' });
  } catch (err) {
    res.status(400).json({ message: 'Error updating project', error: err.message });
  }
});

// DELETE /api/projects/:id - delete project (admin)
router.delete('/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM projects WHERE id=?', [id]);
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting project', error: err.message });
  }
});

// POST /api/projects/:id/assign - assign/unassign project manager (admin)
router.post('/:id/assign', requireAdmin, async (req, res) => {
  const { user_id, action } = req.body; // action: 'assign' or 'unassign'
  const { id } = req.params;
  if (!user_id || !['assign', 'unassign'].includes(action)) return res.status(400).json({ message: 'Invalid request' });
  try {
    if (action === 'assign') {
      await pool.query('INSERT IGNORE INTO project_manager_assignments (project_id, user_id) VALUES (?, ?)', [id, user_id]);
      res.json({ message: 'Project manager assigned' });
    } else {
      await pool.query('DELETE FROM project_manager_assignments WHERE project_id=? AND user_id=?', [id, user_id]);
      res.json({ message: 'Project manager unassigned' });
    }
  } catch (err) {
    res.status(400).json({ message: 'Error updating assignment', error: err.message });
  }
});

module.exports = router; 