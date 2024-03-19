import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useAuth } from './src/context/AuthContext';

export default function LogoutScreen() {
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <Button title="Logout" onPress={() => logout()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});