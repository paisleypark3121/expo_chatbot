// Chatbot.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ChatbotScreen from './screens/ChatbotScreen';
import ChatSettings from './screens/ChatSettingsScreen';
import ChatProfile from './screens/ChatProfileScreen';
import LogoutScreen from './screens/LogoutScreen';

const Drawer = createDrawerNavigator();

const Chatbot = () => {
  return (
    <Drawer.Navigator initialRouteName="Chat">
      <Drawer.Screen name="Chat" component={ChatbotScreen} />
      <Drawer.Screen name="Impostazioni" component={ChatSettings} />
      <Drawer.Screen name="Profilo" component={ChatProfile} />
      <Drawer.Screen name="Logout" component={LogoutScreen} />
    </Drawer.Navigator>
  );
};

export default Chatbot;