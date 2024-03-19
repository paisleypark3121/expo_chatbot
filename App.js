import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './src/screens/LoginScreen';
import ChatbotScreen from './src/screens/ChatbotScreen';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const { logout } = useAuth();

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem label="Profile" />
      <DrawerItem label="Settings" />
      <DrawerItem label="Logout" onPress={() => { logout(); }} />
    </DrawerContentScrollView>
  );
}

const AuthenticatedApp = () => {
  return (
    <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Chatbot" component={ChatbotScreen} />
    </Drawer.Navigator>
  );
};


const UnauthenticatedApp = () => {
  return (
    <LoginScreen />
  );
};

const MainApp = () => {
  const { user } = useAuth(); // Usa il contesto per ottenere lo stato dell'utente

  return user ? <AuthenticatedApp /> : <UnauthenticatedApp />;
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <MainApp />
      </NavigationContainer>
    </AuthProvider>
  );
}