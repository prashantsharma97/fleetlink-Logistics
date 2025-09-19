import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Api from '../api/axios';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('fleetlink_token');
    const storedUser = localStorage.getItem('fleetlink_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async ({ email, password }) => {
    const res = await Api.post('/api/auth/login', { email, password });
    const { token } = res.data;

    if (!token) {
      throw new Error('Missing token in response');
    }
    const name = email.split('@')[0];
    setToken(token);
    setUser({ name, email });
    localStorage.setItem('fleetlink_token', token);
    localStorage.setItem('fleetlink_user', JSON.stringify({ name, email }));

    return res.data;
  };



  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('fleetlink_token');
    localStorage.removeItem('fleetlink_user');
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
