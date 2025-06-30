import { createContext, useState } from 'react';
import authHeader from '../utils/authHeader';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userData.token); // Guarda el token también
    setUser(userData); // Actualiza el contexto con los datos del usuario
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    authHeader: authHeader(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
