const express = require('express');
const { db } = require('../database/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/:userId', authenticateToken, (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.userId;

    const user = db.prepare('SELECT id, username, email, created_at FROM users WHERE id = ?').get(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const followerCount = db.prepare('SELECT COUNT(*) as count FROM follows WHERE following_id = ?').get(userId).count;

    const followingCount = db.prepare('SELECT COUNT(*) as count FROM follows WHERE follower_id = ?').get(userId).count;

    const isFollowing = db.prepare('SELECT * FROM follows WHERE follower_id = ? AND following_id = ?').get(currentUserId, userId) ? true : false;

    const posts = db.prepare('SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC').all(userId);

    res.json({
      user: {
        ...user,
        followerCount,
        followingCount,
        isFollowing: currentUserId === parseInt(userId) ? null : isFollowing
      },
      posts
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:userId/follow', authenticateToken, (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.userId;

    if (currentUserId === parseInt(userId)) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    const user = db.prepare('SELECT id FROM users WHERE id = ?').get(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const existingFollow = db.prepare('SELECT * FROM follows WHERE follower_id = ? AND following_id = ?').get(currentUserId, userId);
    if (existingFollow) {
      return res.status(400).json({ error: 'Already following this user' });
    }

    db.prepare('INSERT INTO follows (follower_id, following_id) VALUES (?, ?)').run(currentUserId, userId);

    res.json({ message: 'Successfully followed user' });
  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:userId/unfollow', authenticateToken, (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.userId;

    const existingFollow = db.prepare('SELECT * FROM follows WHERE follower_id = ? AND following_id = ?').get(currentUserId, userId);
    if (!existingFollow) {
      return res.status(400).json({ error: 'Not following this user' });
    }

    db.prepare('DELETE FROM follows WHERE follower_id = ? AND following_id = ?').run(currentUserId, userId);

    res.json({ message: 'Successfully unfollowed user' });
  } catch (error) {
    console.error('Unfollow user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

