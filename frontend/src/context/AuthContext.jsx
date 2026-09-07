import React, { createContext, useState, useEffect } from 'react';
import { loginUserAPI, registerUserAPI, fetchUserProfileAPI } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      if (token) {
        try {
          const profile = await fetchUserProfileAPI(token);
          setUser(profile);
        } catch (error) {
          console.error('Session restoration failed:', error.message);
          // Token is invalid/expired, clean up
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeUser();
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await loginUserAPI({ email, password });
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, confirmPassword) => {
    setLoading(true);
    try {
      const data = await registerUserAPI({ name, email, password, confirmPassword });
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
