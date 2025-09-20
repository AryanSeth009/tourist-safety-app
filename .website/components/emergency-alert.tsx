"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, MapPin, Clock, Phone, X } from "lucide-react"

interface EmergencyAlertProps {
  isActive: boolean
  onCancel: () => void
  location: string
  emergencyType?: string
}

export function EmergencyAlert({
  isActive,
  onCancel,
  location,
  emergencyType = "General Emergency",
}: EmergencyAlertProps) {
  const [timeElapsed, setTimeElapsed] = useState(0)

  useEffect(() => {
    if (!isActive) {
      setTimeElapsed(0)
      return
    }

    const interval = setInterval(() => {
      setTimeElapsed((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!isActive) return null

  return (
    <div className="fixed inset-0 bg-red-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-red-500 bg-red-50/95 backdrop-blur-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <CardTitle className="text-red-700 flex items-center justify-center space-x-2">
                <AlertTriangle className="h-6 w-6 animate-pulse" />
                <span>Emergency Active</span>
              </CardTitle>
              <CardDescription className="text-red-600 mt-1">
                {emergencyType} • {formatTime(timeElapsed)} elapsed
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel} className="text-red-700 hover:bg-red-100">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <Badge variant="destructive" className="animate-pulse">
              Emergency services notified
            </Badge>
            <p className="text-sm text-red-700">Help is on the way to your location</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="h-4 w-4 text-red-600" />
              <span className="text-red-700">{location}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="h-4 w-4 text-red-600" />
              <span className="text-red-700">Alert sent at {new Date().toLocaleTimeString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              size="sm"
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-100 bg-transparent"
              asChild
            >
              <a href="tel:911">
                <Phone className="h-4 w-4 mr-1" />
                Call 911
              </a>
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-100 bg-transparent"
              onClick={onCancel}
            >
              Cancel Alert
            </Button>
          </div>

          <div className="text-xs text-red-600 text-center">
            Your emergency contacts have been automatically notified with your location.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
