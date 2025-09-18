import React from 'react'
import { View, Text, Alert } from 'react-native'
import PanicButton from '../components/PanicButton'

export default function EmergencyScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 16 }}>Emergency</Text>
      <PanicButton onEmergency={() => Alert.alert('Emergency triggered')} />
    </View>
  )
}


