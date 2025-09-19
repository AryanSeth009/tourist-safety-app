import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { RootStackParamList } from '../navigation/AppNavigator'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'

type Nav = NativeStackNavigationProp<RootStackParamList>

export function HomeScreen() {
	const navigation = useNavigation<Nav>()

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Suraksha Setu</Text>
			<Text style={styles.subtitle}>Smart Tourist Safety</Text>

			<View style={styles.cardRow}>
				<View style={styles.card}>
					<Text style={styles.cardTitle}>Safety Score</Text>
					<Text style={styles.cardValue}>82</Text>
				</View>
				<View style={styles.card}>
					<Text style={styles.cardTitle}>Alerts</Text>
					<Text style={styles.cardValue}>2</Text>
				</View>
			</View>

			<TouchableOpacity style={styles.panicButton} onPress={() => navigation.navigate('Emergency')}> 
				<Text style={styles.panicText}>Panic Button</Text>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#0b1220',
		paddingTop: 56,
		paddingHorizontal: 20
	},
	title: {
		color: '#e2e8f0',
		fontSize: 24,
		fontWeight: '700'
	},
	subtitle: {
		color: '#94a3b8',
		marginTop: 4,
		marginBottom: 24
	},
	cardRow: {
		flexDirection: 'row',
		gap: 12,
		marginBottom: 20
	},
	card: {
		flex: 1,
		backgroundColor: '#0f172a',
		borderRadius: 12,
		padding: 16,
		borderWidth: 1,
		borderColor: '#1f2937'
	},
	cardTitle: {
		color: '#94a3b8'
	},
	cardValue: {
		color: '#38bdf8',
		fontSize: 28,
		fontWeight: '800',
		marginTop: 8
	},
	panicButton: {
		marginTop: 'auto',
		marginBottom: 32,
		backgroundColor: '#ef4444',
		borderRadius: 36,
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 16
	},
	panicText: {
		color: '#fff',
		fontSize: 18,
		fontWeight: '700'
	}
})


