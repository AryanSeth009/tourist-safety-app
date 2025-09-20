"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  AlertTriangle,
  Phone,
  MapPin,
  Clock,
  Shield,
  Users,
  ArrowLeft,
  Volume2,
  VolumeX,
  Smartphone,
} from "lucide-react"
import Link from "next/link"

interface EmergencyContact {
  id: string
  name: string
  phone: string
  relationship: string
  priority: number
}

export default function EmergencyPage() {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [location, setLocation] = useState("Times Square, New York")
  const [isSoundEnabled, setIsSoundEnabled] = useState(true)
  const [emergencyContacts] = useState<EmergencyContact[]>([
    { id: "1", name: "Emergency Services", phone: "911", relationship: "Emergency", priority: 1 },
    { id: "2", name: "Tourist Helpline", phone: "+1-800-TOURIST", relationship: "Support", priority: 2 },
    { id: "3", name: "John Smith", phone: "+1-555-0123", relationship: "Emergency Contact", priority: 3 },
    { id: "4", name: "Hotel Concierge", phone: "+1-555-0456", relationship: "Accommodation", priority: 4 },
  ])

  const audioRef = useRef<HTMLAudioElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const startEmergency = () => {
    setCountdown(5)
    setIsEmergencyActive(true)

    // Vibration pattern for emergency
    if ("vibrate" in navigator) {
      navigator.vibrate([500, 200, 500, 200, 500])
    }

    // Start countdown
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          triggerEmergencyAlert()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const cancelEmergency = () => {
    setIsEmergencyActive(false)
    setCountdown(0)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  const triggerEmergencyAlert = () => {
    // Play emergency sound
    if (isSoundEnabled && audioRef.current) {
      audioRef.current.play().catch(console.error)
    }

    // Send emergency alert (mock)
    console.log("Emergency alert sent!")
    console.log("Location:", location)
    console.log("Time:", new Date().toISOString())

    // Continue vibration
    if ("vibrate" in navigator) {
      navigator.vibrate([1000, 500, 1000, 500, 1000])
    }
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      {/* Audio element for emergency sound */}
      <audio ref={audioRef} loop>
        <source src="/emergency-alert.mp3" type="audio/mpeg" />
      </audio>

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
              <h1 className="font-semibold text-lg text-red-700">Emergency Center</h1>
              <p className="text-sm text-muted-foreground">Immediate help and support</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            className={isSoundEnabled ? "text-green-600" : "text-red-600"}
          >
            {isSoundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Emergency Status */}
        {isEmergencyActive && (
          <Card className="border-red-500 bg-red-50/80 glass">
            <CardHeader className="text-center">
              <CardTitle className="text-red-700 flex items-center justify-center space-x-2">
                <AlertTriangle className="h-6 w-6 animate-pulse" />
                <span>Emergency Alert Active</span>
              </CardTitle>
              <CardDescription className="text-red-600">
                {countdown > 0 ? `Sending alert in ${countdown} seconds...` : "Emergency services have been notified"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {countdown > 0 && (
                <div className="space-y-2">
                  <Progress value={(5 - countdown) * 20} className="h-3" />
                  <Button onClick={cancelEmergency} variant="outline" className="w-full bg-transparent">
                    Cancel Emergency Alert
                  </Button>
                </div>
              )}
              {countdown === 0 && (
                <div className="text-center space-y-2">
                  <Badge variant="destructive" className="animate-pulse">
                    Help is on the way
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Your location and emergency details have been shared with authorities.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Main Emergency Button */}
        {!isEmergencyActive && (
          <Card className="glass border-white/20">
            <CardContent className="flex flex-col items-center space-y-6 py-12">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-red-700 font-[family-name:var(--font-playfair)]">
                  Emergency SOS
                </h2>
                <p className="text-muted-foreground text-balance">
                  Press and hold the button below to send an emergency alert with your location
                </p>
              </div>

              <div className="relative">
                <Button
                  size="lg"
                  className="w-32 h-32 rounded-full bg-red-600 hover:bg-red-700 text-white text-xl font-bold pulse-glow touch-manipulation"
                  onMouseDown={startEmergency}
                  onTouchStart={startEmergency}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <AlertTriangle className="h-8 w-8" />
                    <span>SOS</span>
                  </div>
                </Button>
                <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-75 pointer-events-none"></div>
              </div>

              <div className="text-center space-y-1">
                <p className="text-sm font-medium">Current Location</p>
                <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{location}</span>
                </div>
                <div className="flex items-center justify-center space-x-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Last updated: Just now</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Emergency Contacts */}
        <Card className="glass border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Phone className="h-5 w-5" />
              <span>Emergency Contacts</span>
            </CardTitle>
            <CardDescription>Quick access to important phone numbers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {emergencyContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-3 rounded-lg bg-white/50 hover:bg-white/70 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {contact.priority === 1 ? (
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    ) : contact.priority === 2 ? (
                      <Shield className="h-5 w-5 text-blue-600" />
                    ) : contact.relationship === "Emergency Contact" ? (
                      <Users className="h-5 w-5 text-green-600" />
                    ) : (
                      <Smartphone className="h-5 w-5 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{contact.name}</p>
                    <p className="text-xs text-muted-foreground">{contact.relationship}</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" asChild className="touch-manipulation bg-transparent">
                  <a href={`tel:${contact.phone}`}>
                    <Phone className="h-4 w-4 mr-1" />
                    Call
                  </a>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Safety Tips */}
        <Card className="glass border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Emergency Tips</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Before Emergency:</h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Stay calm and assess the situation</li>
                <li>• Move to a safe location if possible</li>
                <li>• Keep your phone charged and accessible</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">During Emergency:</h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Press SOS to alert authorities</li>
                <li>• Share your location with trusted contacts</li>
                <li>• Follow instructions from emergency services</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="h-16 glass border-white/20 touch-manipulation bg-transparent" asChild>
            <Link href="/dashboard" className="flex flex-col items-center space-y-1">
              <ArrowLeft className="h-6 w-6" />
              <span className="text-sm">Back to Dashboard</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-16 glass border-white/20 touch-manipulation bg-transparent" asChild>
            <Link href="/profile" className="flex flex-col items-center space-y-1">
              <Users className="h-6 w-6" />
              <span className="text-sm">Manage Contacts</span>
            </Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
