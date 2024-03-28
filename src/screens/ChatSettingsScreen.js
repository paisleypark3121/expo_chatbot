import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Platform,
  ActionSheetIOS,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from 'react-i18next';


const ChatSettings = () => {
  const [language, setLanguage] = useState('italian');
  const [mode, setMode] = useState('standard');
  const { setFont, changeLanguage } = useAppContext();

  const { t } = useTranslation();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const languageSaved = await AsyncStorage.getItem('@language');
        const modeSaved = await AsyncStorage.getItem('@mode');
        if (languageSaved !== null) {
          setLanguage(languageSaved);
        }
        if (modeSaved !== null) {
          setMode(modeSaved);
        }
      } catch (e) {
        console.log('Error in loading settings', e);
      }
    };

    loadSettings();
  }, []);

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem('@language', language);
      await AsyncStorage.setItem('@mode', mode);
      console.log('Setting Saved');
    } catch (e) {
      console.log('Error in saving settings', e);
    }
  };

  const showLanguageActionSheet = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [t('cancel'), t('italian'), t('english')],
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 1:
            setLanguage('Italiano')
            changeLanguage('it');            
            break;
          case 2:
            setLanguage('English')
            changeLanguage('en');            
            break;
        }
      }
    );
  };

  const showModeActionSheet = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [t('cancel'), 'Standard', 'Smart'],
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 1:
            setMode('standard');
            setFont('default')
            break;
          case 2:
            setMode('smart');
            setFont('OpenDyslexic-Regular')
            break;
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('settings')}</Text>

      {Platform.OS === 'ios' ? (
        <>
          <Button title={t('select language')} onPress={showLanguageActionSheet} />
          <Text style={styles.selectionText}>{t('Language')}: {language}</Text>
          <Button title={t('select mode')} onPress={showModeActionSheet} />
          <Text style={styles.selectionText}>{t('mode')}: {mode}</Text>
        </>
      ) : (
        <>
          <Text style={styles.label}>{t('language')}</Text>
          <Picker
            selectedValue={language}
            onValueChange={(itemValue) => setLanguage(itemValue)}
            style={styles.picker}>
            <Picker.Item label="Italian" value={t('italian')} />
            <Picker.Item label="English" value={t('english')} />
          </Picker>

          <Text style={styles.label}>Mode</Text>
          <Picker
            selectedValue={mode}
            onValueChange={(itemValue) => setMode(itemValue)}
            style={styles.picker}>
            <Picker.Item label="Standard" value="standard" />
            <Picker.Item label="Smart" value="smart" />
          </Picker>
        </>
      )}

      <View style={styles.button}>
        <Button title={t('save settings')} onPress={saveSettings} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    marginTop: 40,
    textAlign: 'center',
  },
  picker: {
    width: 200,
    height: 44,
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20, 
    marginBottom: 8, 
  },
});

export default ChatSettings;