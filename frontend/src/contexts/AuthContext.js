import React, { createContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getProfile } from '../services/api';
import jwt_decode from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for token on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decoded = jwt_decode(token);
          if (decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
          } else {
            const response = await getProfile(token);
            setCurrentUser({
              ...response.data,
              token
            });
          }
        }
      } catch (err) {
        console.error('Auth check error:', err);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      const response = await registerUser(userData);
      const { token } = response.data;
      localStorage.setItem('token', token);
      
      const decoded = jwt_decode(token);
      const profileResponse = await getProfile(token);
      
      setCurrentUser({
        ...profileResponse.data,
        token
      });
      
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      const response = await loginUser(credentials);
      const { token } = response.data;
      localStorage.setItem('token', token);
      
      const decoded = jwt_decode(token);
      const profileResponse = await getProfile(token);
      
      setCurrentUser({
        ...profileResponse.data,
        token
      });
      
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        error,
        register,
        login,
        logout,
        setCurrentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);