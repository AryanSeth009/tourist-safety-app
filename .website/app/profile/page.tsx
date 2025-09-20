"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  User,
  ArrowLeft,
  Shield,
  Phone,
  Globe,
  Bell,
  Eye,
  Volume2,
  Smartphone,
  QrCode,
  Edit,
  Plus,
  Trash2,
  Download,
  Share2,
  Settings,
  Accessibility,
  Moon,
  Sun,
} from "lucide-react"
import Link from "next/link"

interface EmergencyContact {
  id: string
  name: string
  phone: string
  relationship: string
  isPrimary: boolean
}

interface TouristProfile {
  id: string
  name: string
  email: string
  phone: string
  nationality: string
  passportId: string
  emergencyContacts: EmergencyContact[]
  preferences: {
    language: string
    notifications: boolean
    locationTracking: boolean
    emergencySharing: boolean
    darkMode: boolean
    fontSize: "small" | "medium" | "large"
    highContrast: boolean
  }
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<TouristProfile>({
    id: "TID-2024-001234",
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    phone: "+1-555-0123",
    nationality: "United States",
    passportId: "US123456789",
    emergencyContacts: [
      { id: "1", name: "John Smith", phone: "+1-555-0456", relationship: "Spouse", isPrimary: true },
      { id: "2", name: "Emergency Services", phone: "911", relationship: "Emergency", isPrimary: false },
      { id: "3", name: "Sarah Johnson", phone: "+1-555-0789", relationship: "Sister", isPrimary: false },
    ],
    preferences: {
      language: "en",
      notifications: true,
      locationTracking: true,
      emergencySharing: true,
      darkMode: false,
      fontSize: "medium",
      highContrast: false,
    },
  })
  const [darkMode, setDarkMode] = useState(profile.preferences.darkMode)

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "it", name: "Italiano", flag: "🇮🇹" },
    { code: "pt", name: "Português", flag: "🇵🇹" },
    { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
  ]

  const updatePreference = (key: keyof typeof profile.preferences, value: any) => {
    setProfile((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value,
      },
    }))

    if (key === "darkMode") {
      setDarkMode(value)
      document.documentElement.classList.toggle("dark", value)
    }
  }

  const addEmergencyContact = () => {
    const newContact: EmergencyContact = {
      id: Date.now().toString(),
      name: "",
      phone: "",
      relationship: "Friend",
      isPrimary: false,
    }
    setProfile((prev) => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, newContact],
    }))
  }

  const removeEmergencyContact = (id: string) => {
    setProfile((prev) => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter((contact) => contact.id !== id),
    }))
  }

  const generateQRCode = () => {
    const qrData = {
      id: profile.id,
      name: profile.name,
      nationality: profile.nationality,
      emergency: profile.emergencyContacts.find((c) => c.isPrimary)?.phone,
    }
    return `data:text/plain;base64,${btoa(JSON.stringify(qrData))}`
  }

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
              <h1 className="font-semibold text-lg">Profile & Settings</h1>
              <p className="text-sm text-muted-foreground">Manage your digital tourist ID</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => updatePreference("darkMode", !darkMode)}>
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)}>
              <Edit className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 p-4 space-y-6 pb-24">
        <Card className="glass border-white/20 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <span>Digital Tourist ID</span>
            </CardTitle>
            <CardDescription>Your verified travel identification</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-primary font-[family-name:var(--font-playfair)]">
                    {profile.name}
                  </h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>ID: {profile.id}</p>
                    <p>Nationality: {profile.nationality}</p>
                    <p>Passport: {profile.passportId}</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                    <QrCode className="h-12 w-12 text-gray-600" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">QR Code</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/20">
                <Badge variant="outline" className="bg-green-100 text-green-700">
                  ✓ Verified
                </Badge>
                <div className="text-xs text-muted-foreground">Expires: Dec 31, 2024</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" size="sm" className="bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm" className="bg-transparent">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Personal Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={profile.name} disabled={!isEditing} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={profile.email} disabled={!isEditing} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" value={profile.phone} disabled={!isEditing} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality</Label>
                <Input id="nationality" value={profile.nationality} disabled={!isEditing} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <span>Emergency Contacts</span>
              </div>
              <Button variant="outline" size="sm" onClick={addEmergencyContact} className="bg-transparent">
                <Plus className="h-4 w-4" />
              </Button>
            </CardTitle>
            <CardDescription>People to contact in case of emergency</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {profile.emergencyContacts.map((contact) => (
              <div key={contact.id} className="p-3 bg-white/50 rounded-lg border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Phone className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{contact.name}</p>
                      <p className="text-xs text-muted-foreground">{contact.relationship}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {contact.isPrimary && (
                      <Badge variant="outline" className="text-xs">
                        Primary
                      </Badge>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => removeEmergencyContact(contact.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Name" value={contact.name} disabled={!isEditing} className="text-sm" />
                  <Input placeholder="Phone" value={contact.phone} disabled={!isEditing} className="text-sm" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>Language & Accessibility</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select
                value={profile.preferences.language}
                onValueChange={(value) => updatePreference("language", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <div className="flex items-center space-x-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Moon className="h-4 w-4" />
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                </div>
                <Switch
                  id="dark-mode"
                  checked={profile.preferences.darkMode}
                  onCheckedChange={(value) => updatePreference("darkMode", value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Accessibility className="h-4 w-4" />
                  <Label htmlFor="high-contrast">High Contrast Mode</Label>
                </div>
                <Switch
                  id="high-contrast"
                  checked={profile.preferences.highContrast}
                  onCheckedChange={(value) => updatePreference("highContrast", value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="font-size">Font Size</Label>
                <Select
                  value={profile.preferences.fontSize}
                  onValueChange={(value) => updatePreference("fontSize", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Privacy & Security</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4" />
                <Label htmlFor="notifications">Push Notifications</Label>
              </div>
              <Switch
                id="notifications"
                checked={profile.preferences.notifications}
                onCheckedChange={(value) => updatePreference("notifications", value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <Label htmlFor="location-tracking">Location Tracking</Label>
              </div>
              <Switch
                id="location-tracking"
                checked={profile.preferences.locationTracking}
                onCheckedChange={(value) => updatePreference("locationTracking", value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Share2 className="h-4 w-4" />
                <Label htmlFor="emergency-sharing">Emergency Location Sharing</Label>
              </div>
              <Switch
                id="emergency-sharing"
                checked={profile.preferences.emergencySharing}
                onCheckedChange={(value) => updatePreference("emergencySharing", value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>App Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-16 glass border-white/20 bg-transparent">
                <div className="flex flex-col items-center space-y-1">
                  <Volume2 className="h-5 w-5" />
                  <span className="text-sm">Sound Settings</span>
                </div>
              </Button>
              <Button variant="outline" className="h-16 glass border-white/20 bg-transparent">
                <div className="flex flex-col items-center space-y-1">
                  <Smartphone className="h-5 w-5" />
                  <span className="text-sm">Device Settings</span>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-white/20">
          <CardContent className="p-4 space-y-3">
            <Button variant="outline" className="w-full bg-transparent">
              Export My Data
            </Button>
            <Button variant="outline" className="w-full bg-transparent">
              Delete Account
            </Button>
            <Button variant="outline" className="w-full bg-transparent" asChild>
              <Link href="/">Sign Out</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
