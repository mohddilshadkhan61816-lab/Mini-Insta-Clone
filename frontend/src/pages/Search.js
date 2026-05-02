import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('users');

  const performSearch = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/explore/search?q=${encodeURIComponent(query)}`);
      setUsers(response.data.users || []);
      setPosts(response.data.posts || []);
      setSearchParams({ q: query });
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, [query, setSearchParams]);

  useEffect(() => {
    if (query.trim()) {
      performSearch();
    } else {
      setUsers([]);
      setPosts([]);
    }
  }, [query, performSearch]);

  const handleFollow = async (userId, isFollowing) => {
    try {
      if (isFollowing) {
        await axios.post(`http://localhost:5000/api/users/${userId}/unfollow`);
      } else {
        await axios.post(`http://localhost:5000/api/users/${userId}/follow`);
      }
      performSearch();
    } catch (err) {
      console.error('Follow/unfollow error:', err);
    }
  };

  const getInitials = (username) => {
    return username ? username.charAt(0).toUpperCase() : '?';
  };

  return (
    <div className="search-container">
      <div className="search-header">
        <input
          type="text"
          className="search-input"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {query.trim() && (
        <>
          <div className="search-tabs">
            <button
              className={activeTab === 'users' ? 'active' : ''}
              onClick={() => setActiveTab('users')}
            >
              Users
            </button>
            <button
              className={activeTab === 'posts' ? 'active' : ''}
              onClick={() => setActiveTab('posts')}
            >
              Posts
            </button>
          </div>

          {loading ? (
            <div className="loading">Searching...</div>
          ) : (
            <>
              {activeTab === 'users' && (
                <div className="search-results">
                  {users.length === 0 ? (
                    <div className="empty-state">No users found</div>
                  ) : (
                    users.map((user) => (
                      <div key={user.id} className="search-user-item">
                        <Link to={`/profile/${user.id}`} className="search-user-link">
                          <div className="search-user-avatar">
                            {getInitials(user.username)}
                          </div>
                          <div className="search-user-info">
                            <div className="search-username">{user.username}</div>
                            <div className="search-user-meta">
                              {user.followerCount} followers
                            </div>
                          </div>
                        </Link>
                        <button
                          className={`profile-button ${user.isFollowing ? 'following' : 'follow'}`}
                          onClick={() => handleFollow(user.id, user.isFollowing)}
                        >
                          {user.isFollowing ? 'Following' : 'Follow'}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'posts' && (
                <div className="explore-grid">
                  {posts.length === 0 ? (
                    <div className="empty-state">No posts found</div>
                  ) : (
                    posts.map((post) => {
                      const imageUrl = post.image_url?.startsWith('/') 
                        ? `http://localhost:5000${post.image_url}`
                        : post.image_url;
                      return (
                        <Link key={post.id} to={`/post/${post.id}`} className="explore-post">
                          <img src={imageUrl} alt={post.caption} />
                        <div className="explore-post-overlay">
                          <div className="explore-post-stats">
                            <span>❤️ {post.likesCount}</span>
                            <span>💬 {post.commentsCount}</span>
                          </div>
                        </div>
                      </Link>
                      );
                    })
                  )}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Search;

