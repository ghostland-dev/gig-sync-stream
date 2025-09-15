import React, { useState, useEffect, createContext, useContext } from 'react';
import useLocalStorage from './useLocalStorage';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  plan: 'free' | 'pro' | 'enterprise';
  createdAt: string;
  settings: {
    theme: 'light' | 'dark' | 'system';
    language: 'fr' | 'en' | 'es' | 'de';
    notifications: {
      email: boolean;
      browser: boolean;
      sound: boolean;
      platforms: {
        fiverr: boolean;
        upwork: boolean;
        malt: boolean;
        codeur: boolean;
      };
    };
    autoRefresh: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  isLoading: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock users database
const getMockUsers = (): User[] => {
  const stored = localStorage.getItem('mock-users');
  if (stored) return JSON.parse(stored);
  
  const defaultUsers: User[] = [
    {
      id: 'user-1',
      email: 'jean.dupont@example.com',
      firstName: 'Jean',
      lastName: 'Dupont',
      plan: 'pro',
      createdAt: '2024-01-15T10:00:00Z',
      settings: {
        theme: 'light',
        language: 'fr',
        notifications: {
          email: true,
          browser: true,
          sound: false,
          platforms: {
            fiverr: true,
            upwork: true,
            malt: true,
            codeur: true
          }
        },
        autoRefresh: true
      }
    }
  ];
  
  localStorage.setItem('mock-users', JSON.stringify(defaultUsers));
  return defaultUsers;
};

const saveMockUsers = (users: User[]) => {
  localStorage.setItem('mock-users', JSON.stringify(users));
};

export const useAuth = (): AuthContextType => {
  const [user, setUser] = useLocalStorage<User | null>('current-user', null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const users = getMockUsers();
    const foundUser = users.find(u => u.email === email);
    
    if (!foundUser) {
      setIsLoading(false);
      return { success: false, error: 'Utilisateur non trouvé' };
    }
    
    // In a real app, you'd verify the password hash
    if (password !== 'password123') {
      setIsLoading(false);
      return { success: false, error: 'Mot de passe incorrect' };
    }
    
    setUser(foundUser);
    setIsLoading(false);
    return { success: true };
  };

  const register = async (userData: RegisterData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const users = getMockUsers();
    
    // Check if user already exists
    if (users.find(u => u.email === userData.email)) {
      setIsLoading(false);
      return { success: false, error: 'Cet email est déjà utilisé' };
    }
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      plan: 'free',
      createdAt: new Date().toISOString(),
      settings: {
        theme: 'light',
        language: 'fr',
        notifications: {
          email: true,
          browser: true,
          sound: false,
          platforms: {
            fiverr: true,
            upwork: true,
            malt: true,
            codeur: true
          }
        },
        autoRefresh: true
      }
    };
    
    users.push(newUser);
    saveMockUsers(users);
    setUser(newUser);
    setIsLoading(false);
    
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    
    // Update in mock database
    const users = getMockUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      saveMockUsers(users);
    }
  };

  return {
    user,
    login,
    register,
    logout,
    updateUser,
    isLoading
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  return React.createElement(AuthContext.Provider, { value: auth }, children);
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};