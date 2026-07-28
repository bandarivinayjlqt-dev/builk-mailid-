import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  login: (email: string, role?: UserRole) => Promise<void>;
  googleLogin: () => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>({
    id: 'usr_admin',
    name: 'Sarah Connor',
    email: 'admin@mailpulse.io',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    status: 'active',
    company: 'Apex Marketing Corp',
    emailVerified: true,
    quotaLimit: 500000,
    quotaUsed: 142850,
    createdAt: '2025-01-15T08:00:00Z',
  });

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const login = async (email: string, role: UserRole = 'admin') => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: 'password123' }),
      });
      const data = await res.json();
      if (data.user) {
        setUser({ ...data.user, role });
      }
    } catch {
      setUser({
        id: 'usr_custom',
        name: email.split('@')[0],
        email,
        role,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        status: 'active',
        company: 'SaaS Client',
        emailVerified: true,
        quotaLimit: 100000,
        quotaUsed: 1200,
        createdAt: new Date().toISOString(),
      });
    }
  };

  const googleLogin = async () => {
    try {
      const res = await fetch('/api/auth/google', { method: 'POST' });
      const data = await res.json();
      if (data.user) setUser(data.user);
    } catch {
      setUser({
        id: 'usr_google',
        name: 'Alex Rivera (Google)',
        email: 'alex@marketing.com',
        role: 'manager',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        status: 'active',
        company: 'EduLearn Institute',
        emailVerified: true,
        quotaLimit: 250000,
        quotaUsed: 38400,
        createdAt: new Date().toISOString(),
      });
    }
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (role: UserRole) => {
    if (user) {
      setUser({ ...user, role });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        theme,
        toggleTheme,
        login,
        googleLogin,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
