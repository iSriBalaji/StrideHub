import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginForm } from './components/LoginForm';
import { UserBadge } from './components/UserBadge';

const Home: React.FC = () => {
  const { user } = useAuth();
  return (
    <div style={{ padding: 24 }}>
      <h1>StrideHub</h1>
      <UserBadge />
      {!user && <div style={{ marginTop: 16 }}><LoginForm /></div>}
      {user && (
        <pre style={{ marginTop: 16, background: '#f4f4f4', padding: 12 }}>
{JSON.stringify(user, null, 2)}
        </pre>
      )}
    </div>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <Home />
  </AuthProvider>
);

export default App;