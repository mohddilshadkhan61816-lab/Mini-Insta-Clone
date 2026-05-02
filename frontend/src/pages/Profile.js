import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProfile = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/${userId}`);
      setProfile(response.data.user);
      setPosts(response.data.posts);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleFollow = async () => {
    try {
      if (profile.isFollowing) {
        await axios.post(`http://localhost:5000/api/users/${userId}/unfollow`);
      } else {
        await axios.post(`http://localhost:5000/api/users/${userId}/follow`);
      }
      fetchProfile();
    } catch (err) {
      console.error('Follow/unfollow error:', err);
    }
  };

  const getInitials = (username) => {
    return username ? username.charAt(0).toUpperCase() : '?';
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (error || !profile) {
    return <div className="error-message">{error || 'Profile not found'}</div>;
  }

  const isOwnProfile = currentUser && currentUser.id === parseInt(userId);

  return (
    <div className="container">
      <div className="profile-header">
        <div className="profile-avatar">{getInitials(profile.username)}</div>
        <div className="profile-info">
          <h2>{profile.username}</h2>
          <div className="profile-stats">
            <div className="profile-stat">
              <strong>{posts.length}</strong> posts
            </div>
            <div className="profile-stat">
              <strong>{profile.followerCount}</strong> followers
            </div>
            <div className="profile-stat">
              <strong>{profile.followingCount}</strong> following
            </div>
          </div>
          {!isOwnProfile && (
            <div className="profile-actions">
              <button
                className={`profile-button ${profile.isFollowing ? 'following' : 'follow'}`}
                onClick={handleFollow}
              >
                {profile.isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          )}
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="empty-state">
          <h2>No posts yet</h2>
        </div>
      ) : (
        <div className="profile-posts">
          {posts.map((post) => (
            <Link key={post.id} to={`/post/${post.id}`} className="profile-post">
              <img src={post.image_url?.startsWith('/') ? `http://localhost:5000${post.image_url}` : post.image_url} alt={post.caption} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;

