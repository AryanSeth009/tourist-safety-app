import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import MapWidget from '../components/MapWidget'
import Button from '../components/ui/Button'

export default function DashboardScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f1f5f9' }} contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>Welcome back, Alex</Text>
      <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 12, marginBottom: 12 }}>
        <Text style={{ fontWeight: '600', marginBottom: 8 }}>Live Location</Text>
        <MapWidget currentLocation={'Times Square, New York'} />
      </View>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Button style={{ flex: 1, backgroundColor: '#dc2626' }}>SOS</Button>
        <Button variant="outline" style={{ flex: 1 }}>Share Location</Button>
        <Button variant="outline" style={{ flex: 1 }}>Call Help</Button>
      </View>
    </ScrollView>
  )
}


