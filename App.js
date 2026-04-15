/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from "./pages/login";
import HomePage from "./pages/home";
import SignupPage from "./pages/signup";
import AuthContextProvider, { AuthContext } from './contexts/AuthContext';
import config from "./styleConfig";

const Stack = createNativeStackNavigator();

function AppWithContext() {
  const { isLoggedIn } = useContext(AuthContext);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {
          isLoggedIn ? (
            <Stack.Screen name="Home" component={HomePage} />
          ) : (
            <>
              <Stack.Screen name="Login" component={LoginPage} />
              <Stack.Screen name="Signup" component={SignupPage} />
            </>
          )
        }
      </Stack.Navigator>
    </NavigationContainer>

  )
}

function App() {
  return (
    <AuthContextProvider>
      <AppWithContext />
    </AuthContextProvider>
  );
}

export default App;
