// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import RoleSelectionScreen from './screens/RoleSelectionScreen';
import FoodDetailsScreen from './screens/FoodDetailsScreen';
import TabsSwitcher from './components/TabsSwitcher';

// Context
import { RoleProvider } from './context/RoleContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <RoleProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
          <Stack.Screen name="Tabs" component={TabsSwitcher} />
          <Stack.Screen name="FoodDetails" component={FoodDetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </RoleProvider>
  );
}