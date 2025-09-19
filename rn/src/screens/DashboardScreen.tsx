import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export function DashboardScreen() {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Dashboard</Text>
			<View style={styles.card}>
				<Text style={styles.cardTitle}>Recent Alerts</Text>
				<Text style={styles.cardBody}>No new alerts</Text>
			</View>
			<View style={styles.card}>
				<Text style={styles.cardTitle}>Nearby Safe Zones</Text>
				<Text style={styles.cardBody}>Central Police Station, Tourist Helpdesk</Text>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#0b1220', paddingTop: 56, paddingHorizontal: 20 },
	title: { color: '#e2e8f0', fontSize: 22, fontWeight: '700', marginBottom: 16 },
	card: { backgroundColor: '#0f172a', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#1f2937', marginBottom: 12 },
	cardTitle: { color: '#94a3b8', marginBottom: 6 },
	cardBody: { color: '#cbd5e1' }
})


