"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Calendar,
  Copy,
  Download,
  ExternalLink,
  Globe,
  LayoutDashboard,
  Lock,
  MapPin,
  Pause,
  Play,
  Settings,
  Shield,
  Smartphone,
  Terminal,
  UserCheck,
  Zap,
  Link,
  Siren,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { getProjectById, updateProject } from "@/lib/project-storage"
import { Checkbox } from "@/components/ui/checkbox"

import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Define all available security features and their display names
const ALL_SECURITY_FEATURES = {
  deviceDeduplication: {
    name: "Device Deduplication",
    description: "Blocks multiple attempts from the same browser on a device",
    color: "bg-blue-500",
  },
  ipDeduplication: {
    name: "IP Deduplication",
    description: "Blocks multiple attempts from the same IP address",
    color: "bg-purple-500",
  },
  automationDetection: {
    name: "Automation Detection",
    description: "Blocks entrants using automated technology, such as bots and survey farms",
    color: "bg-green-500",
  },
  trustedBrowsers: {
    name: "Trusted Browsers & OS",
    description: "Restricts participation to trusted browsers and operating systems",
    color: "bg-cyan-500",
  },
  audienceValidation: {
    name: "Audience Validation",
    description: "Validates that entrants qualify as the target audience",
    color: "bg-pink-500",
  },
  aiDetection: {
    name: "AI Detection",
    description: "Detects AI use by presenting entrants with randomized questions",
    color: "bg-indigo-500",
  },
  locationLock: {
    name: "Location Lock",
    description: "Blocks entrants not located in specified countries",
    color: "bg-yellow-500",
  },
  locationValidation: {
    name: "Location Validation",
    description: "Validates entrants who appear to be spoofing their location",
    color: "bg-orange-500",
  },
  suspiciousUsers: {
    name: "Suspicious Users",
    description: "Blocks participants who display unusual behaviors that may indicate potential risk",
    color: "bg-red-500",
  },
  duplicateId: {
    name: "Duplicate ID",
    description: "Blocks multiple attempts from the same supplier participant ID",
    color: "bg-emerald-500",
  },
}

