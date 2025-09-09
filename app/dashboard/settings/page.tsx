"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { 
  Settings, 
  Shield, 
  Bell, 
  Database, 
  Mail, 
  Globe, 
  Lock, 
  Save, 
  RefreshCw,
  AlertTriangle,
  Info
} from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"
import { useToast } from "@/hooks/use-toast"
import { TokenManager } from "@/lib/tokenManager"

interface SystemSettings {
  // System Configuration
  systemName: string
  systemVersion: string
  maintenanceMode: boolean
  debugMode: boolean
  
  // Email Configuration
  emailEnabled: boolean
  smtpHost: string
  smtpPort: string
  smtpUsername: string
  smtpSecurity: string
  
  // Notification Settings
  notificationsEnabled: boolean
  emailNotifications: boolean
  smsNotifications: boolean
  
  // Security Settings
  sessionTimeout: string
  passwordPolicy: string
  twoFactorAuth: boolean
  
  // Backup Settings
  autoBackup: boolean
  backupFrequency: string
  backupRetention: string
}

interface FormErrors {
  [key: string]: string
}

export default function SuperAdminSettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  
  const [settings, setSettings] = useState<SystemSettings>({
    // System Configuration
    systemName: "Marshalats Learning Management System",
    systemVersion: "1.0.0",
    maintenanceMode: false,
    debugMode: false,
    
    // Email Configuration
    emailEnabled: true,
    smtpHost: "",
    smtpPort: "587",
    smtpUsername: "",
    smtpSecurity: "tls",
    
    // Notification Settings
    notificationsEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    
    // Security Settings
    sessionTimeout: "24",
    passwordPolicy: "medium",
    twoFactorAuth: false,
    
    // Backup Settings
    autoBackup: true,
    backupFrequency: "daily",
    backupRetention: "30"
  })

  useEffect(() => {
    // Check authentication
    if (!TokenManager.isAuthenticated()) {
      router.push("/superadmin/login")
      return
    }

    // Check if user is superadmin
    const user = TokenManager.getUser()
    if (!user || user.role !== "superadmin") {
      router.push("/superadmin/login")
      return
    }
    
    // Load settings (mock data for now)
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In a real implementation, this would fetch from an API endpoint
      // For now, we'll use the default settings
      setLoading(false)
    } catch (error) {
      console.error("Error loading settings:", error)
      toast({
        title: "Error",
        description: "Failed to load system settings",
        variant: "destructive"
      })
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!settings.systemName.trim()) {
      newErrors.systemName = "System name is required"
    }

    if (settings.emailEnabled) {
      if (!settings.smtpHost.trim()) {
        newErrors.smtpHost = "SMTP host is required when email is enabled"
      }
      if (!settings.smtpPort.trim()) {
        newErrors.smtpPort = "SMTP port is required when email is enabled"
      } else if (!/^\d+$/.test(settings.smtpPort)) {
        newErrors.smtpPort = "SMTP port must be a number"
      }
    }

    if (!settings.sessionTimeout.trim()) {
      newErrors.sessionTimeout = "Session timeout is required"
    } else if (!/^\d+$/.test(settings.sessionTimeout)) {
      newErrors.sessionTimeout = "Session timeout must be a number"
    }

    if (!settings.backupRetention.trim()) {
      newErrors.backupRetention = "Backup retention is required"
    } else if (!/^\d+$/.test(settings.backupRetention)) {
      newErrors.backupRetention = "Backup retention must be a number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real implementation, this would save to an API endpoint
      toast({
        title: "Settings Saved",
        description: "System settings have been updated successfully",
        variant: "default"
      })
      
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "Failed to save system settings",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    // Reset to default values
    setSettings({
      systemName: "Marshalats Learning Management System",
      systemVersion: "1.0.0",
      maintenanceMode: false,
      debugMode: false,
      emailEnabled: true,
      smtpHost: "",
      smtpPort: "587",
      smtpUsername: "",
      smtpSecurity: "tls",
      notificationsEnabled: true,
      emailNotifications: true,
      smsNotifications: false,
      sessionTimeout: "24",
      passwordPolicy: "medium",
      twoFactorAuth: false,
      autoBackup: true,
      backupFrequency: "daily",
      backupRetention: "30"
    })
    setErrors({})
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values",
      variant: "default"
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader currentPage="Settings" />
        <main className="w-full p-4 lg:p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading settings...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader currentPage="Settings" />
      
      <main className="w-full p-4 lg:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
              <p className="text-gray-600">Configure system-wide settings and preferences</p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleReset}
                variant="outline"
                disabled={isSubmitting}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset to Defaults
              </Button>
              <Button 
                onClick={handleSave}
                disabled={isSubmitting}
                className="bg-yellow-400 hover:bg-yellow-500 text-black"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </div>

          {/* System Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                System Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="systemName" className="text-sm font-medium text-gray-700">
                    System Name *
                  </Label>
                  <Input
                    id="systemName"
                    value={settings.systemName}
                    onChange={(e) => handleInputChange("systemName", e.target.value)}
                    className={errors.systemName ? "border-red-500" : ""}
                    placeholder="Enter system name"
                  />
                  {errors.systemName && (
                    <p className="mt-1 text-sm text-red-600">{errors.systemName}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="systemVersion" className="text-sm font-medium text-gray-700">
                    System Version
                  </Label>
                  <Input
                    id="systemVersion"
                    value={settings.systemVersion}
                    onChange={(e) => handleInputChange("systemVersion", e.target.value)}
                    placeholder="Enter system version"
                    disabled
                  />
                  <p className="mt-1 text-xs text-gray-500">Version is automatically managed</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium text-gray-700">Maintenance Mode</Label>
                    <p className="text-xs text-gray-500">
                      Enable to prevent user access during system updates
                    </p>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => handleInputChange("maintenanceMode", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium text-gray-700">Debug Mode</Label>
                    <p className="text-xs text-gray-500">
                      Enable detailed logging for troubleshooting
                    </p>
                  </div>
                  <Switch
                    checked={settings.debugMode}
                    onCheckedChange={(checked) => handleInputChange("debugMode", checked)}
                  />
                </div>
              </div>

              {settings.maintenanceMode && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800">Maintenance Mode Active</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        The system is currently in maintenance mode. Users will see a maintenance page.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sessionTimeout" className="text-sm font-medium text-gray-700">
                    Session Timeout (hours) *
                  </Label>
                  <Input
                    id="sessionTimeout"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleInputChange("sessionTimeout", e.target.value)}
                    className={errors.sessionTimeout ? "border-red-500" : ""}
                    placeholder="24"
                  />
                  {errors.sessionTimeout && (
                    <p className="mt-1 text-sm text-red-600">{errors.sessionTimeout}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="passwordPolicy" className="text-sm font-medium text-gray-700">
                    Password Policy
                  </Label>
                  <Select
                    value={settings.passwordPolicy}
                    onValueChange={(value) => handleInputChange("passwordPolicy", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select password policy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weak">Weak (6+ characters)</SelectItem>
                      <SelectItem value="medium">Medium (8+ chars, mixed case)</SelectItem>
                      <SelectItem value="strong">Strong (12+ chars, symbols)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium text-gray-700">Two-Factor Authentication</Label>
                  <p className="text-xs text-gray-500">
                    Require 2FA for all superadmin accounts
                  </p>
                </div>
                <Switch
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => handleInputChange("twoFactorAuth", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium text-gray-700">Enable Notifications</Label>
                  <p className="text-xs text-gray-500">
                    Allow the system to send notifications
                  </p>
                </div>
                <Switch
                  checked={settings.notificationsEnabled}
                  onCheckedChange={(checked) => handleInputChange("notificationsEnabled", checked)}
                />
              </div>

              {settings.notificationsEnabled && (
                <>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium text-gray-700">Email Notifications</Label>
                        <p className="text-xs text-gray-500">Send notifications via email</p>
                      </div>
                      <Switch
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked) => handleInputChange("emailNotifications", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium text-gray-700">SMS Notifications</Label>
                        <p className="text-xs text-gray-500">Send notifications via SMS</p>
                      </div>
                      <Switch
                        checked={settings.smsNotifications}
                        onCheckedChange={(checked) => handleInputChange("smsNotifications", checked)}
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
