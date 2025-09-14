"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Shield, AlertTriangle, MapPin, ArrowLeft, Bell, Navigation, Eye, EyeOff, Volume2, VolumeX } from "lucide-react"
import Link from "next/link"

interface SafetyZone {
  id: string
  name: string
  type: "safe" | "warning" | "danger" | "restricted"
  description: string
  radius: number
  coordinates: { lat: number; lng: number }
  isActive: boolean
  alertsEnabled: boolean
}

interface GeoAlert {
  id: string
  type: "entry" | "exit" | "proximity"
  zone: string
  message: string
  timestamp: string
  severity: "low" | "medium" | "high"
  isRead: boolean
}

export default function AlertsPage() {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [vibrationEnabled, setVibrationEnabled] = useState(true)
  const [safetyZones, setSafetyZones] = useState<SafetyZone[]>([
    {
      id: "1",
      name: "Times Square Safe Zone",
      type: "safe",
      description: "High police presence, well-lit area with security cameras",
      radius: 200,
      coordinates: { lat: 40.7589, lng: -73.9851 },
      isActive: true,
      alertsEnabled: true,
    },
    {
      id: "2",
      name: "Construction Area",
      type: "warning",
      description: "Active construction site - pedestrian detour required",
      radius: 150,
      coordinates: { lat: 40.7505, lng: -73.9934 },
      isActive: true,
      alertsEnabled: true,
    },
    {
      id: "3",
      name: "Central Park After Dark",
      type: "danger",
      description: "Avoid after 10 PM - limited lighting and security",
      radius: 500,
      coordinates: { lat: 40.7829, lng: -73.9654 },
      isActive: true,
      alertsEnabled: true,
    },
    {
      id: "4",
      name: "Restricted Government Area",
      type: "restricted",
      description: "Federal building - no photography or loitering",
      radius: 100,
      coordinates: { lat: 40.7614, lng: -73.9776 },
      isActive: true,
      alertsEnabled: false,
    },
  ])

  const [geoAlerts] = useState<GeoAlert[]>([
    {
      id: "1",
      type: "entry",
      zone: "Times Square Safe Zone",
      message: "You have entered a monitored safe zone with 24/7 security",
      timestamp: "2 min ago",
      severity: "low",
      isRead: false,
    },
    {
      id: "2",
      type: "proximity",
      zone: "Construction Area",
      message: "Construction zone ahead - consider alternate route",
      timestamp: "15 min ago",
      severity: "medium",
      isRead: true,
    },
    {
      id: "3",
      type: "exit",
      zone: "Central Park After Dark",
      message: "You have safely exited the high-risk zone",
      timestamp: "1 hour ago",
      severity: "low",
      isRead: true,
    },
  ])

  const getZoneIcon = (type: string) => {
    switch (type) {
      case "safe":
        return <Shield className="h-5 w-5 text-green-600" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case "danger":
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      case "restricted":
        return <Eye className="h-5 w-5 text-purple-600" />
      default:
        return <MapPin className="h-5 w-5 text-gray-600" />
    }
  }

  const getZoneColor = (type: string) => {
    switch (type) {
      case "safe":
        return "bg-green-100 text-green-700 border-green-200"
      case "warning":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "danger":
        return "bg-red-100 text-red-700 border-red-200"
      case "restricted":
        return "bg-purple-100 text-purple-700 border-purple-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "entry":
        return "🚪"
      case "exit":
        return "🚶"
      case "proximity":
        return "📍"
      default:
        return "ℹ️"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const toggleZoneAlerts = (zoneId: string) => {
    setSafetyZones((zones) =>
      zones.map((zone) => (zone.id === zoneId ? { ...zone, alertsEnabled: !zone.alertsEnabled } : zone)),
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="font-semibold text-lg">Safety Zones & Alerts</h1>
              <p className="text-sm text-muted-foreground">Geo-fencing and location monitoring</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Bell className="h-5 w-5" />
              {geoAlerts.filter((alert) => !alert.isRead).length > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Alert Settings */}
        <Card className="glass border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Alert Preferences</span>
            </CardTitle>
            <CardDescription>Configure how you receive safety notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                <Label htmlFor="sound">Sound Alerts</Label>
              </div>
              <Switch id="sound" checked={soundEnabled} onCheckedChange={setSoundEnabled} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm">📳</span>
                <Label htmlFor="vibration">Vibration</Label>
              </div>
              <Switch id="vibration" checked={vibrationEnabled} onCheckedChange={setVibrationEnabled} />
            </div>
          </CardContent>
        </Card>

        {/* Active Safety Zones */}
        <Card className="glass border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Active Safety Zones</span>
            </CardTitle>
            <CardDescription>Geo-fenced areas with automatic alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {safetyZones.map((zone) => (
              <div key={zone.id} className={`p-4 rounded-lg border ${getZoneColor(zone.type)}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getZoneIcon(zone.type)}
                    <h3 className="font-semibold text-sm">{zone.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {zone.radius}m radius
                    </Badge>
                  </div>
                  <Switch checked={zone.alertsEnabled} onCheckedChange={() => toggleZoneAlerts(zone.id)} size="sm" />
                </div>
                <p className="text-sm opacity-80 mb-3">{zone.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {zone.type.charAt(0).toUpperCase() + zone.type.slice(1)} Zone
                  </Badge>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="text-xs h-7 bg-transparent">
                      <Navigation className="h-3 w-3 mr-1" />
                      Navigate
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs h-7 bg-transparent">
                      {zone.alertsEnabled ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Geo Alerts */}
        <Card className="glass border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Recent Alerts</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {geoAlerts.filter((alert) => !alert.isRead).length} unread
              </Badge>
            </CardTitle>
            <CardDescription>Location-based notifications and warnings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {geoAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border transition-colors ${
                  alert.isRead ? "bg-white/30 border-white/20" : "bg-white/60 border-white/40"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getAlertIcon(alert.type)}</span>
                    <div>
                      <p className="font-medium text-sm">{alert.zone}</p>
                      <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                    </div>
                  </div>
                  <Badge className={`text-xs ${getSeverityColor(alert.severity)}`}>{alert.severity}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{alert.message}</p>
                {!alert.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Map View Button */}
        <Card className="glass border-white/20">
          <CardContent className="p-4">
            <Button className="w-full h-16 bg-primary hover:bg-primary/90" asChild>
              <Link href="/map" className="flex flex-col items-center space-y-1">
                <MapPin className="h-6 w-6" />
                <span>View All Zones on Map</span>
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="h-16 glass border-white/20 touch-manipulation bg-transparent" asChild>
            <Link href="/itinerary" className="flex flex-col items-center space-y-1">
              <Navigation className="h-6 w-6" />
              <span className="text-sm">Back to Itinerary</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-16 glass border-white/20 touch-manipulation bg-transparent">
            <div className="flex flex-col items-center space-y-1">
              <Shield className="h-6 w-6" />
              <span className="text-sm">Safety Settings</span>
            </div>
          </Button>
        </div>
      </main>
    </div>
  )
}
