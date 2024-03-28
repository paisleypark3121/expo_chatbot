import React, { useState } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import credentials from '../data/credentials.json';
import { useAppContext } from '../context/AppContext';

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
  const { login } = useAppContext();

  const handleLogin = async () => {
    try {
      const user = await authenticateUser(username, password);
      login(user);
    } catch (error) {
      Alert.alert('Login fallito', error.message);
    }
  };

  return (
      <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
          style={{flex: 1}}
          keyboardVerticalOffset={Platform.OS === "ios" ? 170 : 0}
        >
      <View style={styles.container}>        
        <View style={styles.imageContainer}>
            <Image
            source={require('../../assets/logo.png')}
            style={styles.image}
            resizeMode="contain"
            />
        </View>
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
      </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    height: 400,
    width: '100%',
    maxWidth: '100%',
    paddingBottom: 20
  },
  image: {
      height: '100%',
      width: '100%',
  },
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