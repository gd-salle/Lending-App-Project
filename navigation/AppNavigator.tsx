import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import Collectibles from '../screens/Collectibles';
import DataEntry from '../screens/DataEntry';


type RootStackParamList = {
  Home: undefined;          // No parameters for Home screen
  Collectibles: undefined;  // No parameters for Collectibles screen
  DataEntry: undefined; // No parameters for Data entry screen
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Collectibles" 
          component={Collectibles} 
          options={{ headerShown: false }} 
        />
          <Stack.Screen 
          name="DataEntry" 
          component={DataEntry} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
