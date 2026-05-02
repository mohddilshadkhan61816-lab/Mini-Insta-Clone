const express = require('express');
const { db } = require('../database/db');
const { authenticateToken } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/', authenticateToken, upload.single('image'), (req, res) => {
  try {
    const { caption } = req.body;
    const userId = req.user.userId;

    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const result = db.prepare('INSERT INTO posts (user_id, image_url, caption) VALUES (?, ?, ?)').run(
      userId,
      imageUrl,
      caption || ''
    );

    const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
      message: 'Post created successfully',
      post
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:postId', authenticateToken, (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;

    const post = db.prepare(`
      SELECT p.*, u.username, u.id as user_id
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `).get(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const likesCount = db.prepare('SELECT COUNT(*) as count FROM likes WHERE post_id = ?').get(postId).count;
    const isLiked = db.prepare('SELECT * FROM likes WHERE user_id = ? AND post_id = ?').get(userId, postId) ? true : false;

    const comments = db.prepare(`
      SELECT c.*, u.username
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.created_at ASC
    `).all(postId);

    res.json({
      post: {
        ...post,
        likesCount,
        isLiked,
        comments
      }
    });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:postId/like', authenticateToken, (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;

    const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const existingLike = db.prepare('SELECT * FROM likes WHERE user_id = ? AND post_id = ?').get(userId, postId);
    if (existingLike) {
      return res.status(400).json({ error: 'Post already liked' });
    }

    db.prepare('INSERT INTO likes (user_id, post_id) VALUES (?, ?)').run(userId, postId);

    res.json({ message: 'Post liked successfully' });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:postId/unlike', authenticateToken, (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;

    const existingLike = db.prepare('SELECT * FROM likes WHERE user_id = ? AND post_id = ?').get(userId, postId);
    if (!existingLike) {
      return res.status(400).json({ error: 'Post not liked' });
    }

    db.prepare('DELETE FROM likes WHERE user_id = ? AND post_id = ?').run(userId, postId);

    res.json({ message: 'Post unliked successfully' });
  } catch (error) {
    console.error('Unlike post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:postId/comment', authenticateToken, (req, res) => {
  try {
    const { postId } = req.params;
    const { comment } = req.body;
    const userId = req.user.userId;

    if (!comment || !comment.trim()) {
      return res.status(400).json({ error: 'Comment text is required' });
    }

    const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const result = db.prepare('INSERT INTO comments (user_id, post_id, comment) VALUES (?, ?, ?)').run(
      userId,
      postId,
      comment.trim()
    );

    const newComment = db.prepare(`
      SELECT c.*, u.username
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `).get(result.lastInsertRowid);

    res.status(201).json({
      message: 'Comment added successfully',
      comment: newComment
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

