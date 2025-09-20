import 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar'
import { NavigationContainer, DefaultTheme, Theme } from '@react-navigation/native'
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { AppNavigator } from './src/navigation/AppNavigator'
import { I18nextProvider } from 'react-i18next'
import i18n from './utils/i18n/i18n'
import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect, useState } from 'react'

const navTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#0b1220',
    card: '#0f172a',
    text: '#e2e8f0',
    border: '#1f2937',
    primary: '#38bdf8'
  }
}

export default function App() {
  const [isI18nReady, setIsI18nReady] = useState(false)

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Load saved language preference
        const savedLanguage = await AsyncStorage.getItem('userLanguage')
        if (savedLanguage) {
          await i18n.changeLanguage(savedLanguage)
        }
        setIsI18nReady(true)
      } catch (error) {
        console.error('Error loading language preference:', error)
        setIsI18nReady(true) // Continue with default language
      }
    }

    initializeApp()
  }, [])

  // Show loading indicator while initializing i18n
  if (!isI18nReady) {
    return (
      <SafeAreaProvider>
        <View style={[styles.container, styles.loadingContainer]}>
          <ActivityIndicator size="large" color="#38bdf8" />
        </View>
      </SafeAreaProvider>
    )
  }

  return (
    <SafeAreaProvider>
      <I18nextProvider i18n={i18n}>
        <NavigationContainer theme={navTheme}>
          <View style={styles.container}>
            <AppNavigator />
            <StatusBar style="light" />
          </View>
        </NavigationContainer>
      </I18nextProvider>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1220',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})