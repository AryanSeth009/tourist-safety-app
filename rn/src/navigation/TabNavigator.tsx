import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { HomeScreen } from '../screens/main/HomeScreen'
import { DashboardScreen } from '../screens/main/DashboardScreen'
import { ItineraryScreen } from '../screens/main/ItineraryScreen'
import { AlertsScreen } from '../screens/main/AlertsScreen'
import { ProfileSetup } from '../screens/auth/ProfileSetup'
import { Feather } from '@expo/vector-icons'
import { View, StyleSheet } from 'react-native'

export type MainTabsParamList = {
	Home: undefined
	Dashboard: undefined
	Itinerary: undefined
	Alerts: undefined
	ProfileSetup: undefined
}

const Tab = createBottomTabNavigator<MainTabsParamList>()

export function TabNavigator() {
	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				headerShown: false,
				tabBarStyle: styles.tabBarStyle,
				tabBarActiveTintColor: '#38bdf8',
				tabBarInactiveTintColor: '#94a3b8',
				tabBarIcon: ({ color, size }) => {
					const map: Record<string, keyof typeof Feather.glyphMap> = {
						Home: 'home',
						Dashboard: 'activity',
						Itinerary: 'map',
						Alerts: 'bell',
						Profile: 'user'
					}
					return <Feather name={map[route.name]} size={size} color={color} />
				}
			})}
		>
			<Tab.Screen name="Home" component={HomeScreen} />
			<Tab.Screen name="Dashboard" component={DashboardScreen} />
			<Tab.Screen name="Itinerary" component={ItineraryScreen} />
			<Tab.Screen name="Alerts" component={AlertsScreen} />
			<Tab.Screen name="Profile" component={ProfileSetup} />
		</Tab.Navigator>
	)
}

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: '#0f172a',
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
  },
});


