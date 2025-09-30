import React from 'react';
import { useAuth } from '../context/AuthContext';

export const UserBadge: React.FC = () => {
  const { user, logout, loading } = useAuth();
  if (loading) return <span>Loading...</span>;
  if (!user) return <span>Not signed in</span>;
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <strong>{user.username}</strong>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
