import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Carica i dati dell'utente all'avvio dell'app
  useEffect(() => {
    const loadUserData = async () => {
      const userDataJson = await AsyncStorage.getItem(process.env.EXPO_PUBLIC_LOGIN);
      if (userDataJson) {
        setUser(JSON.parse(userDataJson));
      }
    };
    loadUserData();
  }, []);

  const login = async (userData) => {
    setUser(userData);
    await AsyncStorage.setItem(process.env.EXPO_PUBLIC_LOGIN, JSON.stringify(userData));
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem(process.env.EXPO_PUBLIC_LOGIN);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
