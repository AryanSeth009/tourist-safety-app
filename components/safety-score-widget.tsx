"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Shield, TrendingUp, TrendingDown } from "lucide-react"

interface SafetyScoreWidgetProps {
  score: number
  trend?: "up" | "down" | "stable"
  className?: string
}

export function SafetyScoreWidget({ score, trend = "stable", className = "" }: SafetyScoreWidgetProps) {
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score)
    }, 500)
    return () => clearTimeout(timer)
  }, [score])

  const getSafetyColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getSafetyBg = (score: number) => {
    if (score >= 80) return "from-green-500 to-emerald-500"
    if (score >= 60) return "from-yellow-500 to-orange-500"
    return "from-red-500 to-pink-500"
  }

  const getSafetyLabel = (score: number) => {
    if (score >= 80) return "Very Safe"
    if (score >= 60) return "Moderate"
    return "High Risk"
  }

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-600" />
      default:
        return <Shield className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <Card className={`glass border-white/20 ${className}`}>
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-lg flex items-center justify-center space-x-2">
          <Shield className="w-5 h-5" />
          <span>Safety Score</span>
        </CardTitle>
        <CardDescription className="flex items-center justify-center space-x-1">
          <span>Your current safety level</span>
          {getTrendIcon()}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="relative w-32 h-32">
          <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${getSafetyBg(score)} p-1`}>
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <span className={`text-3xl font-bold ${getSafetyColor(score)}`}>{animatedScore}</span>
            </div>
          </div>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${getSafetyColor(score)} bg-white shadow-sm`}>
              {getSafetyLabel(score)}
            </span>
          </div>
        </div>
        <div className="w-full space-y-2">
          <Progress value={animatedScore} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>High Risk</span>
            <span>Very Safe</span>
          </div>
        </div>

        {/* Safety Factors */}
        <div className="w-full grid grid-cols-3 gap-2 text-center">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Crime</div>
            <div className="text-sm font-medium text-green-600">Low</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Traffic</div>
            <div className="text-sm font-medium text-orange-700">Medium</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Weather</div>
            <div className="text-sm font-medium text-green-600">Good</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
