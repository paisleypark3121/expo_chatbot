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
  // const [languageLabel, setLanguageLabel] = useState('');
  // const [pickerValue, setPickerValue] = useState('');
  const {language, mode, changeLanguage, changeMode} = useAppContext();

  const translateLanguage = (language) => {
    return language === 'it' ? 'Italiano' : 'English';
  };

  const { t } = useTranslation();

  const showLanguageActionSheet = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [t('cancel'), t('italian'), t('english')],
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 1:
            changeLanguage('it');            
            break;
          case 2:
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
            changeMode('standard');
            break;
          case 2:
            changeMode('smart');
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
          <Text style={styles.selectionText}>{t('Language')}: {translateLanguage(language)}</Text>
          <Button title={t('select mode')} onPress={showModeActionSheet} />
          <Text style={styles.selectionText}>{t('mode')}: {mode}</Text>
        </>
      ) : (
        <>
          <Text style={styles.label}>{t('language')}</Text>
          <Picker
            selectedValue={language}
            onValueChange={(itemValue) => changeLanguage(itemValue)}
            style={styles.picker}>
            <Picker.Item label={t('italian')} value="it" />
            <Picker.Item label={t('english')} value="en" />
          </Picker>

          <Text style={styles.label}>Mode</Text>
          <Picker
            selectedValue={mode}
            onValueChange={(itemValue) => {
              changeMode(itemValue);
            }}
            style={styles.picker}>
            <Picker.Item label="Standard" value="standard" />
            <Picker.Item label="Smart" value="smart" />
          </Picker>
        </>
      )}
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