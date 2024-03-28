import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import { StyleSheet, Text, View, Button } from 'react-native';
import { AppProvider, useAppContext } from './src/context/AppContext';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './src/screens/LoginScreen';
import ChatbotScreen from './src/screens/ChatbotScreen';
import ChatSettingsScreen from './src/screens/ChatSettingsScreen';
import ChatProfileScreen from './src/screens/ChatProfileScreen';


const Drawer = createDrawerNavigator();

const customFonts = {
  'OpenDyslexic-Regular': require('./assets/fonts/OpenDyslexic-Regular.otf'),
};

function CustomDrawerContent(props) {
  const { logout } = useAppContext();
  const { navigation } = props;

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem label="Logout" onPress={() => { logout(); }} />
      <DrawerItem 
        label="Reset Chatbot" 
        onPress={() => navigation.navigate('Chatbot', { reset: true })} 
      />
    </DrawerContentScrollView>
  );
}

const AuthenticatedApp = () => {
  return (
    <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Chatbot" component={ChatbotScreen} />
      <Drawer.Screen name="Profile" component={ChatProfileScreen} />
      <Drawer.Screen name="Settings" component={ChatSettingsScreen} />
    </Drawer.Navigator>
  );
};


const UnauthenticatedApp = () => {
  return (
    <LoginScreen />
  );
};

const MainApp = () => {
  const { user } = useAppContext();

  return user ? <AuthenticatedApp /> : <UnauthenticatedApp />;
};

export default function App() {

  const [fontsLoaded, setFontsLoaded] = useState(false);

  async function loadFonts() {
    await Font.loadAsync(customFonts);
    setFontsLoaded(true);
  }

  useEffect(() => {
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <Text>Loading...</Text>; // Considera l'utilizzo di un componente di loading dedicato
  }

  return (
    <AppProvider>
      <NavigationContainer>
        <MainApp />
      </NavigationContainer>
    </AppProvider>
  );
}