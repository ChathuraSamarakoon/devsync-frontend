/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      
      if (storedUser && storedUser !== 'undefined' && token) {
        return JSON.parse(storedUser);
      }
    } catch (error) {
      console.error("Local storage data eka kiyawaddi getaluwak:", error);
      
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    return null;
  });

  const [loading] = useState(false);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};