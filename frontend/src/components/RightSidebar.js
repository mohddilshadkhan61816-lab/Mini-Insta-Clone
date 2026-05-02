import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const RightSidebar = () => {
  const { user } = useContext(AuthContext);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (user) {
      fetchSuggestions();
    }
  }, [user]);

  const fetchSuggestions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/explore/suggestions');
      setSuggestions(response.data.suggestions || []);
    } catch (err) {
      console.error('Error fetching suggestions:', err);
    }
  };

  const handleFollow = async (userId) => {
    try {
      await axios.post(`http://localhost:5000/api/users/${userId}/follow`);
      fetchSuggestions();
    } catch (err) {
      console.error('Follow error:', err);
    }
  };

  const getInitials = (username) => {
    return username ? username.charAt(0).toUpperCase() : '?';
  };

  if (!user) return null;

  return (
    <aside className="right-sidebar">
      <div className="sidebar-content">
        <div className="user-profile-card">
          <Link to={`/profile/${user.id}`} className="user-profile-link">
            <div className="user-profile-avatar-small">
              {getInitials(user.username)}
            </div>
            <div className="user-profile-info">
              <div className="user-profile-username">{user.username}</div>
              <div className="user-profile-name">{user.username}</div>
            </div>
          </Link>
        </div>

        {suggestions.length > 0 && (
          <div className="suggestions-section">
            <div className="suggestions-header">
              <span className="suggestions-title">Suggested for you</span>
              <Link to="/explore" className="suggestions-see-all">See All</Link>
            </div>
            <div className="suggestions-list">
              {suggestions.map((suggestion) => (
                <div key={suggestion.id} className="suggestion-item">
                  <Link to={`/profile/${suggestion.id}`} className="suggestion-link">
                    <div className="suggestion-avatar">
                      {getInitials(suggestion.username)}
                    </div>
                    <div className="suggestion-info">
                      <div className="suggestion-username">{suggestion.username}</div>
                      {suggestion.mutualFollower ? (
                        <div className="suggestion-meta">Followed by {suggestion.mutualFollower}</div>
                      ) : (
                        <div className="suggestion-meta">New to Instagram</div>
                      )}
                    </div>
                  </Link>
                  <button
                    className="suggestion-follow-btn"
                    onClick={() => handleFollow(suggestion.id)}
                  >
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="sidebar-footer">
          <div className="footer-links">
            <span>About</span>
            <span>Help</span>
            <span>Press</span>
            <span>API</span>
            <span>Jobs</span>
            <span>Privacy</span>
            <span>Terms</span>
            <span>Locations</span>
            <span>Language</span>
            <span>Meta Verified</span>
          </div>
          <div className="footer-copyright">© 2025 INSTAGRAM FROM META</div>
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;

