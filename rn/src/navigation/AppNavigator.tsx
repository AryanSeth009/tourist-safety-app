import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { TabNavigator } from './TabNavigator'
import { EmergencyScreen } from '../screens/main/EmergencyScreen'
import { HomeScreen } from '../screens/main/HomeScreen'
import { KYCScreen } from '../screens/auth/KYCScreen'
import { ProfileSetupScreen } from '../screens/auth/ProfileSetup'

export type RootStackParamList = {
	Home: undefined
	KYCScreen: undefined
	Main: undefined
	Emergency: undefined
  ProfileSetup: { userData: { name: string; dateOfBirth: string; gender: string; address: string; } };
  MainApp: undefined;
}

const Stack = createNativeStackNavigator<RootStackParamList>()

export function AppNavigator() {
	return (
		<Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
			<Stack.Screen name="Home" component={HomeScreen} />
			<Stack.Screen name="KYCScreen" component={KYCScreen} />
			<Stack.Screen name="Main" component={TabNavigator} />
			<Stack.Screen name="Emergency" component={EmergencyScreen} />
			<Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      <Stack.Screen name="MainApp" component={TabNavigator} />
		</Stack.Navigator>
	)
}
