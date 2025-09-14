"use client"

import { useState } from "react"
import { MapPin, Shield, AlertTriangle, Navigation2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MapLocation {
  id: string
  name: string
  lat: number
  lng: number
  type: "safe" | "warning" | "danger" | "current"
  description?: string
}

interface MapWidgetProps {
  currentLocation: string
  className?: string
}

export function MapWidget({ currentLocation, className = "" }: MapWidgetProps) {
  const [locations, setLocations] = useState<MapLocation[]>([
    { id: "1", name: "Your Location", lat: 40.7589, lng: -73.9851, type: "current", description: currentLocation },
    {
      id: "2",
      name: "Safe Zone - Police Station",
      lat: 40.7614,
      lng: -73.9776,
      type: "safe",
      description: "NYPD Midtown South",
    },
    {
      id: "3",
      name: "Tourist Alert",
      lat: 40.7505,
      lng: -73.9934,
      type: "warning",
      description: "High pickpocket activity",
    },
    { id: "4", name: "Hospital", lat: 40.7648, lng: -73.9808, type: "safe", description: "Mount Sinai West" },
    {
      id: "5",
      name: "Construction Zone",
      lat: 40.758,
      lng: -73.9855,
      type: "warning",
      description: "Road closure ahead",
    },
  ])

  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null)
  const [mapCenter, setMapCenter] = useState({ lat: 40.7589, lng: -73.9851 })

  const getLocationIcon = (type: string) => {
    switch (type) {
      case "current":
        return <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse border-2 border-white shadow-lg" />
      case "safe":
        return <Shield className="w-4 h-4 text-green-600" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      case "danger":
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      default:
        return <MapPin className="w-4 h-4 text-gray-600" />
    }
  }

  const getLocationColor = (type: string) => {
    switch (type) {
      case "current":
        return "bg-blue-500"
      case "safe":
        return "bg-green-500"
      case "warning":
        return "bg-yellow-500"
      case "danger":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Map Container */}
      <div className="h-64 bg-gradient-to-br from-blue-100 via-green-50 to-emerald-100 rounded-lg relative overflow-hidden border border-white/20">
        {/* Background Map Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 400 300" fill="none">
            {/* Grid Pattern */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Street-like lines */}
            <path d="M0 100 Q100 80 200 100 T400 100" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3" />
            <path
              d="M0 150 Q150 130 300 150 T400 150"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              opacity="0.3"
            />
            <path
              d="M100 0 Q120 100 100 200 T100 300"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              opacity="0.3"
            />
            <path d="M200 0 Q220 150 200 300" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3" />
          </svg>
        </div>

        {/* Location Markers */}
        {locations.map((location, index) => (
          <div
            key={location.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
            style={{
              left: `${20 + (index * 15) + (index % 2) * 10}%`,
              top: `${30 + (index * 12) + (index % 3) * 8}%`,
            }}
            onClick={() => setSelectedLocation(location)}
          >
            <div
              className={`p-2 rounded-full ${getLocationColor(location.type)} shadow-lg hover:scale-110 transition-transform`}
            >
              {getLocationIcon(location.type)}
            </div>
            {location.type === "current" && (
              <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-75"></div>
            )}
          </div>
        ))}

        {/* Zone Overlays */}
        <div className="absolute top-4 left-4 w-16 h-12 bg-green-200 rounded-lg opacity-40 border border-green-400"></div>
        <div className="absolute top-12 right-8 w-20 h-16 bg-yellow-200 rounded-lg opacity-40 border border-yellow-400"></div>
        <div className="absolute bottom-8 left-12 w-12 h-12 bg-green-200 rounded-lg opacity-40 border border-green-400"></div>

        {/* Compass */}
        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg">
          <Navigation2 className="w-4 h-4 text-gray-600" />
        </div>

        {/* Scale */}
        <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm rounded px-2 py-1 text-xs">500m</div>
      </div>

      {/* Location Info Panel */}
      {selectedLocation && (
        <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-white/20 p-4 rounded-b-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-sm">{selectedLocation.name}</h4>
              <p className="text-xs text-muted-foreground">{selectedLocation.description}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSelectedLocation(null)} className="text-xs">
              ✕
            </Button>
          </div>
        </div>
      )}

      {/* Map Controls */}
      <div className="absolute top-4 left-4 flex flex-col space-y-2">
        <Button variant="outline" size="sm" className="w-8 h-8 p-0 bg-white/80 backdrop-blur-sm">
          +
        </Button>
        <Button variant="outline" size="sm" className="w-8 h-8 p-0 bg-white/80 backdrop-blur-sm">
          −
        </Button>
      </div>
    </div>
  )
}
