import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from '../../assets/dictionaries/en-US.json';
import translationIT from '../../assets/dictionaries/it-IT.json';

// Inizializzazione di i18next
i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources: {
      en: {
        translation: translationEN
      },
      it: {
        translation: translationIT
      }
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [font, setFont] = useState('defaultFont');
  const [mode, setMode] = useState('standard');
  const [language, setLanguage] = useState(i18n.language); // it / en

  useEffect(() => {
    const loadUserData = async () => {
      const userDataJson = await AsyncStorage.getItem(process.env.EXPO_PUBLIC_LOGIN);
      if (userDataJson) {
        setUser(JSON.parse(userDataJson));
      }
      const storedLang = await AsyncStorage.getItem('@language');
      if (storedLang) {
        setLanguage(storedLang);
        i18n.changeLanguage(storedLang);
      }

      const storedMd = await AsyncStorage.getItem('@mode');
      if (storedMd) {
        setMode(storedMd);
        if (storedMd==="smart")
          setFont('OpenDyslexic-Regular')
        else
          setFont('default')
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

  const changeLanguage = async (lng) => {
    console.log("@language: "+lng)
    setLanguage(lng);
    i18n.changeLanguage(lng);
    await AsyncStorage.setItem('@language', lng);
  };

  const changeMode = async (md) => {
    console.log("@mode: "+md)
    setMode(md);
    if (md==="smart")
      setFont('OpenDyslexic-Regular')
    else
      setFont('default')
    await AsyncStorage.setItem('@mode', md);
  };

  return (
    <AppContext.Provider value={
      { 
        user, 
        login, 
        logout, 
        font, 
        mode,
        language, 
        changeLanguage,
        changeMode 
      }}>
      {children}
    </AppContext.Provider>
  );
};
