import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types';
import { getUserByEmail, createUser } from '../services/userService';
import { initializeDatabase } from '../services/database';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize database
        const dbInitialized = await initializeDatabase();
        console.log('Database initialization result:', dbInitialized);
        
        // Check for stored user
        const storedUser = localStorage.getItem('viralWalletUser');
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            // Refresh user data from database
            const freshUser = await getUserByEmail(userData.email);
            if (freshUser) {
              setUser(freshUser);
              localStorage.setItem('viralWalletUser', JSON.stringify(freshUser));
            } else {
              localStorage.removeItem('viralWalletUser');
            }
          } catch (parseError) {
            console.error('Error parsing stored user data:', parseError);
            localStorage.removeItem('viralWalletUser');
          }
        }
      } catch (error) {
        console.error('App initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = await getUserByEmail(email);
      
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('viralWalletUser', JSON.stringify(foundUser));
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (name: string, email: string, phone: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        setIsLoading(false);
        return false;
      }
      
      const newUser = await createUser({ name, email, phone, password });
      setUser(newUser);
      localStorage.setItem('viralWalletUser', JSON.stringify(newUser));
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('viralWalletUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};