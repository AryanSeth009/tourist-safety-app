"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface PanicButtonProps {
  onEmergency: () => void
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  disabled?: boolean
}

export function PanicButton({ onEmergency, className, size = "lg", disabled = false }: PanicButtonProps) {
  const [isPressed, setIsPressed] = useState(false)
  const [holdProgress, setHoldProgress] = useState(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const HOLD_DURATION = 3000 // 3 seconds

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "w-16 h-16 text-sm"
      case "md":
        return "w-24 h-24 text-base"
      case "lg":
        return "w-32 h-32 text-xl"
      case "xl":
        return "w-40 h-40 text-2xl"
      default:
        return "w-32 h-32 text-xl"
    }
  }

  const startHold = () => {
    if (disabled) return

    setIsPressed(true)
    setHoldProgress(0)

    // Vibrate on start
    if ("vibrate" in navigator) {
      navigator.vibrate(100)
    }

    // Progress animation
    intervalRef.current = setInterval(() => {
      setHoldProgress((prev) => {
        const newProgress = prev + 100 / (HOLD_DURATION / 50)
        return Math.min(newProgress, 100)
      })
    }, 50)

    // Trigger emergency after hold duration
    timeoutRef.current = setTimeout(() => {
      triggerEmergency()
    }, HOLD_DURATION)
  }

  const endHold = () => {
    setIsPressed(false)
    setHoldProgress(0)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const triggerEmergency = () => {
    // Strong vibration for emergency trigger
    if ("vibrate" in navigator) {
      navigator.vibrate([500, 200, 500])
    }

    onEmergency()
    endHold()
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <div className="relative">
      <Button
        className={cn(
          "rounded-full bg-red-600 hover:bg-red-700 text-white font-bold touch-manipulation relative overflow-hidden",
          getSizeClasses(),
          isPressed && "scale-95",
          disabled && "opacity-50 cursor-not-allowed",
          className,
        )}
        onMouseDown={startHold}
        onMouseUp={endHold}
        onMouseLeave={endHold}
        onTouchStart={startHold}
        onTouchEnd={endHold}
        disabled={disabled}
      >
        {/* Progress ring */}
        {isPressed && (
          <div className="absolute inset-0 rounded-full">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="4" />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="white"
                strokeWidth="4"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - holdProgress / 100)}`}
                className="transition-all duration-75 ease-linear"
              />
            </svg>
          </div>
        )}

        {/* Button content */}
        <div className="relative z-10 flex flex-col items-center space-y-1">
          <AlertTriangle className={cn("animate-pulse", size === "xl" ? "h-10 w-10" : "h-8 w-8")} />
          <span>SOS</span>
        </div>

        {/* Ripple effect */}
        {!disabled && (
          <>
            <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-75"></div>
            <div className="absolute inset-0 rounded-full bg-red-500 animate-pulse opacity-50"></div>
          </>
        )}
      </Button>

      {/* Hold instruction */}
      {isPressed && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-center text-red-700 font-medium">
          Hold to activate
        </div>
      )}
    </div>
  )
}
