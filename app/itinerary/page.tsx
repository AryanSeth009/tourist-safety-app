"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, ArrowLeft, Navigation, AlertTriangle, Route, Calendar } from "lucide-react"
import Link from "next/link"

interface ItineraryDay {
  day: number
  date: string
  places: {
    id: string
    name: string
    time: string
    safetyLevel: "safe" | "moderate" | "caution"
  }[]
}

export default function ItineraryPage() {
  const [selectedDay, setSelectedDay] = useState(1)
  const [itinerary] = useState<ItineraryDay[]>([
    {
      day: 1,
      date: "Dec 15, 2024",
      places: [
        { id: "1", name: "Hotel Check-in", time: "2:00 PM", safetyLevel: "safe" },
        { id: "2", name: "Times Square", time: "3:00 PM", safetyLevel: "moderate" },
        { id: "3", name: "Joe's Pizza", time: "6:00 PM", safetyLevel: "safe" },
        { id: "4", name: "Broadway Show", time: "8:00 PM", safetyLevel: "safe" },
      ],
    },
    {
      day: 2,
      date: "Dec 16, 2024",
      places: [
        { id: "5", name: "Central Park", time: "10:00 AM", safetyLevel: "safe" },
        { id: "6", name: "Metropolitan Museum", time: "1:00 PM", safetyLevel: "safe" },
        { id: "7", name: "Little Italy", time: "6:00 PM", safetyLevel: "safe" },
      ],
    },
    {
      day: 3,
      date: "Dec 17, 2024",
      places: [
        { id: "8", name: "Statue of Liberty", time: "9:00 AM", safetyLevel: "safe" },
        { id: "9", name: "Brooklyn Bridge", time: "2:00 PM", safetyLevel: "moderate" },
        { id: "10", name: "Chinatown", time: "7:00 PM", safetyLevel: "moderate" },
      ],
    },
  ])

  const getSafetyColor = (level: string) => {
    switch (level) {
      case "safe":
        return "bg-green-100 text-green-700"
      case "moderate":
        return "bg-yellow-100 text-yellow-700"
      case "caution":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const totalDays = itinerary.length
  const currentDay = itinerary.find((day) => day.day === selectedDay)

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <header className="relative z-10 bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="font-semibold text-lg">My Itinerary</h1>
              <p className="text-sm text-muted-foreground">{totalDays} days • New York City</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Calendar className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 p-4 space-y-6 pb-24">
        <Card className="glass border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Trip Overview</span>
              <Badge variant="outline" className="bg-white/50">
                {totalDays} days
              </Badge>
            </CardTitle>
            <CardDescription>Your New York City adventure</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {itinerary.map((day) => (
                <Button
                  key={day.day}
                  variant={selectedDay === day.day ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDay(day.day)}
                  className={`flex-shrink-0 ${selectedDay === day.day ? "" : "bg-transparent"}`}
                >
                  Day {day.day}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {currentDay && (
          <Card className="glass border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>
                  Day {currentDay.day} - {currentDay.date}
                </span>
              </CardTitle>
              <CardDescription>{currentDay.places.length} places to visit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentDay.places.map((place, index) => (
                <div
                  key={place.id}
                  className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/70 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">{place.name}</h3>
                      <p className="text-xs text-muted-foreground">{place.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`text-xs ${getSafetyColor(place.safetyLevel)}`}>{place.safetyLevel}</Badge>
                    <Button variant="ghost" size="sm">
                      <Navigation className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="h-16 glass border-white/20 touch-manipulation bg-transparent w-full"
            asChild
          >
            <Link href="/alerts" className="flex flex-col items-center space-y-1">
              <AlertTriangle className="h-6 w-6" />
              <span className="text-sm">Safety Zones</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-16 glass border-white/20 touch-manipulation bg-transparent w-full">
            <div className="flex flex-col items-center space-y-1">
              <Route className="h-6 w-6" />
              <span className="text-sm">Plan Route</span>
            </div>
          </Button>
        </div>
      </main>
    </div>
  )
}
