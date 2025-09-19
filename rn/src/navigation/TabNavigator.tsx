import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { HomeScreen } from '../screens/HomeScreen'
import { DashboardScreen } from '../screens/DashboardScreen'
import { ItineraryScreen } from '../screens/ItineraryScreen'
import { AlertsScreen } from '../screens/AlertsScreen'
import { ProfileScreen } from '../screens/ProfileScreen'
import { Feather } from '@expo/vector-icons'

export type MainTabsParamList = {
	Home: undefined
	Dashboard: undefined
	Itinerary: undefined
	Alerts: undefined
	Profile: undefined
}

const Tab = createBottomTabNavigator<MainTabsParamList>()

export function TabNavigator() {
	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				headerShown: false,
				tabBarStyle: { backgroundColor: '#0f172a', borderTopColor: '#1f2937' },
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
			<Tab.Screen name="Profile" component={ProfileScreen} />
		</Tab.Navigator>
	)
}


