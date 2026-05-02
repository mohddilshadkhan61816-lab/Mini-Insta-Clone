import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './PostModal.css';

const PostModal = ({ postId, onClose }) => {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const fetchPost = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/posts/${postId}`);
      setPost(response.data.post);
      setComments(response.data.post.comments || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!post) return;
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
      fetchPost();
    } catch (err) {
      console.error('Comment error:', err);
    }
  };

  const getInitials = (username) => {
    return username ? username.charAt(0).toUpperCase() : '?';
  };

  if (!postId) return null;

  if (loading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="error-message">{error || 'Post not found'}</div>
        </div>
      </div>
    );
  }

  const imageUrl = post.image_url.startsWith('/') 
    ? `http://localhost:5000${post.image_url}`
    : post.image_url;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-post" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-post-container">
          <img src={imageUrl} alt={post.caption} className="modal-post-image" />
          <div className="modal-post-sidebar">
            <div className="modal-post-header">
              <Link to={`/profile/${post.user_id}`} className="modal-post-user">
                <div className="modal-post-avatar">
                  {getInitials(post.username)}
                </div>
                <span className="modal-post-username">{post.username}</span>
              </Link>
            </div>

            <div className="modal-post-comments-section">
              {post.caption && (
                <div className="modal-post-caption">
                  <strong>{post.username}</strong> {post.caption}
                </div>
              )}
              <div className="modal-comments-list">
                {comments.map((comment) => (
                  <div key={comment.id} className="modal-comment">
                    <strong>{comment.username}</strong> {comment.comment}
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-post-actions">
              <button
                className={`modal-action-button ${post.isLiked ? 'liked' : ''}`}
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

            <div className="modal-post-likes">{post.likesCount} likes</div>

            <form onSubmit={handleComment} className="modal-comment-form">
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="modal-comment-input"
              />
              <button
                type="submit"
                className="modal-comment-button"
                disabled={!newComment.trim()}
              >
                Post
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;


