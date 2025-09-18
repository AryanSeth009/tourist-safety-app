import React, { useState } from 'react'
import { View, Text } from 'react-native'
import MapView, { Marker, Circle } from 'react-native-maps'

interface MapLocation {
  id: string
  name: string
  lat: number
  lng: number
  type: 'safe' | 'warning' | 'danger' | 'current'
  description?: string
}

interface MapWidgetProps {
  currentLocation: string
}

export default function MapWidget({ currentLocation }: MapWidgetProps) {
  const [locations] = useState<MapLocation[]>([
    { id: '1', name: 'Your Location', lat: 40.7589, lng: -73.9851, type: 'current', description: currentLocation },
    { id: '2', name: 'Police Station', lat: 40.7614, lng: -73.9776, type: 'safe', description: 'NYPD Midtown South' },
    { id: '3', name: 'Tourist Alert', lat: 40.7505, lng: -73.9934, type: 'warning', description: 'High pickpocket activity' },
  ])

  return (
    <View style={{ height: 256, borderRadius: 12, overflow: 'hidden' }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{ latitude: 40.7589, longitude: -73.9851, latitudeDelta: 0.05, longitudeDelta: 0.05 }}
      >
        {locations.map(loc => (
          <Marker key={loc.id} coordinate={{ latitude: loc.lat, longitude: loc.lng }} title={loc.name} description={loc.description} />
        ))}
        <Circle center={{ latitude: 40.7589, longitude: -73.9851 }} radius={200} strokeColor="#22c55e" fillColor="rgba(34,197,94,0.2)" />
      </MapView>
    </View>
  )
}


