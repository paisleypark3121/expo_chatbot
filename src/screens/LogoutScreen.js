import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useAppContext } from '../context/AppContext';

export default function LogoutScreen() {
  const { logout } = useAppContext();

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