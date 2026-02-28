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
      console.log('Attempting login for:', email);
      const response = await authAPI.login(email, password);
      console.log('Login response:', response.data);
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
        console.log('Login successful');
        return true;
      }
      console.error('No user data in response');
      return false;
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      return false;
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      console.log('Attempting registration for:', email, 'as', role);
      const response = await authAPI.register({ name, email, password, role });
      console.log('Registration response:', response.data);
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
        console.log('Registration successful');
        return true;
      }
      console.error('No user data in response');
      return false;
    } catch (error: any) {
      console.error('Registration error:', error.response?.data || error.message);
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
