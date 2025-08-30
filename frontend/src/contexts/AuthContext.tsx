import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUsers, UserConfig } from '@/config/users';

export interface User {
  id: string;
  name: string;
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is logged in on page load
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Obter usuários do sistema
      const users = getUsers();
      
      // Buscar usuário válido
      const foundUser = users.find((u: UserConfig) => 
        u.username === username && 
        u.password === password && 
        u.active === true
      );

      if (foundUser) {
        const userSession = {
          id: foundUser.id,
          name: foundUser.name,
          username: foundUser.username,
          role: foundUser.role
        };
        setUser(userSession);
        localStorage.setItem('currentUser', JSON.stringify(userSession));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};