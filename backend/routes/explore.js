const express = require('express');
const { db } = require('../database/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/posts', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;

    const posts = db.prepare(`
      SELECT p.*, u.username, u.id as user_id
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY RANDOM()
      LIMIT 100
    `).all();

    const postsWithDetails = posts.map(post => {
      const likesCount = db.prepare('SELECT COUNT(*) as count FROM likes WHERE post_id = ?').get(post.id).count;
      const isLiked = db.prepare('SELECT * FROM likes WHERE user_id = ? AND post_id = ?').get(userId, post.id) ? true : false;
      const commentsCount = db.prepare('SELECT COUNT(*) as count FROM comments WHERE post_id = ?').get(post.id).count;

      return {
        ...post,
        likesCount,
        isLiked,
        commentsCount
      };
    });

    res.json({ posts: postsWithDetails });
  } catch (error) {
    console.error('Get explore posts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/search', authenticateToken, (req, res) => {
  try {
    const { q } = req.query;
    const currentUserId = req.user.userId;

    if (!q || q.trim().length === 0) {
      return res.json({ users: [], posts: [] });
    }

    const searchTerm = `%${q.trim()}%`;

    const users = db.prepare(`
      SELECT id, username, email, created_at
      FROM users
      WHERE (username LIKE ? OR email LIKE ?)
      AND id != ?
      LIMIT 20
    `).all(searchTerm, searchTerm, currentUserId);

    const usersWithFollowStatus = users.map(user => {
      const followerCount = db.prepare('SELECT COUNT(*) as count FROM follows WHERE following_id = ?').get(user.id).count;
      const isFollowing = db.prepare('SELECT * FROM follows WHERE follower_id = ? AND following_id = ?').get(currentUserId, user.id) ? true : false;

      return {
        ...user,
        followerCount,
        isFollowing
      };
    });

    const posts = db.prepare(`
      SELECT p.*, u.username, u.id as user_id
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.caption LIKE ? OR u.username LIKE ?
      ORDER BY p.created_at DESC
      LIMIT 20
    `).all(searchTerm, searchTerm);

    const postsWithDetails = posts.map(post => {
      const likesCount = db.prepare('SELECT COUNT(*) as count FROM likes WHERE post_id = ?').get(post.id).count;
      const isLiked = db.prepare('SELECT * FROM likes WHERE user_id = ? AND post_id = ?').get(currentUserId, post.id) ? true : false;
      const commentsCount = db.prepare('SELECT COUNT(*) as count FROM comments WHERE post_id = ?').get(post.id).count;

      return {
        ...post,
        likesCount,
        isLiked,
        commentsCount
      };
    });

    res.json({ users: usersWithFollowStatus, posts: postsWithDetails });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/suggestions', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;

    const suggestions = db.prepare(`
      SELECT u.id, u.username, u.email
      FROM users u
      WHERE u.id != ?
      AND u.id NOT IN (
        SELECT following_id FROM follows WHERE follower_id = ?
      )
      ORDER BY RANDOM()
      LIMIT 5
    `).all(userId, userId);

    const suggestionsWithDetails = suggestions.map(user => {
      const followerCount = db.prepare('SELECT COUNT(*) as count FROM follows WHERE following_id = ?').get(user.id).count;

      const mutualFollower = db.prepare(`
        SELECT u.username
        FROM follows f1
        JOIN follows f2 ON f1.follower_id = f2.follower_id
        JOIN users u ON f2.follower_id = u.id
        WHERE f1.following_id = ? AND f2.following_id = ? AND f2.follower_id != ?
        LIMIT 1
      `).get(user.id, userId, userId);

      return {
        ...user,
        followerCount,
        mutualFollower: mutualFollower ? mutualFollower.username : null
      };
    });

    res.json({ suggestions: suggestionsWithDetails });
  } catch (error) {
    console.error('Get suggestions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

