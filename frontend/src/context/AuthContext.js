import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/api';

// Create the auth context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from local storage on initial render
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await authService.getCurrentUser();
          setUser(response.data.data);
        }
      } catch (err) {
        console.error('Failed to load user:', err);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Register a new user
  const register = async (userData) => {
    try {
      setError(null);
      const response = await authService.register(userData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      return user;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  // Login a user
  const login = async (credentials) => {
    try {
      setError(null);
      const response = await authService.login(credentials);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      return user;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  // Logout a user
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Enable TOTP
  const enableTOTP = async () => {
    try {
      setError(null);
      const response = await authService.enableTOTP();
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to enable TOTP');
      throw err;
    }
  };

  // Verify and activate TOTP
  const verifyTOTP = async (token) => {
    try {
      setError(null);
      const response = await authService.verifyTOTP(token);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify TOTP');
      throw err;
    }
  };

  // Disable TOTP
  const disableTOTP = async () => {
    try {
      setError(null);
      const response = await authService.disableTOTP();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to disable TOTP');
      throw err;
    }
  };

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Check if user is an admin
  const isAdmin = user?.role === 'admin';

  // Context value
  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    enableTOTP,
    verifyTOTP,
    disableTOTP,
    isAuthenticated,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
