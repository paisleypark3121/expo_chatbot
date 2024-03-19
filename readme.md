npx create-expo-app ChatBot
cd ChatBot
npx expo install react-dom react-native-web @expo/metro-runtime
npx expo start

npm i react-native-vector-icons

---

SNIPPET

rfc React Functional Component

---

NAVIGATOR

npm install @react-navigation/native
npm install @react-navigation/drawer
npx expo install react-native-screens react-native-safe-area-context
npm install react-native-screens react-native-safe-area-context

---

ASYNC STORAGE

npm install @react-native-async-storage/async-storage

---

ESEMPIO USESTATE

import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';

const Counter = () => {
// Inizializza lo stato 'contatore' con un valore iniziale di 0
const [contatore, setContatore] = useState(0);

// Funzione per incrementare il contatore
const incrementa = () => {
setContatore(contatore + 1);
};

return (
<View>
<Text>Conteggio: {contatore}</Text>
<Button title="Incrementa" onPress={incrementa} />
</View>
);
};

export default Counter;
