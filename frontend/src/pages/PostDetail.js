import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPost = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/posts/${postId}`);
      setPost(response.data.post);
      setComments(response.data.post.comments || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load post');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleLike = async () => {
    try {
      if (post.isLiked) {
        await axios.post(`http://localhost:5000/api/posts/${postId}/unlike`);
      } else {
        await axios.post(`http://localhost:5000/api/posts/${postId}/like`);
      }
      fetchPost();
    } catch (err) {
      console.error('Like/unlike error:', err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(`http://localhost:5000/api/posts/${postId}/comment`, {
        comment: newComment
      });
      setComments([...comments, response.data.comment]);
      setNewComment('');
      fetchPost(); // Refresh to update comment count
    } catch (err) {
      console.error('Comment error:', err);
    }
  };

  const getInitials = (username) => {
    return username ? username.charAt(0).toUpperCase() : '?';
  };

  if (loading) {
    return <div className="loading">Loading post...</div>;
  }

  if (error || !post) {
    return <div className="error-message">{error || 'Post not found'}</div>;
  }

  return (
    <div className="container">
      <div className="post-detail-container">
        <img src={post.image_url?.startsWith('/') ? `http://localhost:5000${post.image_url}` : post.image_url} alt={post.caption} className="post-detail-image" />
        <div className="post-detail-content">
          <div className="post-detail-header">
            <Link to={`/profile/${post.user_id}`}>
              <div className="post-detail-avatar">{getInitials(post.username)}</div>
            </Link>
            <Link
              to={`/profile/${post.user_id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <h3>{post.username}</h3>
            </Link>
          </div>

          <div className="post-detail-caption">
            <div className="comment">
              <strong>{post.username}</strong>
              {post.caption}
            </div>
          </div>

          <div className="post-detail-comments">
            {comments.map((comment) => (
              <div key={comment.id} className="comment" style={{ marginBottom: '12px' }}>
                <strong>{comment.username}</strong>
                {comment.comment}
              </div>
            ))}
          </div>

          <div className="post-detail-actions">
            <button
              className={`card-action-button ${post.isLiked ? 'liked' : ''}`}
              onClick={handleLike}
            >
              {post.isLiked ? (
                <svg aria-label="Unlike" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path>
                </svg>
              ) : (
                <svg aria-label="Like" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 013.679-1.938m0-2a6.04 6.04 0 00-4.797 2.127 6.052 6.052 0 00-4.787-2.127A6.985 6.985 0 00.5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 003.518 3.018 2 2 0 002.174 0 45.263 45.263 0 003.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 00-6.708-7.218z"></path>
                </svg>
              )}
            </button>
          </div>

          <div className="post-detail-likes">{post.likesCount} likes</div>

          <form onSubmit={handleComment} className="post-detail-comment-form">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="post-detail-comment-input"
            />
            <button
              type="submit"
              className="post-detail-comment-button"
              disabled={!newComment.trim()}
            >
              Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;

