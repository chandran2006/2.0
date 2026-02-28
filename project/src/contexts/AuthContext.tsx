import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, UserRole } from '@/types';
import { authAPI } from '@/services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
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
      if (response.data.user) {
        const userData = {
          id: response.data.user.id.toString(),
          email: response.data.user.email,
          name: response.data.user.name,
          role: response.data.user.role,
          phone: response.data.user.phone,
          address: response.data.user.address,
          specialization: response.data.user.specialization,
          licenseNumber: response.data.user.licenseNumber,
          pharmacyName: response.data.user.pharmacyName,
          createdAt: response.data.user.createdAt,
        };
        setUser(userData);
        localStorage.setItem('teleasha_user', JSON.stringify(userData));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      const response = await authAPI.register({ name, email, password, role });
      if (response.data.user) {
        const userData = {
          id: response.data.user.id.toString(),
          email: response.data.user.email,
          name: response.data.user.name,
          role: response.data.user.role,
          createdAt: response.data.user.createdAt,
        };
        setUser(userData);
        localStorage.setItem('teleasha_user', JSON.stringify(userData));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('teleasha_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
