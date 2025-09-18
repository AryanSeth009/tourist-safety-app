import React from 'react'
import { Pressable, Text, ViewStyle, TextStyle } from 'react-native'

type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
type ButtonSize = 'sm' | 'default' | 'lg' | 'icon'

interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  onPress?: () => void
  children?: React.ReactNode
  style?: ViewStyle
  textStyle?: TextStyle
}

export default function Button({
  variant = 'default',
  size = 'default',
  disabled,
  onPress,
  children,
  style,
  textStyle,
}: ButtonProps) {
  const base: ViewStyle = {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingHorizontal: size === 'sm' ? 12 : size === 'lg' ? 24 : 16,
    height: size === 'sm' ? 36 : size === 'lg' ? 44 : 40,
    backgroundColor:
      variant === 'default' ? '#3b82f6' :
      variant === 'destructive' ? '#ef4444' :
      variant === 'secondary' ? '#e5e7eb' :
      'transparent',
    borderWidth: variant === 'outline' ? 1 : 0,
    borderColor: '#e5e7eb',
    opacity: disabled ? 0.6 : 1,
  }

  const baseText: TextStyle = {
    color: variant === 'outline' || variant === 'ghost' || variant === 'link' ? '#111827' : '#ffffff',
    fontSize: size === 'sm' ? 14 : size === 'lg' ? 16 : 15,
    fontWeight: '600',
  }

  return (
    <Pressable disabled={disabled} onPress={onPress} style={[base, style]}>
      <Text style={[baseText, textStyle]}>{children as any}</Text>
    </Pressable>
  )
}


