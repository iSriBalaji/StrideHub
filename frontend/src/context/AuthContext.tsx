import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, login, logout, registerUser } from '../api/auth';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface AuthContextShape {
  user: User | null;
  loading: boolean;
  login: (u: string, p: string) => Promise<void>;
  logout: () => void;
  register: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextShape | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const data = await getCurrentUser();
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUser(); }, []);

  const doLogin = async (u: string, p: string) => {
    await login(u, p);
    await loadUser();
  };

  const doLogout = () => {
    logout();
    setUser(null);
  };

  const doRegister = async (data: any) => {
    await registerUser(data);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login: doLogin, logout: doLogout, register: doRegister }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
