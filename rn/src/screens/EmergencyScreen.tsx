import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'

export function EmergencyScreen() {
	function onConfirm() {
		Alert.alert('Emergency triggered', 'Authorities have been notified (demo)')
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Emergency</Text>
			<Text style={styles.subtitle}>Hold to confirm panic alert</Text>
			<TouchableOpacity style={styles.panicButton} onPress={onConfirm}>
				<Text style={styles.panicText}>Send Alert</Text>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#0b1220', paddingTop: 56, paddingHorizontal: 20 },
	title: { color: '#e2e8f0', fontSize: 22, fontWeight: '700' },
	subtitle: { color: '#94a3b8', marginTop: 8, marginBottom: 24 },
	panicButton: { backgroundColor: '#ef4444', borderRadius: 36, alignItems: 'center', paddingVertical: 16, marginTop: 12 },
	panicText: { color: '#fff', fontSize: 18, fontWeight: '700' }
})


