import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';


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
        // errore nella lettura dei valori
        console.log('Errore nel caricamento delle impostazioni', e);
      }
    };

    caricaImpostazioni();
  }, []);

  const salvaImpostazioni = async () => {
    try {
        console.log('Impostazioni salvate:', { lingua, modalita });
        await AsyncStorage.setItem('@lingua', lingua);
        await AsyncStorage.setItem('@modalita', modalita);
        console.log('Impostazioni salvate');
    } catch (e) {
        // salvataggio fallito
        console.log('Errore nel salvataggio delle impostazioni', e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.etichetta}>Lingua</Text>
      <Picker
        selectedValue={lingua}
        onValueChange={(itemValue) => setLingua(itemValue)}
        style={styles.picker}>
        <Picker.Item label="Italiano" value="italiano" />
        <Picker.Item label="Inglese" value="inglese" />
      </Picker>

      <Text style={styles.etichetta}>Modalità</Text>
      <Picker
        selectedValue={modalita}
        onValueChange={(itemValue) => setModalita(itemValue)}
        style={styles.picker}>
        <Picker.Item label="Standard" value="standard" />
        <Picker.Item label="Smart" value="smart" />
      </Picker>

      <View style={styles.button}>
        <Button
          title="Salva Impostazioni"
          onPress={salvaImpostazioni}
        />
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
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    marginTop: 40,
    textAlign: "center"
  },
  picker: {
    width: 200,
    height: 44,
    //marginBottom: 20, 
  },
  button: {
    marginTop: 20, 
  },
  etichetta: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20, 
    marginBottom: 8, 
  },
});

export default ChatSettings;