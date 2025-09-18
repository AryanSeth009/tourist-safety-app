import React, { useEffect, useRef, useState } from 'react'
import { View, Text } from 'react-native'
import Button from './ui/Button'
import { AlertTriangle } from 'lucide-react-native'
import * as Haptics from 'expo-haptics'

interface PanicButtonProps {
  onEmergency: () => void
  disabled?: boolean
}

export default function PanicButton({ onEmergency, disabled }: PanicButtonProps) {
  const [isPressed, setIsPressed] = useState(false)
  const [holdProgress, setHoldProgress] = useState(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const HOLD_DURATION = 3000

  const startHold = () => {
    if (disabled) return
    setIsPressed(true)
    setHoldProgress(0)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    intervalRef.current = setInterval(() => {
      setHoldProgress(prev => Math.min(prev + 100 / (HOLD_DURATION / 50), 100))
    }, 50)
    timeoutRef.current = setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      onEmergency()
      endHold()
    }, HOLD_DURATION)
  }

  const endHold = () => {
    setIsPressed(false)
    setHoldProgress(0)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <View style={{ position: 'relative', alignItems: 'center' }}>
      <Button
        onPressIn={startHold as any}
        onPressOut={endHold as any}
        style={{
          width: 96,
          height: 96,
          borderRadius: 9999,
          backgroundColor: '#dc2626',
        }}
        textStyle={{ color: 'white' }}
      >
        SOS
      </Button>
      {isPressed && (
        <Text style={{ position: 'absolute', bottom: -20, fontSize: 12, color: '#991b1b' }}>
          Hold to activate {Math.round(holdProgress)}%
        </Text>
      )}
      <AlertTriangle size={0} color="transparent" />
    </View>
  )
}


