const express = require('express');
const { db } = require('../database/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;

    const posts = db.prepare(`
      SELECT p.*, u.username, u.id as user_id
      FROM posts p
      JOIN users u ON p.user_id = u.id
      JOIN follows f ON p.user_id = f.following_id
      WHERE f.follower_id = ?
      ORDER BY p.created_at DESC
    `).all(userId);

    const postsWithDetails = posts.map(post => {
      const likesCount = db.prepare('SELECT COUNT(*) as count FROM likes WHERE post_id = ?').get(post.id).count;
      const isLiked = db.prepare('SELECT * FROM likes WHERE user_id = ? AND post_id = ?').get(userId, post.id) ? true : false;

      const commentsCount = db.prepare('SELECT COUNT(*) as count FROM comments WHERE post_id = ?').get(post.id).count;

      const recentComments = db.prepare(`
        SELECT c.*, u.username
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.post_id = ?
        ORDER BY c.created_at DESC
        LIMIT 2
      `).all(post.id);

      return {
        ...post,
        likesCount,
        isLiked,
        commentsCount,
        recentComments: recentComments.reverse()
      };
    });

    res.json({ posts: postsWithDetails });
  } catch (error) {
    console.error('Get feed error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

