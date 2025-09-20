"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertTriangle,
  Phone,
  Share2,
  Navigation,
  Bell,
  User,
  Menu,
  MapPin,
  Clock,
  Wifi,
  WifiOff,
  Settings,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import { MapWidget } from "@/components/map-widget"
import { SafetyScoreWidget } from "@/components/safety-score-widget"

export default function Dashboard() {
  const [safetyScore, setSafetyScore] = useState(85)
  const [currentLocation, setCurrentLocation] = useState("Times Square, New York")
  const [isOnline, setIsOnline] = useState(true)
  const [lastUpdate, setLastUpdate] = useState("Just now")
  const [alerts, setAlerts] = useState([
    { id: 1, type: "warning", message: "High tourist activity in your area", time: "2 min ago", priority: "medium" },
    { id: 2, type: "info", message: "Weather update: Light rain expected", time: "15 min ago", priority: "low" },
    { id: 3, type: "success", message: "You entered a safe zone", time: "1 hour ago", priority: "low" },
  ])
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const handleEmergencyPress = () => {
    if ("vibrate" in navigator) {
      navigator.vibrate([200, 100, 200])
    }
  }

  const handleShareLocation = async () => {
    if ("share" in navigator) {
      try {
        await navigator.share({
          title: "My Current Location - SafeTravel",
          text: `I'm currently at ${currentLocation}. Track my location for safety.`,
          url: window.location.href,
        })
      } catch (err) {
        console.log("Share failed:", err)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Button variant="ghost" size="sm" onClick={() => setShowMenu(!showMenu)} className="relative">
                <Menu className="h-5 w-5" />
              </Button>
              {showMenu && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-lg shadow-lg border border-white/20 z-50">
                  <div className="py-2">
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm hover:bg-white/50 transition-colors"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center px-4 py-2 text-sm hover:bg-white/50 transition-colors"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        /* Add logout logic */
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-white/50 transition-colors text-red-600"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div>
              <h1 className="font-semibold text-lg">Welcome back, Alex</h1>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{currentLocation}</span>
                {isOnline ? <Wifi className="h-3 w-3 text-green-600" /> : <WifiOff className="h-3 w-3 text-red-600" />}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={isOnline ? "default" : "destructive"} className="text-xs">
              {isOnline ? "Online" : "Offline"}
            </Badge>
            <Button variant="ghost" size="sm">
              <Bell className="h-5 w-5" />
              {alerts.filter((a) => a.priority === "high").length > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/profile">
                <User className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 p-4 space-y-6 pb-36">
        {/* Safety Score Widget */}
        <SafetyScoreWidget score={safetyScore} trend="up" />

        {/* Interactive Map */}
        <Card className="glass border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Live Location</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{lastUpdate}</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <MapWidget currentLocation={currentLocation} />
          </CardContent>
        </Card>

        {/* Quick Actions - Mobile Optimized */}
        <div className="grid grid-cols-3 gap-4">
          <Button
            size="lg"
            className="h-20 bg-red-600 hover:bg-red-700 text-white pulse-glow touch-manipulation"
            onClick={handleEmergencyPress}
            asChild
          >
            <Link href="/emergency" className="flex flex-col items-center space-y-1">
              <AlertTriangle className="h-6 w-6" />
              <span className="text-xs font-medium">SOS</span>
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-20 glass border-white/20 touch-manipulation bg-transparent"
            onClick={handleShareLocation}
          >
            <div className="flex flex-col items-center space-y-1">
              <Share2 className="h-6 w-6" />
              <span className="text-xs">Share Location</span>
            </div>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-20 glass border-white/20 touch-manipulation bg-transparent"
            asChild
          >
            <Link href="tel:+1-911" className="flex flex-col items-center space-y-1">
              <Phone className="h-6 w-6" />
              <span className="text-xs">Call Help</span>
            </Link>
          </Button>
        </div>

        {/* Alerts Panel - Enhanced */}
        <Card className="glass border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Recent Alerts</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {alerts.length} active
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start space-x-3 p-3 rounded-lg bg-white/50 hover:bg-white/70 transition-colors"
              >
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    alert.type === "warning" ? "bg-yellow-500" : alert.type === "info" ? "bg-blue-500" : "bg-green-500"
                  }`}
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <Badge variant={alert.priority === "high" ? "destructive" : "secondary"} className="text-xs ml-2">
                      <span className={alert.priority === "medium" ? "text-orange-800" : ""}>{alert.priority}</span>
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Navigation Links */}
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="h-16 glass border-white/20 touch-manipulation bg-transparent" asChild>
            <Link href="/itinerary" className="flex flex-col items-center space-y-1">
              <Navigation className="h-6 w-6" />
              <span className="text-sm">My Itinerary</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-16 glass border-white/20 touch-manipulation bg-transparent" asChild>
            <Link href="/alerts" className="flex flex-col items-center space-y-1">
              <AlertTriangle className="h-6 w-6" />
              <span className="text-sm">Safety Zones</span>
            </Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
