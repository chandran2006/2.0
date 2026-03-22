import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, UserRole } from '@/types';
import { authAPI } from '@/services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('teleasha_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authAPI.login(email, password);
      if (response.data && response.data.user) {
        const userData = {
          id: response.data.user.id.toString(),
          email: response.data.user.email,
          name: response.data.user.name,
          role: response.data.user.role,
          phone: response.data.user.phone || '',
          address: response.data.user.address || '',
          specialization: response.data.user.specialization || '',
          licenseNumber: response.data.user.licenseNumber || '',
          pharmacyName: response.data.user.pharmacyName || '',
          createdAt: response.data.user.createdAt || new Date().toISOString(),
        };
        setUser(userData);
        localStorage.setItem('teleasha_user', JSON.stringify(userData));
        return true;
      }
      return false;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error(error.response.data.message || 'Your account has been blocked. Please contact the administrator.');
      } else if (error.response?.status === 503) {
        throw new Error(error.response.data.message || 'System is currently under maintenance. Please try again later.');
      }
      return false;
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      const response = await authAPI.register({ name, email, password, role });
      if (response.data && response.data.user) {
        const userData = {
          id: response.data.user.id.toString(),
          email: response.data.user.email,
          name: response.data.user.name,
          role: response.data.user.role,
          phone: response.data.user.phone || '',
          address: response.data.user.address || '',
          specialization: response.data.user.specialization || '',
          licenseNumber: response.data.user.licenseNumber || '',
          pharmacyName: response.data.user.pharmacyName || '',
          createdAt: response.data.user.createdAt || new Date().toISOString(),
        };
        setUser(userData);
        localStorage.setItem('teleasha_user', JSON.stringify(userData));
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Registration error:', error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('teleasha_user');
  }, []);

  // Updates user in context + localStorage so changes reflect everywhere immediately
  const updateUser = useCallback((updates: Partial<User>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      localStorage.setItem('teleasha_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
