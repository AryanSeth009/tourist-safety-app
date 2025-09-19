import 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar'
import { NavigationContainer, DefaultTheme, Theme } from '@react-navigation/native'
import { StyleSheet, View } from 'react-native'
import { AppNavigator } from './src/navigation/AppNavigator'

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
  return (
    <NavigationContainer theme={navTheme}>
      <View style={styles.container}>
        <AppNavigator />
        <StatusBar style="light" />
      </View>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1220'
  }
})
