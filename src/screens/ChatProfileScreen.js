import React from 'react'
import { View, Text, Button, StyleSheet, Platform } from 'react-native';

export default function ChatProfileScreen() {
  return (
    <View style={styles.container}>
      <Text>
        Hello Profile
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});