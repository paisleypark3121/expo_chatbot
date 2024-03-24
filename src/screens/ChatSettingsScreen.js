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

const ChatSettings = () => {
  const [lingua, setLingua] = useState('italiano');
  const [modalita, setModalita] = useState('standard');

  useEffect(() => {
    const caricaImpostazioni = async () => {
      try {
        const linguaSalvata = await AsyncStorage.getItem('@lingua');
        const modalitaSalvata = await AsyncStorage.getItem('@modalita');
        if (linguaSalvata !== null) {
          setLingua(linguaSalvata);
        }
        if (modalitaSalvata !== null) {
          setModalita(modalitaSalvata);
        }
      } catch (e) {
        console.log('Errore nel caricamento delle impostazioni', e);
      }
    };

    caricaImpostazioni();
  }, []);

  const salvaImpostazioni = async () => {
    try {
      await AsyncStorage.setItem('@lingua', lingua);
      await AsyncStorage.setItem('@modalita', modalita);
      console.log('Impostazioni salvate');
    } catch (e) {
      console.log('Errore nel salvataggio delle impostazioni', e);
    }
  };

  const showLinguaActionSheet = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Italiano', 'Inglese'],
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 1:
            setLingua('italiano');
            break;
          case 2:
            setLingua('inglese');
            break;
        }
      }
    );
  };

  const showModalitaActionSheet = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Standard', 'Smart'],
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 1:
            setModalita('standard');
            break;
          case 2:
            setModalita('smart');
            break;
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      {Platform.OS === 'ios' ? (
        <>
          <Button title="Seleziona Lingua" onPress={showLinguaActionSheet} />
          <Text style={styles.selectionText}>Lingua: {lingua}</Text>
          <Button title="Seleziona Modalità" onPress={showModalitaActionSheet} />
          <Text style={styles.selectionText}>Modalità: {modalita}</Text>
        </>
      ) : (
        <>
          <Text style={styles.label}>Lingua</Text>
          <Picker
            selectedValue={lingua}
            onValueChange={(itemValue) => setLingua(itemValue)}
            style={styles.picker}>
            <Picker.Item label="Italiano" value="italiano" />
            <Picker.Item label="Inglese" value="inglese" />
          </Picker>

          <Text style={styles.label}>Modalità</Text>
          <Picker
            selectedValue={modalita}
            onValueChange={(itemValue) => setModalita(itemValue)}
            style={styles.picker}>
            <Picker.Item label="Standard" value="standard" />
            <Picker.Item label="Smart" value="smart" />
          </Picker>
        </>
      )}

      <View style={styles.button}>
        <Button title="Salva Impostazioni" onPress={salvaImpostazioni} />
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