import express from 'express';
import pool from '../db.js';

const router = express.Router();

// List notes for current user
router.get('/', async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await pool.query(
      'SELECT id, title, content, images, labels, created_at, updated_at FROM notes WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('List notes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new note
router.post('/', async (req, res) => {
  const userId = req.user.id;
  const { title, content, images, labels } = req.body;
  if (!title && !content) {
    return res.status(400).json({ error: 'title or content is required' });
  }
  
  try {
    const result = await pool.query(
      'INSERT INTO notes (user_id, title, content, images, labels) VALUES ($1, $2, $3, $4, $5) RETURNING id, title, content, images, labels, created_at, updated_at',
      [userId, title || null, content || null, images || [], labels || []]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a note
router.put('/:id', async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { title, content, images, labels } = req.body;

  try {
    const result = await pool.query(
      'UPDATE notes SET title = COALESCE($1, title), content = COALESCE($2, content), images = COALESCE($3, images), labels = COALESCE($4, labels), updated_at = NOW() WHERE id = $5 AND user_id = $6 RETURNING id, title, content, images, labels, created_at, updated_at',
      [title ?? null, content ?? null, images ?? null, labels ?? null, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a note
router.delete('/:id', async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.status(204).end();
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
