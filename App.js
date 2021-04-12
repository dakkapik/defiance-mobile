import React from 'react';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack'

import LogIn from './screens/LogIn'
import Map from './screens/Map'

enableScreens();
const Stack = createNativeStackNavigator();

export default function App() {
  return(
    <NavigationContainer>
      <Stack.Navigator 
      initialRouteName="Map"
      screenOptions={headerStyle}>
          <Stack.Screen
            name="LogIn"
            component={LogIn}
          />
          <Stack.Screen
            name="Map"
            component={Map}
          />
      </Stack.Navigator>
    </NavigationContainer>
  )
};

const headerStyle = {
  headerShown: false
}