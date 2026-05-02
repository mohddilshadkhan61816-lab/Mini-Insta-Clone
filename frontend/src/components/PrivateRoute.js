import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';

const PrivateRoute = ({ children, showSidebars = true }) => {
  const { token, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!showSidebars) {
    return children;
  }

  return (
    <div className="app-layout">
      <LeftSidebar />
      <div className="content-wrapper">
        <main className="content-main">
          {children}
        </main>
        <RightSidebar />
      </div>
    </div>
  );
};

export default PrivateRoute;

