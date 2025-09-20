"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Shield, Navigation, X, MapPin } from "lucide-react"

interface GeoFenceAlertProps {
  isVisible: boolean
  onDismiss: () => void
  zoneType: "safe" | "warning" | "danger" | "restricted"
  zoneName: string
  message: string
  actionType: "entry" | "exit" | "proximity"
  suggestedAction?: string
}

export function GeoFenceAlert({
  isVisible,
  onDismiss,
  zoneType,
  zoneName,
  message,
  actionType,
  suggestedAction,
}: GeoFenceAlertProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true)
      // Vibrate on alert
      if ("vibrate" in navigator) {
        const pattern = zoneType === "danger" ? [200, 100, 200] : [100]
        navigator.vibrate(pattern)
      }
    }
  }, [isVisible, zoneType])

  const getAlertIcon = () => {
    switch (zoneType) {
      case "safe":
        return <Shield className="h-6 w-6 text-green-600" />
      case "warning":
        return <AlertTriangle className="h-6 w-6 text-yellow-600" />
      case "danger":
        return <AlertTriangle className="h-6 w-6 text-red-600" />
      case "restricted":
        return <MapPin className="h-6 w-6 text-purple-600" />
      default:
        return <AlertTriangle className="h-6 w-6 text-gray-600" />
    }
  }

  const getAlertColor = () => {
    switch (zoneType) {
      case "safe":
        return "border-green-500 bg-green-50/95"
      case "warning":
        return "border-yellow-500 bg-yellow-50/95"
      case "danger":
        return "border-red-500 bg-red-50/95"
      case "restricted":
        return "border-purple-500 bg-purple-50/95"
      default:
        return "border-gray-500 bg-gray-50/95"
    }
  }

  const getActionText = () => {
    switch (actionType) {
      case "entry":
        return "Entered"
      case "exit":
        return "Exited"
      case "proximity":
        return "Approaching"
      default:
        return "Alert"
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed top-20 left-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
      <Card className={`${getAlertColor()} backdrop-blur-md border-2 shadow-lg`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className={isAnimating ? "animate-pulse" : ""}>{getAlertIcon()}</div>
              <div>
                <h3 className="font-semibold text-sm">
                  {getActionText()} {zoneName}
                </h3>
                <Badge variant="outline" className="text-xs mt-1">
                  {zoneType.charAt(0).toUpperCase() + zoneType.slice(1)} Zone
                </Badge>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onDismiss} className="h-6 w-6 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mb-3">{message}</p>

          {suggestedAction && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{suggestedAction}</p>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="text-xs h-7 bg-transparent">
                  <Navigation className="h-3 w-3 mr-1" />
                  Navigate
                </Button>
                <Button size="sm" variant="outline" className="text-xs h-7 bg-transparent" onClick={onDismiss}>
                  Dismiss
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
