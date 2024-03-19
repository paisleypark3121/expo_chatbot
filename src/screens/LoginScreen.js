import React, { useState } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import credentials from '../data/credentials.json';
import { useAuth } from '../context/AuthContext';

const authenticateUser = async (username, password) => {
  const user = credentials.users.find(u => u.username === username && u.password === password);
  if (user) {
    return { username };
  }
  throw new Error('Credenziali non valide');
};

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const user = await authenticateUser(username, password);
      login(user);
    } catch (error) {
      Alert.alert('Login fallito', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Pressable 
        style={styles.button} 
        title="Login" 
        onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
      {/* {loginError && <Text>Username o password errati!</Text>} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    marginTop: 40,
    textAlign: "center"
  },
  input: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
  },
  button: { // Style for the button view
    marginTop: 10,
    paddingVertical: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  buttonText: { // Style for the text inside the button
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
});