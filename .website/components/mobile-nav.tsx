"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Home, AlertTriangle, Calendar, User, Shield } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { EmergencyAlert } from "@/components/emergency-alert"

interface NavItem {
  href: string
  icon: React.ReactNode
  label: string
  badge?: number
}

export function MobileNav() {
  const pathname = usePathname()
  const [isEmergencyActive, setIsEmergencyActive] = useState(false)
  const [showPanicButton, setShowPanicButton] = useState(true)

  const navItems: NavItem[] = [
    {
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />,
      label: "Home",
    },
    {
      href: "/itinerary",
      icon: <Calendar className="h-5 w-5" />,
      label: "Itinerary",
    },
    {
      href: "/alerts",
      icon: <Shield className="h-5 w-5" />,
      label: "Safety",
      badge: 2,
    },
    {
      href: "/profile",
      icon: <User className="h-5 w-5" />,
      label: "Profile",
    },
  ]

  // Hide panic button on landing page
  useEffect(() => {
    setShowPanicButton(pathname !== "/")
  }, [pathname])

  const handleEmergency = () => {
    setIsEmergencyActive(true)
    // Trigger emergency alert logic here
  }

  const handleCancelEmergency = () => {
    setIsEmergencyActive(false)
  }

  // Don't show navigation on landing page
  if (pathname === "/") {
    return null
  }

  return (
    <>
      {/* Emergency Alert Overlay */}
      <EmergencyAlert
        isActive={isEmergencyActive}
        onCancel={handleCancelEmergency}
        location="Times Square, New York"
        emergencyType="General Emergency"
      />

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-white/20 safe-area-pb">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Button
                key={item.href}
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center space-y-1 h-auto py-2 px-3 touch-manipulation relative ${
                  isActive
                    ? "text-emerald-700 bg-emerald-100/80 dark:text-emerald-300 dark:bg-emerald-900/50"
                    : "text-slate-700 dark:text-slate-300"
                }`}
                asChild
              >
                <Link href={item.href}>
                  {item.icon}
                  <span className="text-xs font-medium">{item.label}</span>
                  {item.badge && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 w-5 h-5 text-xs flex items-center justify-center p-0"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </Button>
            )
          })}
        </div>

        {/* Full-width Panic Button */}
        {showPanicButton && (
          <div className="px-4 pb-4 pt-2">
            <Button
              className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-bold text-lg pulse-glow touch-manipulation"
              onClick={handleEmergency}
            >
              <div className="flex items-center justify-center space-x-2">
                <AlertTriangle className="h-6 w-6" />
                <span>EMERGENCY SOS</span>
              </div>
            </Button>
          </div>
        )}
      </nav>

      {/* Spacer to prevent content from being hidden behind nav */}
      <div className={`h-${showPanicButton ? "32" : "20"} flex-shrink-0`} />
    </>
  )
}