export default function LinkProtectorDetails({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isActive, setIsActive] = useState(true)
  const [securityFeatures, setSecurityFeatures] = useState({
    deviceDeduplication: true,
    ipDeduplication: true,
    automationDetection: true,
    trustedBrowsers: false,
    audienceValidation: false,
    aiDetection: false,
    locationLock: true,
    locationValidation: true,
    suspiciousUsers: true,
    duplicateId: true,
  })
  const [enableAll, setEnableAll] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  // Add a new state for selected countries at the top of the component with other state declarations
  const [selectedCountries, setSelectedCountries] = useState<string[]>(["United States", "Canada", "United Kingdom"])
  const [suspiciousSignals, setSuspiciousSignals] = useState({
    vpnDetection: true,
    torExitNodeDetection: true,
    deviceTamperingDetection: false,
    publicProxyDetection: false,
    virtualMachineDetection: false,
    highActivityDeviceDetection: false,
    devToolsDetection: false,
    incognitoModeDetection: true,
    privacyFocusedSettings: false,
  })

  // Updated variable names for the first feature
  const [enableDtectRedirects, setEnableDtectRedirects] = useState(false)
  const [completeUrl, setCompleteUrl] = useState("")

  // Add these new state variables after the other state declarations
  const [customPausedLinkEnabled, setCustomPausedLinkEnabled] = useState(false)
  const [customPausedLinkUrl, setCustomPausedLinkUrl] = useState("")
  const [disableTermination, setDisableTermination] = useState(false)
  const [showDisableTerminationDialog, setShowDisableTerminationDialog] = useState(false)

  const [surveyLinkValue, setSurveyLinkValue] = useState("")
  const [terminationLinkValue, setTerminationLinkValue] = useState("")
  const [surveyLinkError, setSurveyLinkError] = useState("")
  const surveyLinkRef = useRef<HTMLInputElement>(null)

  // Fetch project from localStorage
  useEffect(() => {
    if (params.id) {
      // Don't try to load a project if we're on the create route
      if (params.id === "create") {
        setLoading(false)
        return
      }

      const projectData = getProjectById(params.id as string)

      if (projectData) {
        // Generate feature usage data for enabled features
        const enabledFeatures = Object.entries(projectData.securityFeatures)
          .filter(([_, enabled]) => enabled)
          .map(([key]) => key)

        // Generate random percentages for enabled features that sum to 100
        const totalFeatures = enabledFeatures.length
        let remainingPercentage = 100
        const featureUsage = enabledFeatures.map((feature, index) => {
          // For the last feature, use the remaining percentage
          if (index === totalFeatures - 1) {
            return {
              name: feature,
              percentage: remainingPercentage,
            }
          }

          // For other features, generate a random percentage
          const maxPercentage = Math.floor((remainingPercentage / (totalFeatures - index)) * 1.5)
          const minPercentage = Math.max(5, Math.floor((remainingPercentage / (totalFeatures - index)) * 0.5))
          const percentage = Math.floor(Math.random() * (maxPercentage - minPercentage + 1)) + minPercentage
          remainingPercentage -= percentage

          return {
            name: feature,
            percentage,
          }
        })

        // If no features are enabled, add a default "Other" category
        if (featureUsage.length === 0) {
          featureUsage.push({ name: "other", percentage: 100 })
        }

        setProject({
          ...projectData,
          securityLink:
            projectData.securityLink ||
            `https://participation.dtect.io?uref=17313db1-800f-4de4-9db0-e61610a1246b&id=${projectData.id}`,
          surveyLink: projectData.surveyLink || projectData.protectedLink,
          terminationLink:
            projectData.terminationLink ||
            `https://participation.dtect.io/test-supplier?status=security_terminate&id=${projectData.id}`,
          featureUsage: featureUsage,
        })

        setIsActive(projectData.status === "active")
        if (projectData.securityFeatures) {
          setSecurityFeatures(projectData.securityFeatures)

          // Check if all features are enabled
          const allEnabled = Object.values(projectData.securityFeatures).every((value) => value === true)
          setEnableAll(allEnabled)
        }

        // Inside the useEffect, after setting other state variables from projectData:
        if (projectData.advancedOptions) {
          // Update to use the new variable names
          setEnableDtectRedirects(projectData.advancedOptions.enableDtectRedirects || false)
          setCompleteUrl(projectData.advancedOptions.completeUrl || "")
          setCustomPausedLinkEnabled(projectData.advancedOptions.customPausedLinkEnabled || false)
          setCustomPausedLinkUrl(projectData.advancedOptions.customPausedLinkUrl || "")
          setDisableTermination(projectData.advancedOptions.disableTermination || false)
        }
      }

      setLoading(false)
    }
  }, [params.id])

  // Set link values after project loads
  useEffect(() => {
    if (project) {
      setSurveyLinkValue(project.surveyLink || "")
      setTerminationLinkValue(project.terminationLink || "")
    }
  }, [project])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-xl font-bold">Loading link protector details...</h1>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Link Protector not found</h1>
        <Button onClick={() => router.push("/link-protectors")} className="mt-4">
          Back to Link Protectors
        </Button>
      </div>
    )
  }

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link)
    toast({
      title: "Link copied to clipboard",
      description: "The link has been copied to your clipboard.",
    })
  }

  const handleOpenLink = (link: string) => {
    // Replace PARTICIPANT_ID_HERE with a random UUID
    const linkWithRandomId = link.replace("PARTICIPANT_ID_HERE", crypto.randomUUID())
    // Open the link in a new tab
    window.open(linkWithRandomId, "_blank")

    toast({
      title: "Link opened with random ID",
      description: "The link has been opened in a new tab with a random participant ID.",
    })
  }

  const handleToggleAll = (checked: boolean) => {
    setEnableAll(checked)
    setSecurityFeatures({
      deviceDeduplication: checked,
      ipDeduplication: checked,
      automationDetection: checked,
      trustedBrowsers: checked,
      audienceValidation: checked,
      aiDetection: checked,
      locationLock: checked,
      locationValidation: checked,
      suspiciousUsers: checked,
      duplicateId: checked,
    })
    setHasChanges(true)
  }

  const handleToggleFeature = (feature: keyof typeof securityFeatures, checked: boolean) => {
    setSecurityFeatures((prev) => ({
      ...prev,
      [feature]: checked,
    }))
    setHasChanges(true)

    // Check if all features are enabled
    const allEnabled = Object.keys(securityFeatures).every((key) =>
      key === feature ? checked : securityFeatures[key as keyof typeof securityFeatures],
    )
    setEnableAll(allEnabled)
  }

  const handleToggleActive = () => {
    const newStatus = !isActive
    setIsActive(newStatus)

    // Update project in localStorage
    if (project) {
      const updatedProject = {
        ...project,
        status: newStatus ? "active" : "paused",
      }
      updateProject(updatedProject)
      setProject(updatedProject)

      toast({
        title: newStatus ? "Link Protector activated" : "Link Protector paused",
        description: `The link protector has been ${newStatus ? "activated" : "paused"} successfully.`,
      })
    }
  }

  const handleSaveChanges = () => {
    // Update security features in localStorage
    if (project) {
      // Generate updated feature usage data for enabled features
      const enabledFeatures = Object.entries(securityFeatures)
        .filter(([_, enabled]) => enabled)
        .map(([key]) => key)

      // Generate random percentages for enabled features that sum to 100
      const totalFeatures = enabledFeatures.length
      let remainingPercentage = 100
      const featureUsage = enabledFeatures.map((feature, index) => {
        // For the last feature, use the remaining percentage
        if (index === totalFeatures - 1) {
          return {
            name: feature,
            percentage: remainingPercentage,
          }
        }

        // For other features, generate a random percentage
        const maxPercentage = Math.floor((remainingPercentage / (totalFeatures - index)) * 1.5)
        const minPercentage = Math.max(5, Math.floor((remainingPercentage / (totalFeatures - index)) * 0.5))
        const percentage = Math.floor(Math.random() * (maxPercentage - minPercentage + 1)) + minPercentage
        remainingPercentage -= percentage

        return {
          name: feature,
          percentage,
        }
      })

      // If no features are enabled, add a default "Other" category
      if (featureUsage.length === 0) {
        featureUsage.push({ name: "other", percentage: 100 })
      }

      const updatedProject = {
        ...project,
        securityFeatures,
        featureUsage,
        suspiciousSignals, // Add this line
      }
      updateProject(updatedProject)
      setProject(updatedProject)
    }

    toast({
      title: "Security settings saved",
      description: "Your security settings have been updated successfully.",
    })
    setHasChanges(false)
  }

  const handleUpdateSurveyLink = () => {
    // Reset error state
    setSurveyLinkError("")

    // No need to validate {dtect.id} anymore since we've changed the feature

    if (project) {
      const updatedProject = {
        ...project,
        surveyLink: surveyLinkValue,
      }
      updateProject(updatedProject)
      setProject(updatedProject)
    }

    toast({
      title: "Protected Link updated",
      description: "Your protected link has been updated successfully.",
    })
  }

  const handleUpdateTerminationLink = () => {
    if (project) {
      const updatedProject = {
        ...project,
        terminationLink: terminationLinkValue,
      }
      updateProject(updatedProject)
      setProject(updatedProject)
    }

    toast({
      title: "Termination Link updated",
      description: "Your termination link has been updated successfully.",
    })
  }

  const handleDisableTerminationToggle = (checked: boolean) => {
    if (checked) {
      setShowDisableTerminationDialog(true)
    } else {
      setDisableTermination(false)
      if (project) {
        const updatedProject = {
          ...project,
          advancedOptions: {
            ...(project.advancedOptions || {}),
            disableTermination: false,
          },
        }
        updateProject(updatedProject)
        setProject(updatedProject)
      }
    }
  }

  const confirmDisableTermination = () => {
    setDisableTermination(true)
    setShowDisableTerminationDialog(false)
    if (project) {
      const updatedProject = {
        ...project,
        advancedOptions: {
          ...(project.advancedOptions || {}),
          disableTermination: true,
        },
      }
      updateProject(updatedProject)
      setProject(updatedProject)
    }
    toast({
      title: "Termination Disabled",
      description: "All participants will now be allowed through, regardless of security checks.",
      variant: "destructive",
    })
  }

  // Calculate feature usage percentages for display
  const getFeatureUsagePercentage = (featureName: string) => {
    if (!project.featureUsage) return 0
    const feature = project.featureUsage.find((f: any) => f.name === featureName)
    return feature ? feature.percentage : 0
  }

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r bg-gray-50">
        <div className="p-4 border-b">
          <Button variant="ghost" size="sm" className="gap-1 mb-2" onClick={() => router.push("/link-protectors")}>
            <ArrowLeft className="h-4 w-4" />
            Back to Link Protectors
          </Button>
          <h1 className="text-xl font-bold truncate">{project.name}</h1>

          {/* Security Link in Sidebar */}
          <div className="mt-3 p-2 bg-white border rounded-md">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                <Shield className="h-3.5 w-3.5 text-blue-500" />
                <span className="text-xs font-medium">Entry Link</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => handleCopyLink(project.securityLink)}
                title="Copy link"
              >
                <Copy className="h-3 w-3" />
                <span className="sr-only">Copy security link</span>
              </Button>
            </div>
            <p className="text-xs text-gray-500 truncate" title={project.securityLink}>
              {project.securityLink}
            </p>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <Button
              variant={isActive ? "outline" : "default"}
              size="sm"
              className={`w-full ${isActive ? "" : "bg-black text-white hover:bg-gray-800"}`}
              onClick={handleToggleActive}
            >
              {isActive ? (
                <>
                  <Pause className="h-3.5 w-3.5 mr-1" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 mr-1" />
                  Resume
                </>
              )}
            </Button>
          </div>
        </div>

        <nav className="p-2">
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className={`w-full justify-start ${activeTab === "overview" ? "bg-gray-200" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Overview
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`w-full justify-start ${activeTab === "links" ? "bg-gray-200" : ""}`}
              onClick={() => setActiveTab("links")}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Links
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`w-full justify-start ${activeTab === "security" ? "bg-gray-200" : ""}`}
              onClick={() => setActiveTab("security")}
            >
              <Lock className="h-4 w-4 mr-2" />
              Security
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`w-full justify-start ${activeTab === "settings" ? "bg-gray-200" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </nav>

        <div className="p-4 mt-auto border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Last Participant:</span>
            <span>{project.lastActive}</span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Overview</h2>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Mar 01, 2025 - Mar 31, 2025</span>
                  </Button>
                  <Button variant="default" className="flex items-center gap-2 bg-black text-white hover:bg-gray-800">
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center">
                      <div className="text-sm text-gray-500 mb-1">Total Participants</div>
                      <div className="text-3xl font-bold">{project.totalParticipants.toLocaleString()}</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center">
                      <div className="text-sm text-gray-500 mb-1">Participants Blocked</div>
                      <div className="text-3xl font-bold">{project.trafficBlocked.toLocaleString()}</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center">
                      <div className="text-sm text-gray-500 mb-1">Block Rate</div>
                      <div className="text-3xl font-bold">
                        {project.totalParticipants > 0
                          ? ((project.trafficBlocked / project.totalParticipants) * 100).toFixed(1)
                          : "0.0"}
                        %
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Traffic Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>
                      {project.totalParticipants > 0
                        ? ((project.trafficBlocked / project.totalParticipants) * 100).toFixed(1)
                        : "0.0"}
                      % blocked
                    </span>
                    <span>{project.totalParticipants.toLocaleString()} participants</span>
                  </div>
                  {/* Custom progress bar implementation */}
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-600"
                      style={{
                        width: `${
                          project.totalParticipants > 0 ? (project.trafficBlocked / project.totalParticipants) * 100 : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Blocked: {project.trafficBlocked.toLocaleString()}</span>
                    <span>Allowed: {(project.totalParticipants - project.trafficBlocked).toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-medium">Security Features</CardTitle>
                      <p className="text-sm text-gray-500 mt-1 mb-2">
                        Participants flagged by each security feature. One participant can be flagged on multiple
                        security features
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => setActiveTab("security")}
                    >
                      <Settings className="h-3.5 w-3.5" />
                      Update Security
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First column of features */}
                    <div className="space-y-4">
                      {Object.entries(ALL_SECURITY_FEATURES)
                        .slice(0, Math.ceil(Object.keys(ALL_SECURITY_FEATURES).length / 2))
                        .map(([key, feature]) => {
                          const isEnabled = securityFeatures[key as keyof typeof securityFeatures]
                          // Calculate raw numbers instead of percentages
                          const rawCount = isEnabled
                            ? Math.round((getFeatureUsagePercentage(key) / 100) * project.trafficBlocked)
                            : 0

                          return (
                            <div key={key} className="space-y-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`h-3 w-3 rounded-full ${isEnabled ? "bg-green-500" : "bg-gray-200"}`}
                                  ></div>
                                  <span className={`text-sm ${!isEnabled ? "text-gray-400" : ""}`}>{feature.name}</span>
                                </div>
                                <span className={`text-sm font-medium ${!isEnabled ? "text-gray-400" : ""}`}>
                                  {rawCount.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          )
                        })}
                    </div>

                    {/* Second column of features */}
                    <div className="space-y-4">
                      {Object.entries(ALL_SECURITY_FEATURES)
                        .slice(Math.ceil(Object.keys(ALL_SECURITY_FEATURES).length / 2))
                        .map(([key, feature]) => {
                          const isEnabled = securityFeatures[key as keyof typeof securityFeatures]
                          // Calculate raw numbers instead of percentages
                          const rawCount = isEnabled
                            ? Math.round((getFeatureUsagePercentage(key) / 100) * project.trafficBlocked)
                            : 0

                          return (
                            <div key={key} className="space-y-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`h-3 w-3 rounded-full ${isEnabled ? "bg-green-500" : "bg-gray-200"}`}
                                  ></div>
                                  <span className={`text-sm ${!isEnabled ? "text-gray-400" : ""}`}>{feature.name}</span>
                                </div>
                                <span className={`text-sm font-medium ${!isEnabled ? "text-gray-400" : ""}`}>
                                  {rawCount.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Links Tab */}
          {activeTab === "links" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Link Protector Links</h2>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-medium">Integration Links</CardTitle>
                      <p className="text-sm text-gray-500">Use these links to integrate with your link protector</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => setActiveTab("settings")}
                    >
                      <Settings className="h-3.5 w-3.5" />
                      Edit Links
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 p-3 border-b flex items-center justify-between">
                        <div className="flex-col">
                          <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 flex-shrink-0 text-blue-500" />
                            <span className="font-medium">Entry Link</span>
                          </div>

                          <p className="text-gray-500 text-sm">
                            Send this link to participants to go through our security checks.
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleCopyLink(project.securityLink)}
                            title="Copy link"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleOpenLink(project.securityLink)}
                            title="Open with random ID"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-3 text-sm break-all">{project.securityLink}</div>
                    </div>

                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 p-3 border-b flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex-col">
                            <div className="flex items-center gap-2">
                              <UserCheck className="h-5 w-5 flex-shrink-0 text-green-500" />
                              <span className="font-medium">Protected Link</span>
                            </div>

                            <p className="text-gray-500 text-sm"> Where participants are redirected if they qualify.</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleCopyLink(project.surveyLink)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="p-3 text-sm break-all">{project.surveyLink}</div>
                    </div>

                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 p-3 border-b flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex-col">
                            <div className="flex items-center gap-2">
                              <Terminal className="h-5 w-5 flex-shrink-0 text-red-500" />
                              <span className="font-medium">Termination Link</span>
                            </div>

                            <p className="text-gray-500 text-sm">
                              {" "}
                              Where participants are redirected if they don't qualify.
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleCopyLink(project.terminationLink)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="p-3 text-sm break-all">{project.terminationLink}</div>
                    </div>

                    {/* Paused Link - only visible when Custom Link for Paused Traffic is enabled */}
                    {customPausedLinkEnabled && (
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 p-3 border-b flex items-center justify-between">
                          <div className="flex-col">
                            <div className="flex items-center gap-2">
                              <Clock className="h-5 w-5 flex-shrink-0 text-orange-500" />
                              <span className="font-medium">Paused Link</span>
                            </div>
                            <p className="text-gray-500 text-sm">
                              Where participants are redirected when traffic is paused or they return as 'Over Quota'.
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleCopyLink(customPausedLinkUrl)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="p-3 text-sm break-all">{customPausedLinkUrl}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Redirects to dtect section - only visible when Survey redirects to dtect is enabled */}
              {enableDtectRedirects && (
                <Card className="mt-6">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg font-medium">Redirects to dtect</CardTitle>
                        <p className="text-sm text-gray-500">
                          Add these dtect redirect links to your survey setup to assign a status to each participant
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 gap-6">
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 p-3 border-b flex items-center justify-between">
                          <div className="flex-col">
                            <div className="flex items-center gap-2">
                              <UserCheck className="h-5 w-5 flex-shrink-0 text-green-500" />
                              <span className="font-medium">Complete</span>
                            </div>
                            <p className="text-gray-500 text-sm">
                              Use this link to redirect participants who complete your survey
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() =>
                              handleCopyLink(`https://participation.dtect.io/redirect?status=complete&id={dtect.id}`)
                            }
                            title="Copy link"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="p-3 text-sm break-all">
                          https://participation.dtect.io/redirect?status=complete&id={"{dtect.id}"}
                        </div>
                      </div>

                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 p-3 border-b flex items-center justify-between">
                          <div className="flex-col">
                            <div className="flex items-center gap-2">
                              <Clock className="h-5 w-5 flex-shrink-0 text-orange-500" />
                              <span className="font-medium">Over Quota</span>
                            </div>
                            <p className="text-gray-500 text-sm">
                              Use this link to redirect participants who are over quota
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() =>
                              handleCopyLink(`https://participation.dtect.io/redirect?status=over_quota&id={dtect.id}`)
                            }
                            title="Copy link"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="p-3 text-sm break-all">
                          https://participation.dtect.io/redirect?status=over_quota&id={"{dtect.id}"}
                        </div>
                      </div>

                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 p-3 border-b flex items-center justify-between">
                          <div className="flex-col">
                            <div className="flex items-center gap-2">
                              <Terminal className="h-5 w-5 flex-shrink-0 text-red-500" />
                              <span className="font-medium">Termination</span>
                            </div>
                            <p className="text-gray-500 text-sm">
                              Use this link to redirect participants who are terminated
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() =>
                              handleCopyLink(
                                `https://participation.dtect.io/redirect?status=security_terminate&id={dtect.id}`,
                              )
                            }
                            title="Copy link"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="p-3 text-sm break-all">
                          https://participation.dtect.io/redirect?status=security_terminate&id={"{dtect.id}"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Security Settings</h2>
                  <p className="text-sm text-gray-500">
                    Configure the best security checks to protect your link protector
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Enable All</span>
                  <Switch checked={enableAll} onCheckedChange={handleToggleAll} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-5 w-5 flex-shrink-0 text-gray-500" />
                        <div>
                          <h3 className="font-medium">Device Deduplication</h3>
                          <p className="text-sm text-gray-500">
                            Blocks multiple attempts from the same browser on a device.
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={securityFeatures.deviceDeduplication}
                        onCheckedChange={(checked) => handleToggleFeature("deviceDeduplication", checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5 flex-shrink-0 text-gray-500" />
                        <div>
                          <h3 className="font-medium">IP Deduplication</h3>
                          <p className="text-sm text-gray-500">Blocks multiple attempts from the same IP address.</p>
                        </div>
                      </div>
                      <Switch
                        checked={securityFeatures.ipDeduplication}
                        onCheckedChange={(checked) => handleToggleFeature("ipDeduplication", checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 flex-shrink-0 text-gray-500" />
                        <div>
                          <h3 className="font-medium">Automation Detection</h3>
                          <p className="text-sm text-gray-500">
                            Blocks entrants using automated technology, such as bots and survey farms.
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={securityFeatures.automationDetection}
                        onCheckedChange={(checked) => handleToggleFeature("automationDetection", checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 flex-shrink-0 text-gray-500" />
                        <div>
                          <h3 className="font-medium">Trusted Browsers & OS</h3>
                          <p className="text-sm text-gray-500">
                            Restrict participation to trusted browsers and operating systems.
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={securityFeatures.trustedBrowsers}
                        onCheckedChange={(checked) => handleToggleFeature("trustedBrowsers", checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-5 w-5 flex-shrink-0 text-gray-500" />
                        <div>
                          <h3 className="font-medium">Audience Validation</h3>
                          <p className="text-sm text-gray-500">
                            Validates that entrants qualify as the target audience.
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={securityFeatures.audienceValidation}
                        onCheckedChange={(checked) => handleToggleFeature("audienceValidation", checked)}
                      />
                    </div>

                    {securityFeatures.audienceValidation && (
                      <div className="mt-4 border-t pt-4">
                        <h4 className="text-sm font-medium mb-3">Validation Type</h4>
                        <div className="grid grid-cols-2 gap-2 p-1 rounded-md bg-gray-100 mb-4">
                          <button
                            className={`px-3 py-2 rounded-md text-sm font-medium ${
                              project.audienceValidation?.type !== "b2b" ? "bg-white shadow-sm" : "text-gray-600"
                            }`}
                            onClick={() => {
                              const updatedProject = {
                                ...project,
                                audienceValidation: {
                                  ...project.audienceValidation,
                                  type: "response",
                                  category: "Consumer/Shopper",
                                },
                              }
                              updateProject(updatedProject)
                              setProject(updatedProject)
                              setHasChanges(true)
                            }}
                          >
                            Response Validation
                          </button>
                          <button
                            className={`px-3 py-2 rounded-md text-sm font-medium ${
                              project.audienceValidation?.type === "b2b" ? "bg-white shadow-sm" : "text-gray-600"
                            }`}
                            onClick={() => {
                              const updatedProject = {
                                ...project,
                                audienceValidation: {
                                  ...project.audienceValidation,
                                  type: "b2b",
                                  category: "Small Business Owner",
                                },
                              }
                              updateProject(updatedProject)
                              setProject(updatedProject)
                              setHasChanges(true)
                            }}
                          >
                            B2B Audience Validation
                          </button>
                        </div>

                        <div className="relative">
                          <select
                            className="w-full p-2 pr-8 border rounded-md appearance-none bg-white"
                            value={project.audienceValidation?.category || "Consumer/Shopper"}
                            onChange={(e) => {
                              const updatedProject = {
                                ...project,
                                audienceValidation: {
                                  ...project.audienceValidation,
                                  category: e.target.value,
                                },
                              }
                              updateProject(updatedProject)
                              setProject(updatedProject)
                              setHasChanges(true)
                            }}
                          >
                            {project.audienceValidation?.type === "b2b" ? (
                              <>
                                <option value="Small Business Owner">Small Business Owner</option>
                                <option value="HR Manager/Director">HR Manager/Director</option>
                                <option value="Finance Director">Finance Director</option>
                                <option value="Marketing Manager/Director">Marketing Manager/Director</option>
                              </>
                            ) : (
                              <>
                                <option value="Consumer/Shopper">Consumer/Shopper</option>
                                <option value="Travel">Travel</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Finance and Banking">Finance and Banking</option>
                                <option value="General">General</option>
                              </>
                            )}
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 flex-shrink-0 text-gray-500" />
                        <div>
                          <h3 className="font-medium">AI Detection</h3>
                          <p className="text-sm text-gray-500">
                            Detects AI use by presenting entrants with randomized questions.
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={securityFeatures.aiDetection}
                        onCheckedChange={(checked) => handleToggleFeature("aiDetection", checked)}
                      />
                    </div>

                    {securityFeatures.aiDetection && (
                      <div className="mt-4 border-t pt-4">
                        <h4 className="text-sm font-medium mb-3">Validation Type</h4>
                        <div className="grid grid-cols-2 gap-2 p-1 rounded-md bg-gray-100 mb-4">
                          <button
                            className={`px-3 py-2 rounded-md text-sm font-medium ${
                              project.aiDetection?.type !== "b2b" ? "bg-white shadow-sm" : "text-gray-600"
                            }`}
                            onClick={() => {
                              const updatedProject = {
                                ...project,
                                aiDetection: {
                                  ...project.aiDetection,
                                  type: "response",
                                  category: "Consumer/Shopper",
                                },
                              }
                              updateProject(updatedProject)
                              setProject(updatedProject)
                              setHasChanges(true)
                            }}
                          >
                            Response Validation
                          </button>
                          <button
                            className={`px-3 py-2 rounded-md text-sm font-medium ${
                              project.aiDetection?.type === "b2b" ? "bg-white shadow-sm" : "text-gray-600"
                            }`}
                            onClick={() => {
                              const updatedProject = {
                                ...project,
                                aiDetection: {
                                  ...project.aiDetection,
                                  type: "b2b",
                                  category: "Small Business Owner",
                                },
                              }
                              updateProject(updatedProject)
                              setProject(updatedProject)
                              setHasChanges(true)
                            }}
                          >
                            B2B Audience Validation
                          </button>
                        </div>

                        <div className="relative">
                          <select
                            className="w-full p-2 pr-8 border rounded-md appearance-none bg-white"
                            value={project.aiDetection?.category || "Consumer/Shopper"}
                            onChange={(e) => {
                              const updatedProject = {
                                ...project,
                                aiDetection: {
                                  ...project.aiDetection,
                                  category: e.target.value,
                                },
                              }
                              updateProject(updatedProject)
                              setProject(updatedProject)
                              setHasChanges(true)
                            }}
                          >
                            {project.aiDetection?.type === "b2b" ? (
                              <>
                                <option value="Small Business Owner">Small Business Owner</option>
                                <option value="HR Manager/Director">HR Manager/Director</option>
                                <option value="Finance Director">Finance Director</option>
                                <option value="Marketing Manager/Director">Marketing Manager/Director</option>
                              </>
                            ) : (
                              <>
                                <option value="Consumer/Shopper">Consumer/Shopper</option>
                                <option value="Travel">Travel</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Finance and Banking">Finance and Banking</option>
                                <option value="General">General</option>
                              </>
                            )}
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 flex-shrink-0 text-gray-500" />
                        <div>
                          <h3 className="font-medium">Location Lock</h3>
                          <p className="text-sm text-gray-500">Blocks entrants not located in specified countries.</p>
                        </div>
                      </div>
                      <Switch
                        checked={securityFeatures.locationLock}
                        onCheckedChange={(checked) => handleToggleFeature("locationLock", checked)}
                      />
                    </div>

                    {/* Add country selection when Location Lock is enabled */}
                    {securityFeatures.locationLock && (
                      <div className="mt-4 border-t pt-4">
                        <label className="block text-sm font-medium mb-2">Allowed Countries</label>
                        <div className="relative">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                className="w-full justify-between h-auto min-h-10"
                              >
                                {selectedCountries.length > 0 ? (
                                  <div className="flex flex-wrap gap-1 py-1">
                                    {selectedCountries.map((country) => (
                                      <Badge key={country} variant="secondary" className="mr-1 mb-1">
                                        {country}
                                        <button
                                          className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                          onMouseDown={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            setSelectedCountries(selectedCountries.filter((c) => c !== country))
                                          }}
                                        >
                                          ×
                                        </button>
                                      </Badge>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">Select countries...</span>
                                )}
                                <span className="ml-2">
                                  <ChevronDown className="h-4 w-4 opacity-50" />
                                </span>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0" align="start">
                              <Command>
                                <CommandInput placeholder="Search country..." />
                                <CommandList>
                                  <CommandEmpty>No country found.</CommandEmpty>
                                  <CommandGroup className="max-h-64 overflow-auto">
                                    {[
                                      "Australia",
                                      "Brazil",
                                      "Canada",
                                      "France",
                                      "Germany",
                                      "India",
                                      "Italy",
                                      "Japan",
                                      "Mexico",
                                      "Netherlands",
                                      "Spain",
                                      "Sweden",
                                      "United Kingdom",
                                      "United States",
                                    ].map((country) => (
                                      <CommandItem
                                        key={country}
                                        onSelect={() => {
                                          setSelectedCountries(
                                            selectedCountries.includes(country)
                                              ? selectedCountries.filter((c) => c !== country)
                                              : [...selectedCountries, country],
                                          )
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedCountries.includes(country) ? "opacity-100" : "opacity-0",
                                          )}
                                        />
                                        {country}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5 flex-shrink-0 text-gray-500" />
                        <div>
                          <h3 className="font-medium">Location Validation</h3>
                          <p className="text-sm text-gray-500">
                            Validates entrants who appear to be spoofing their location.
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={securityFeatures.locationValidation}
                        onCheckedChange={(checked) => handleToggleFeature("locationValidation", checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Siren className="h-5 w-5 flex-shrink-0 text-gray-500" />
                        <div>
                          <h3 className="font-medium flex items-center">
                            Suspicious Users
                            <Badge className="ml-2 bg-black text-white">NEW</Badge>
                          </h3>
                          <p className="text-sm text-gray-500">
                            Blocks participants who display unusual behaviors that may indicate potential risk.
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={securityFeatures.suspiciousUsers}
                        onCheckedChange={(checked) => handleToggleFeature("suspiciousUsers", checked)}
                      />
                    </div>

                    {securityFeatures.suspiciousUsers && (
                      <div className="mt-4 border-t pt-4">
                        <h4 className="text-sm font-medium mb-3">Select signals to detect and block:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="vpnDetection"
                                checked={suspiciousSignals.vpnDetection}
                                onCheckedChange={(checked) =>
                                  setSuspiciousSignals((prev) => ({ ...prev, vpnDetection: checked === true }))
                                }
                              />
                              <label
                                htmlFor="vpnDetection"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                VPN Detection
                              </label>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="deviceTamperingDetection"
                                checked={suspiciousSignals.deviceTamperingDetection}
                                onCheckedChange={(checked) =>
                                  setSuspiciousSignals((prev) => ({
                                    ...prev,
                                    deviceTamperingDetection: checked === true,
                                  }))
                                }
                              />
                              <label
                                htmlFor="deviceTamperingDetection"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Device Tampering Detection
                              </label>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="virtualMachineDetection"
                                checked={suspiciousSignals.virtualMachineDetection}
                                onCheckedChange={(checked) =>
                                  setSuspiciousSignals((prev) => ({
                                    ...prev,
                                    virtualMachineDetection: checked === true,
                                  }))
                                }
                              />
                              <label
                                htmlFor="virtualMachineDetection"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Virtual Machine Detection
                              </label>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="devToolsDetection"
                                checked={suspiciousSignals.devToolsDetection}
                                onCheckedChange={(checked) =>
                                  setSuspiciousSignals((prev) => ({ ...prev, devToolsDetection: checked === true }))
                                }
                              />
                              <label
                                htmlFor="devToolsDetection"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Dev Tools Detection
                              </label>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="privacyFocusedSettings"
                                checked={suspiciousSignals.privacyFocusedSettings}
                                onCheckedChange={(checked) =>
                                  setSuspiciousSignals((prev) => ({
                                    ...prev,
                                    privacyFocusedSettings: checked === true,
                                  }))
                                }
                              />
                              <label
                                htmlFor="privacyFocusedSettings"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Privacy-Focused Settings
                              </label>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="torExitNodeDetection"
                                checked={suspiciousSignals.torExitNodeDetection}
                                onCheckedChange={(checked) =>
                                  setSuspiciousSignals((prev) => ({ ...prev, torExitNodeDetection: checked === true }))
                                }
                              />
                              <label
                                htmlFor="torExitNodeDetection"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Tor Exit Node Detection
                              </label>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="publicProxyDetection"
                                checked={suspiciousSignals.publicProxyDetection}
                                onCheckedChange={(checked) =>
                                  setSuspiciousSignals((prev) => ({ ...prev, publicProxyDetection: checked === true }))
                                }
                              />
                              <label
                                htmlFor="publicProxyDetection"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Public Proxy Detection
                              </label>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="highActivityDeviceDetection"
                                checked={suspiciousSignals.highActivityDeviceDetection}
                                onCheckedChange={(checked) =>
                                  setSuspiciousSignals((prev) => ({
                                    ...prev,
                                    highActivityDeviceDetection: checked === true,
                                  }))
                                }
                              />
                              <label
                                htmlFor="highActivityDeviceDetection"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                High-Activity Device Detection
                              </label>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="incognitoModeDetection"
                                checked={suspiciousSignals.incognitoModeDetection}
                                onCheckedChange={(checked) =>
                                  setSuspiciousSignals((prev) => ({
                                    ...prev,
                                    incognitoModeDetection: checked === true,
                                  }))
                                }
                              />
                              <label
                                htmlFor="incognitoModeDetection"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Incognito Mode Detection
                              </label>
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-gray-500 mt-4">
                          Participants matching any of these signals will be blocked from moving to your survey
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Link className="h-5 w-5 flex-shrink-0 text-gray-500" />
                        <div>
                          <h3 className="font-medium">Duplicate ID</h3>
                          <p className="text-sm text-gray-500">
                            Blocks multiple attempts from the same supplier participant ID.
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={securityFeatures.duplicateId}
                        onCheckedChange={(checked) => handleToggleFeature("duplicateId", checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {hasChanges && (
                <div className="flex justify-end">
                  <Button
                    variant="default"
                    className="bg-black text-white hover:bg-gray-800"
                    onClick={handleSaveChanges}
                  >
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Link Protector Settings</h2>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Link Protector Name</label>
                    <Input defaultValue={project.name} />
                  </div>

                  <div className="space-y-2"></div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Protected Link</label>
                    <Input
                      ref={surveyLinkRef}
                      defaultValue={project.surveyLink}
                      onChange={(e) => setSurveyLinkValue(e.target.value)}
                      className={surveyLinkError ? "border-red-500" : ""}
                    />
                    {surveyLinkError && <p className="text-sm text-red-500">{surveyLinkError}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Termination Link</label>
                    <Input
                      defaultValue={project.terminationLink}
                      onChange={(e) => setTerminationLinkValue(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Advanced Options</label>
                    <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
                      {/* Updated feature name and description */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Survey redirect to dtect</h3>
                          <p className="text-sm text-gray-500">
                            Enabling this creates a unique ID for surveys redirecting participants back to dtect and we
                            route them based on the status returned
                          </p>
                        </div>
                        <Switch
                          checked={enableDtectRedirects}
                          onCheckedChange={(checked) => {
                            setEnableDtectRedirects(checked)
                            if (project) {
                              const updatedProject = {
                                ...project,
                                advancedOptions: {
                                  ...(project.advancedOptions || {}),
                                  enableDtectRedirects: checked,
                                },
                              }
                              updateProject(updatedProject)
                              setProject(updatedProject)
                            }
                          }}
                        />
                      </div>

                      {/* Show Complete URL input when the feature is enabled */}
                      {enableDtectRedirects && (
                        <div className="mt-4 pl-4 border-l-2 border-gray-200">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Complete URL</label>
                            <p className="text-xs text-gray-500">
                              Provide the URL you want to redirect participants when they qualify in your survey and you
                              send them back to dtect
                            </p>
                            <Input
                              placeholder="https://your-complete-url.com"
                              value={completeUrl}
                              onChange={(e) => {
                                setCompleteUrl(e.target.value)
                                if (project) {
                                  const updatedProject = {
                                    ...project,
                                    advancedOptions: {
                                      ...(project.advancedOptions || {}),
                                      completeUrl: e.target.value,
                                    },
                                  }
                                  updateProject(updatedProject)
                                  setProject(updatedProject)
                                }
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Custom Paused Link URL option */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">Custom Link for Paused Traffic</h3>
                            <p className="text-sm text-gray-500">
                              When enabled, dtect will use this URL to send participants when you pause traffic, or who
                              return from your survey as 'Over Quota' if <strong>Survey redirect to dtect</strong> is
                              enabled. If disabled, participants in these scenarios will be sent to the project's
                              Termination Link instead.
                            </p>
                          </div>
                          <Switch
                            checked={customPausedLinkEnabled}
                            onCheckedChange={(checked) => {
                              setCustomPausedLinkEnabled(checked)
                              if (project) {
                                const updatedProject = {
                                  ...project,
                                  advancedOptions: {
                                    ...(project.advancedOptions || {}),
                                    customPausedLinkEnabled: checked,
                                  },
                                }
                                updateProject(updatedProject)
                                setProject(updatedProject)
                              }
                            }}
                          />
                        </div>

                        {customPausedLinkEnabled && (
                          <div className="mt-4 pl-4 border-l-2 border-gray-200">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Paused/Over Quota URL</label>
                              <p className="text-xs text-gray-500">
                                Provide the URL to redirect participants blocked by traffic paused or those returning as
                                'Over Quota' from your survey if <strong>Surveys redirects to dtect</strong> is enabled
                              </p>
                              <Input
                                placeholder="https://your-paused-link-url.com"
                                value={customPausedLinkUrl}
                                onChange={(e) => {
                                  setCustomPausedLinkUrl(e.target.value)
                                  if (project) {
                                    const updatedProject = {
                                      ...project,
                                      advancedOptions: {
                                        ...(project.advancedOptions || {}),
                                        customPausedLinkUrl: e.target.value,
                                      },
                                    }
                                    updateProject(updatedProject)
                                    setProject(updatedProject)
                                  }
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button className="bg-black text-white hover:bg-gray-800" onClick={handleUpdateSurveyLink}>
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Danger Zone</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-red-200 rounded-md bg-red-50 mb-4">
                    <div>
                      <h3 className="font-medium">Disable Termination</h3>
                      <p className="text-sm text-gray-500">
                        When enabled, all participants will be allowed through even if identified as fraudulent. This
                        bypasses all security checks.
                      </p>
                    </div>
                    <Switch checked={disableTermination} onCheckedChange={handleDisableTerminationToggle} />
                  </div>
                  <div className="flex items-center justify-between p-4 border border-red-200 rounded-md bg-red-50">
                    <div>
                      <h3 className="font-medium">Delete Link Protector</h3>
                      <p className="text-sm text-gray-500">
                        Once you delete a link protector, there is no going back. Please be certain.
                      </p>
                    </div>
                    <Button variant="destructive">Delete Link Protector</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      <AlertDialog open={showDisableTerminationDialog} onOpenChange={setShowDisableTerminationDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will disable all termination checks for this link protector. All participants will be allowed
              through to your survey, even if they are identified as fraudulent or suspicious. This could significantly
              impact your data quality.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDisableTermination} className="bg-red-600 hover:bg-red-700">
              Yes, disable termination
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
