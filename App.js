import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import  Book  from './src/screens/availability'
import Scanner from './src/screens/scanner'
import confirm from './src/screens/confirm'

console.disableYellowBox = true;

const Stack = createStackNavigator();

function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Book" component={Book} />
          <Stack.Screen name="Scanner" component={Scanner} />
          <Stack.Screen name="confirm" component={confirm} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}

export default App;