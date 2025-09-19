import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { TabNavigator } from './TabNavigator'
import { EmergencyScreen } from '../screens/EmergencyScreen'

export type RootStackParamList = {
	Main: undefined
	Emergency: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()

export function AppNavigator() {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="Main" component={TabNavigator} />
			<Stack.Screen name="Emergency" component={EmergencyScreen} />
		</Stack.Navigator>
	)
}


