import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import TabNavigator from './TabNavigator'
import EmergencyScreen from '../screens/EmergencyScreen'

export type RootStackParamList = {
  Main: undefined
  Emergency: undefined
}

const Stack = createStackNavigator<RootStackParamList>()

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen name="Emergency" component={EmergencyScreen} />
    </Stack.Navigator>
  )
}


