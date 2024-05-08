// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Platform ,ScrollView} from 'react-native';

import RegisterScreen from './src/screens/register';
import PolicyScreen from './src/screens/policy';
import RequestScreen from './src/screens/request';
import MainScreen from './src/screens/main';
import LoginScreen from './src/screens/login';
import LabScreen from './src/screens/lab';
import ListScreen from'./src/screens/list';
import QRCodeScreen from'./src/screens/qrcode';
import QRWievScreen from './src/screens/qrwiew';
import CodeScreen from './src/screens/code';
import WelcomePage from './src/page/welcome';
import PolicyPage from './src/page/policypage';
import RegisterPage from './src/page/registerpage';
import ListPage from './src/page/listpage';
import LabPage from './src/page/labspage';
import QRpage from './src/page/QRpage';
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


const App = () => {
  return (
    <NavigationContainer>
       <Stack.Navigator initialRouteName="Welcome">
        {/* Page */}
        <Stack.Screen name="Welcome" component={WelcomePage} options={{ headerShown: false }} />
        <Stack.Screen name="Policypage" component={PolicyPage} options={{ headerShown: false }} />
        <Stack.Screen name="RegisterPage" component={RegisterPage} options={{ headerShown: false }} />
        <Stack.Screen name="ListPage" component={ListPage} options={{ headerShown: false }} />
        <Stack.Screen name="LabPage" component={LabPage} options={{ headerShown: false }} />
        <Stack.Screen name="QRpage" component={QRpage} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />

        {/* Screen */}
        <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Labs" component={LabScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Policy" component={PolicyScreen} options={{ headerShown: false}} />
        <Stack.Screen name="List" component={ListScreen} options={{ headerShown: false}} />
        <Stack.Screen name="Request" component={RequestScreen} options={{ headerShown: false }} />
        <Stack.Screen name="QRcode" component={QRCodeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="QR" component={QRWievScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Code" component={CodeScreen} options={{ headerShown: false }} />

      </Stack.Navigator>
      
    </NavigationContainer>
  );
};

export default App;
