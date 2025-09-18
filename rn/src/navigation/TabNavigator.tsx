import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from '../screens/HomeScreen'
import DashboardScreen from '../screens/DashboardScreen'
import ItineraryScreen from '../screens/ItineraryScreen'
import AlertsScreen from '../screens/AlertsScreen'
import ProfileScreen from '../screens/ProfileScreen'

export type TabParamList = {
  Home: undefined
  Dashboard: undefined
  Itinerary: undefined
  Alerts: undefined
  Profile: undefined
}

const Tab = createBottomTabNavigator<TabParamList>()

export default function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Itinerary" component={ItineraryScreen} />
      <Tab.Screen name="Alerts" component={AlertsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}


