import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostModal from '../components/PostModal';

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState(null);

  useEffect(() => {
    fetchExplorePosts();
  }, []);

  const fetchExplorePosts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/explore/posts');
      let postsData = response.data.posts || [];
      
      if (postsData.length === 0) {
        postsData = Array.from({ length: 20 }, (_, i) => ({
          id: `demo-${i}`,
          image_url: `https://picsum.photos/600/600?random=${i}`,
          caption: `Post ${i + 1}`,
          likesCount: Math.floor(Math.random() * 100),
          commentsCount: Math.floor(Math.random() * 20),
          username: `user${i + 1}`,
          user_id: i + 1
        }));
      }
      
      setPosts(postsData);
    } catch (err) {
      console.error('Error fetching explore posts:', err);
      const fallbackPosts = Array.from({ length: 20 }, (_, i) => ({
        id: `demo-${i}`,
        image_url: `https://picsum.photos/600/600?random=${i}`,
        caption: `Post ${i + 1}`,
        likesCount: Math.floor(Math.random() * 100),
        commentsCount: Math.floor(Math.random() * 20),
        username: `user${i + 1}`,
        user_id: i + 1
      }));
      setPosts(fallbackPosts);
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = (post) => {
    if (!post.id.toString().startsWith('demo-')) {
      setSelectedPostId(post.id);
    }
  };

  const handleCloseModal = () => {
    setSelectedPostId(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (posts.length === 0) {
    return (
      <div className="empty-state">
        <h2>No posts found</h2>
      </div>
    );
  }

  return (
    <>
      <div className="explore-grid">
        {posts.map((post) => {
          const imageUrl = post.image_url?.startsWith('/') 
            ? `http://localhost:5000${post.image_url}`
            : post.image_url;
          
          return (
            <div
              key={post.id}
              className="explore-post"
              onClick={() => handlePostClick(post)}
              style={{ cursor: post.id.toString().startsWith('demo-') ? 'default' : 'pointer' }}
            >
              <img src={imageUrl} alt={post.caption || 'Post'} />
              <div className="explore-post-overlay">
                <div className="explore-post-stats">
                  <span>❤️ {post.likesCount || 0}</span>
                  <span>💬 {post.commentsCount || 0}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {selectedPostId && (
        <PostModal postId={selectedPostId} onClose={handleCloseModal} />
      )}
    </>
  );
};

export default Explore;
