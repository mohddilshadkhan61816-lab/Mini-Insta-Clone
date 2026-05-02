import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LeftSidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const getInitials = (username) => {
    return username ? username.charAt(0).toUpperCase() : '?';
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className="left-sidebar">
      <div className="sidebar-content">
        <Link to="/" className="sidebar-logo">
          Instagram
        </Link>
        <nav className="sidebar-nav">
          <Link to="/" className={`sidebar-nav-item ${isActive('/') ? 'active' : ''}`}>
            <svg aria-label="Home" fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
              {isActive('/') ? (
                <path d="M22 23h-6.001a1 1 0 0 1-1-1v-5.455a2.997 2.997 0 1 0-5.993 0V22a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V11.543a1.002 1.002 0 0 1 .31-.724l10-9.543a1.001 1.001 0 0 1 1.38 0l10 9.543a1.002 1.002 0 0 1 .31.724V22a1 1 0 0 1-1 1Z"></path>
              ) : (
                <path d="M9.005 16.545a2.997 2.997 0 0 1 2.997-2.997A2.997 2.997 0 0 1 15 16.545V22h7V11.543L12 2 2 11.543V22h7.005Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              )}
            </svg>
            <span>Home</span>
          </Link>
          <Link to="/search" className={`sidebar-nav-item ${isActive('/search') ? 'active' : ''}`}>
            <svg aria-label="Search" fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
              {isActive('/search') ? (
                <>
                  <path d="M12.01.42a11.5 11.5 0 1 0 11.5 11.5A11.51 11.51 0 0 0 12.01.42Zm0 21a9.5 9.5 0 1 1 9.5-9.5 9.51 9.51 0 0 1-9.5 9.5Z"></path>
                  <path d="M22.56 23.44a1.5 1.5 0 0 1-2.12 0l-4.94-4.94a1.5 1.5 0 0 1 2.12-2.12l4.94 4.94a1.5 1.5 0 0 1 0 2.12Z"></path>
                </>
              ) : (
                <>
                  <path d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="16.511" x2="22" y1="16.511" y2="22"></line>
                </>
              )}
            </svg>
            <span>Search</span>
          </Link>
          <Link to="/explore" className={`sidebar-nav-item ${isActive('/explore') ? 'active' : ''}`}>
            <svg aria-label="Explore" fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
              {isActive('/explore') ? (
                <path d="m13.173 13.164 1.491-3.829 3.83 1.49ZM12.001.5a11.5 11.5 0 1 0 11.5 11.5A11.52 11.52 0 0 0 12.001.5Zm5.239 5.714-5.738 14.535a1.5 1.5 0 0 1-2.752-.016L3.451 6.315a1.5 1.5 0 0 1 .9-1.829l4.97-1.834a1.5 1.5 0 0 1 1.829.9l1.585 4.015 4.015-1.585a1.5 1.5 0 0 1 1.829.9Z"></path>
              ) : (
                <>
                  <polygon fill="none" points="13.941 13.953 7.581 16.424 10.06 10.056 16.42 7.585 13.941 13.953" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon>
                  <polygon fill="none" points="10.06 10.056 13.949 13.945 7.581 16.424 10.06 10.056" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon>
                  <circle cx="12.001" cy="12.005" fill="none" r="10.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                </>
              )}
            </svg>
            <span>Explore</span>
          </Link>
          <Link to="/create-post" className={`sidebar-nav-item ${isActive('/create-post') ? 'active' : ''}`}>
            <svg aria-label="New post" fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
              <path d="M2 12v3.45c0 2.849.698 4.005 1.606 4.944.94.909 2.098 1.608 4.946 1.608h6.896c2.848 0 4.006-.7 4.946-1.608C21.302 19.455 22 18.3 22 15.45V8.552c0-2.849-.698-4.006-1.606-4.945C19.454 2.7 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.547 2 5.703 2 8.552Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="6.545" x2="17.455" y1="12.001" y2="12.001"></line>
              <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="12.003" x2="12.003" y1="6.545" y2="17.455"></line>
            </svg>
            <span>Create</span>
          </Link>
          {user && (
            <Link to={`/profile/${user.id}`} className={`sidebar-nav-item ${location.pathname.startsWith('/profile') ? 'active' : ''}`}>
              <svg aria-label="Profile" fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
                <circle cx="12.004" cy="12.004" r="10.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                <circle cx="12.004" cy="10.754" r="4.243" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                <path d="M3.75 20.004s4.5-2.252 8.25-2.252 8.25 2.252 8.25 2.252" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
              <span>Profile</span>
            </Link>
          )}
          <button
            className="sidebar-nav-item sidebar-logout-btn"
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            <svg aria-label="Logout" fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
              <path d="M10 22H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              <polyline points="16 18 22 12 16 6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polyline>
              <line x1="22" x2="12" y1="12" y2="12" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></line>
            </svg>
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </aside>
  );
};

export default LeftSidebar;

