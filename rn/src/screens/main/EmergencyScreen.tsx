import React from 'react'
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native'

export function EmergencyScreen() {
	function onConfirm() {
		Alert.alert('Emergency triggered', 'Authorities have been notified (demo)')
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Emergency</Text>
			<Text style={styles.subtitle}>Hold to confirm panic alert</Text>

			<TouchableOpacity
				onPress={onConfirm}
				style={styles.button}
			>
				<Text style={styles.buttonText}>Send Alert</Text>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1220',
    paddingTop: 56,
    paddingHorizontal: 20,
  },
  title: {
    color: '#e2e8f0',
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#94a3b8',
    marginTop: 8,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#ef4444',
    borderRadius: 9999,
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
