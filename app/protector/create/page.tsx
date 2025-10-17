"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  Globe,
  MapPin,
  Shield,
  Smartphone,
  Terminal,
  UserCheck,
  Zap,
  Link,
  Siren,
  Users,
  Award,
  ShieldCheck,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { addProject } from "@/lib/project-storage"
import { useToast } from "@/components/ui/use-toast"

type SecurityPreset = "human-only" | "high-quality" | "maximum" | null
type SecurityCategory = "all" | "location" | "deduplication" | "fraud-protection" | "pre-screening"

export default function CreateLinkProtector() {
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "Gen Z iPhone Users",
    protectedLink: "https://www.mysurveylinkhere.com/",
    terminationType: "default" as const,
    customTerminationLink: "",
  })

  const [securityFeatures, setSecurityFeatures] = useState({
    deviceDeduplication: false,
    ipDeduplication: false,
    automationDetection: false,
    trustedBrowsers: false,
    audienceValidation: false,
    aiDetection: false,
    locationLock: false,
    locationValidation: false,
    suspiciousSignals: false,
    duplicateId: false,
  })

  const [securityPreset, setSecurityPreset] = useState<SecurityPreset>(null)
  const [showSecurityFeatures, setShowSecurityFeatures] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<SecurityCategory>("all")

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

  // Advanced options state
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)

  // Updated variable names for the first feature
  const [enableDtectRedirects, setEnableDtectRedirects] = useState(false)
  const [completeUrl, setCompleteUrl] = useState("")

  // Add these new state variables after the maskParticipantId state
  const [customPausedLinkEnabled, setCustomPausedLinkEnabled] = useState(false)
  const [customPausedLinkUrl, setCustomPausedLinkUrl] = useState("")

  const [enableAll, setEnableAll] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // New state variables for audience and AI validation
  const [audienceValidationType, setAudienceValidationType] = useState<"response" | "b2b">("response")
  const [audienceValidationCategory, setAudienceValidationCategory] = useState<string>("Consumer/Shopper")
  const [aiDetectionType, setAiDetectionType] = useState<"response" | "b2b">("response")
  const [aiDetectionCategory, setAiDetectionCategory] = useState<string>("Consumer/Shopper")

  const [surveyLinkError, setSurveyLinkError] = useState("")
  const surveyLinkRef = useRef<HTMLInputElement>(null)

  const handlePresetSelection = (preset: SecurityPreset) => {
    setSecurityPreset(preset)
    // </CHANGE> Removed setShowSecurityFeatures(false) to keep panel state when switching presets

    // Apply preset configurations
    switch (preset) {
      case "human-only":
        // Human-Only Access: Automation Detection, Trusted Browsers & OS, Suspicious Users (VM, Tampering, Dev Tools, Tor), Duplicate Entries (ID, Device, IP)
        setSecurityFeatures({
          deviceDeduplication: true,
          ipDeduplication: true,
          automationDetection: true,
          trustedBrowsers: true,
          audienceValidation: false,
          aiDetection: false,
          locationLock: false,
          locationValidation: false,
          suspiciousSignals: true,
          duplicateId: true,
        })
        // Enable specific suspicious signals for human-only
        setSuspiciousSignals({
          vpnDetection: false,
          torExitNodeDetection: true,
          deviceTamperingDetection: true,
          publicProxyDetection: false,
          virtualMachineDetection: true,
          highActivityDeviceDetection: false,
          devToolsDetection: true,
          incognitoModeDetection: false,
          privacyFocusedSettings: false,
        })
        break
      case "high-quality":
        // High-Quality Participants: All from Human-Only + AI Detection + Quality Questions (Audience Validation) + Location Validation
        setSecurityFeatures({
          deviceDeduplication: true,
          ipDeduplication: true,
          automationDetection: true,
          trustedBrowsers: true,
          audienceValidation: true,
          aiDetection: true,
          locationLock: false,
          locationValidation: false,
          suspiciousSignals: true,
          duplicateId: true,
        })
        // Keep the same suspicious signals as human-only
        setSuspiciousSignals({
          vpnDetection: false,
          torExitNodeDetection: true,
          deviceTamperingDetection: true,
          publicProxyDetection: false,
          virtualMachineDetection: true,
          highActivityDeviceDetection: false,
          devToolsDetection: true,
          incognitoModeDetection: false,
          privacyFocusedSettings: false,
        })
        break
      case "maximum":
        // Maximum Protection: All from High-Quality + All Suspicious Signals
        setSecurityFeatures({
          deviceDeduplication: true,
          ipDeduplication: true,
          automationDetection: true,
          trustedBrowsers: true,
          audienceValidation: true,
          aiDetection: true,
          locationLock: true,
          locationValidation: true,
          suspiciousSignals: true,
          duplicateId: true,
        })
        // Enable all suspicious signals for maximum protection
        setSuspiciousSignals({
          vpnDetection: true,
          torExitNodeDetection: true,
          deviceTamperingDetection: true,
          publicProxyDetection: true,
          virtualMachineDetection: true,
          highActivityDeviceDetection: true,
          devToolsDetection: true,
          incognitoModeDetection: true,
          privacyFocusedSettings: true,
        })
        break
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleRadioChange = (value: "default" | "custom") => {
    setFormData((prev) => ({
      ...prev,
      terminationType: value,
    }))
  }

  const handleToggleFeature = (feature: keyof typeof securityFeatures, checked: boolean) => {
    setSecurityFeatures((prev) => ({
      ...prev,
      [feature]: checked,
    }))

    const allEnabled = Object.keys(securityFeatures).every((key) =>
      key === feature ? checked : securityFeatures[key as keyof typeof securityFeatures],
    )
    setEnableAll(allEnabled)
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
      suspiciousSignals: checked,
      duplicateId: checked,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Reset error state
    setSurveyLinkError("")

    // No need to validate {dtect.id} anymore since we've changed the feature

    setIsSubmitting(true)

    try {
      // Create the new project with advanced options
      const newProject = addProject({
        ...formData,
        securityFeatures,
        advancedOptions: {
          enableDtectRedirects,
          completeUrl: enableDtectRedirects ? completeUrl : "",
          customPausedLinkEnabled,
          customPausedLinkUrl: customPausedLinkEnabled ? customPausedLinkUrl : "",
        },
        suspiciousSignals,
        selectedCountries,
        audienceValidation: {
          type: audienceValidationType,
          category: audienceValidationCategory,
        },
        aiDetection: {
          type: aiDetectionType,
          category: aiDetectionCategory,
        },
      })

      // Show success toast
      toast({
        title: "Link protector created successfully",
        description: `${newProject.name} has been created and is now active.`,
      })

      // Redirect to the project details page
      router.push(`/link-protector/${newProject.id}`)
    } catch (error) {
      console.error("Error creating link protector:", error)
      toast({
        title: "Error creating link protector",
        description: "There was an error creating your link protector. Please try again.",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <Button variant="ghost" size="sm" className="gap-1" onClick={() => router.push("/link-protectors")}>
            <ArrowLeft className="h-4 w-4" />
            Back to Link Protectors
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold">Link Protector Details</h2>
                  <p className="text-gray-500 text-sm">
                    Configure your Link Protector by selecting the features you need to secure your link.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-base font-medium">
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="ex: iPhone Users Survey"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="protectedLink" className="text-base font-medium">
                      Protected Link
                    </Label>
                    <p className="text-xs text-gray-500 mb-2">
                      This can be a Survey Link, Study Link or any other link you want to protect
                    </p>
                    <Input
                      id="protectedLink"
                      name="protectedLink"
                      placeholder="Link to your survey (ex: https://my-survey-link.com)"
                      value={formData.protectedLink}
                      onChange={handleInputChange}
                      required
                      className={`h-12 ${surveyLinkError ? "border-red-500" : ""}`}
                      ref={surveyLinkRef}
                    />
                    {surveyLinkError && <p className="text-sm text-red-500 mt-1">{surveyLinkError}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-medium">Termination Link</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <div
                        className={`border rounded-md p-4 cursor-pointer transition-colors ${formData.terminationType === "default" ? "border-black bg-gray-50" : "border-gray-200 hover:bg-gray-50"}`}
                        onClick={() => handleRadioChange("default")}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium text-base">Default Termination Link</h3>
                          </div>
                          <Badge className="bg-black text-white">Recommended</Badge>
                        </div>
                        <p className="text-gray-500 text-sm">
                          Our default link that directs participants who fail security checks.
                        </p>
                      </div>

                      <div
                        className={`border rounded-md p-4 cursor-pointer transition-colors ${formData.terminationType === "custom" ? "border-black bg-gray-50" : "border-gray-200 hover:bg-gray-50"}`}
                        onClick={() => handleRadioChange("custom")}
                      >
                        <div className="mb-2">
                          <h3 className="font-medium text-base">Custom Termination Link</h3>
                        </div>
                        <p className="text-gray-500 text-sm">
                          Provide a custom link for participants who fail security checks
                        </p>
                        {formData.terminationType === "custom" && (
                          <Input
                            name="customTerminationLink"
                            placeholder="https://your-custom-termination-link.com"
                            value={formData.customTerminationLink}
                            onChange={handleInputChange}
                            className="mt-2"
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold">Security</h2>
                  <p className="text-gray-500 text-sm">
                    Set up your security in one click or customize it to fit your needs.
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold">Security Presets</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Choose the security preset that best aligns with your goal.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div
                      className={`border rounded-lg p-5 cursor-pointer transition-all ${
                        securityPreset === "human-only"
                          ? "border-black bg-gray-50 shadow-sm"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                      onClick={() => handlePresetSelection("human-only")}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        {securityPreset === "human-only" && (
                          <div className="p-1 bg-black rounded-full">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                      <h3 className="font-semibold text-base mb-2">Human-Only Access</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Allow only verified, human participants. Stop bots, AI Agents, scripts, and duplicate entries.
                      </p>
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-500 font-medium">Enabled Features:</p>
                        <ul className="text-xs text-gray-500 mt-1 space-y-1">
                          <li>• Automation Detection</li>
                          <li>• Trusted Browsers & OS</li>
                          <li>• Highly Suspicious Signals (Virtual Machine, Tampering, Dev Tools, Tor)</li>
                          <li>• Duplicate Entries: ID, Device, and IP</li>
                        </ul>
                      </div>
                    </div>

                    <div
                      className={`border rounded-lg p-5 cursor-pointer transition-all ${
                        securityPreset === "high-quality"
                          ? "border-black bg-gray-50 shadow-sm"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                      onClick={() => handlePresetSelection("high-quality")}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Award className="h-6 w-6 text-green-600" />
                        </div>
                        {securityPreset === "high-quality" && (
                          <div className="p-1 bg-black rounded-full">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                      <h3 className="font-semibold text-base mb-2">High-Quality Participants</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Filter out automation and low-effort participants. Detect AI generated answers and allow only
                        real, attentive participants who provide trustworthy data.
                      </p>
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-500 font-medium">Enabled Features:</p>
                        <ul className="text-xs text-gray-500 mt-1 space-y-1">
                          <li>• All from Human-Only Access</li>
                          <li>• AI Detection</li>
                          <li>• Quality Questions</li>
                        </ul>
                      </div>
                    </div>

                    <div
                      className={`border rounded-lg p-5 cursor-pointer transition-all ${
                        securityPreset === "maximum"
                          ? "border-black bg-gray-50 shadow-sm"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                      onClick={() => handlePresetSelection("maximum")}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <ShieldCheck className="h-6 w-6 text-red-600" />
                        </div>
                        {securityPreset === "maximum" && (
                          <div className="p-1 bg-black rounded-full">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                      <h3 className="font-semibold text-base mb-2">Maximum Protection</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Prioritize the cleanest data possible with every security layer enabled. Expect the lowest fraud
                        rate with some impact on conversion.
                      </p>
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-500 font-medium">Enabled Features:</p>
                        <ul className="text-xs text-gray-500 mt-1 space-y-1">
                          <li>• All from High-Quality Participants</li>
                          <li>• All Suspicious Signals</li>
                          <li>• Location Validation</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <div
                      className={cn(
                        "border rounded-lg p-4 cursor-pointer transition-all duration-200",
                        showSecurityFeatures
                          ? "bg-gray-50 border-gray-300"
                          : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50",
                      )}
                      onClick={() => setShowSecurityFeatures(!showSecurityFeatures)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <Settings className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-base">
                              {showSecurityFeatures ? "Hide Security Features" : "Customize Security Features"}
                            </h3>
                            <p className="text-sm text-gray-500 mt-0.5">
                              {showSecurityFeatures
                                ? "Collapse to hide all security features."
                                : "See all available features. You can enable or disable any to adjust your goals."}
                            </p>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          {showSecurityFeatures ? (
                            <ChevronUp className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {showSecurityFeatures && (
                  <div className="animate-in slide-in-from-top-2 duration-300 space-y-6 pt-0">
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-gray-700">Category</h3>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        <button
                          type="button"
                          onClick={() => setSelectedCategory("all")}
                          className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                            selectedCategory === "all"
                              ? "bg-black text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                          )}
                        >
                          All Features
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedCategory("location")}
                          className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                            selectedCategory === "location"
                              ? "bg-black text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                          )}
                        >
                          Location
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedCategory("deduplication")}
                          className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                            selectedCategory === "deduplication"
                              ? "bg-black text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                          )}
                        >
                          Deduplication
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedCategory("fraud-protection")}
                          className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                            selectedCategory === "fraud-protection"
                              ? "bg-black text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                          )}
                        >
                          Fraud Protection
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedCategory("pre-screening")}
                          className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                            selectedCategory === "pre-screening"
                              ? "bg-black text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                          )}
                        >
                          Pre-screening
                        </button>
                      </div>
                    </div>

                    <div
                      key={selectedCategory}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
                    >
                      {/* Location Category */}
                      {(selectedCategory === "all" || selectedCategory === "location") && (
                        <>
                          <div className="border rounded-md p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-gray-500" />
                                <h3 className="font-medium">Location Lock</h3>
                              </div>
                              <Switch
                                checked={securityFeatures.locationLock}
                                onCheckedChange={(checked) => handleToggleFeature("locationLock", checked)}
                              />
                            </div>
                            <p className="text-gray-500 text-sm ml-7">
                              Blocks entrants not located in specified countries.
                            </p>

                            {securityFeatures.locationLock && (
                              <div className="mt-4 ml-7 border-t pt-4">
                                <label className="block text-sm font-medium mb-2">Allowed Countries</label>
                                <div className="relative">
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant="outline"
                                        role="combobox"
                                        className="w-full justify-between h-auto min-h-10 bg-transparent"
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
                          </div>

                          <div className="border rounded-md p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Globe className="h-5 w-5 text-gray-500" />
                                <h3 className="font-medium">Location Validation</h3>
                              </div>
                              <Switch
                                checked={securityFeatures.locationValidation}
                                onCheckedChange={(checked) => handleToggleFeature("locationValidation", checked)}
                              />
                            </div>
                            <p className="text-gray-500 text-sm ml-7">
                              Using a location-specific question, validates entrants who appear to be spoofing their
                              location.
                            </p>
                          </div>
                        </>
                      )}

                      {/* Deduplication Category */}
                      {(selectedCategory === "all" || selectedCategory === "deduplication") && (
                        <>
                          <div className="border rounded-md p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Smartphone className="h-5 w-5 text-gray-500" />
                                <h3 className="font-medium">Device Deduplication</h3>
                              </div>
                              <Switch
                                checked={securityFeatures.deviceDeduplication}
                                onCheckedChange={(checked) => handleToggleFeature("deviceDeduplication", checked)}
                              />
                            </div>
                            <p className="text-gray-500 text-sm ml-7">
                              Blocks multiple attempts from the same browser on a device.
                            </p>
                          </div>

                          <div className="border rounded-md p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Globe className="h-5 w-5 text-gray-500" />
                                <h3 className="font-medium">IP Deduplication</h3>
                              </div>
                              <Switch
                                checked={securityFeatures.ipDeduplication}
                                onCheckedChange={(checked) => handleToggleFeature("ipDeduplication", checked)}
                              />
                            </div>
                            <p className="text-gray-500 text-sm ml-7">
                              Blocks multiple attempts from the same IP address.
                            </p>
                          </div>

                          <div className="border rounded-md p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Link className="h-5 w-5 text-gray-500" />
                                <h3 className="font-medium">Duplicate ID</h3>
                              </div>
                              <Switch
                                checked={securityFeatures.duplicateId}
                                onCheckedChange={(checked) => handleToggleFeature("duplicateId", checked)}
                              />
                            </div>
                            <p className="text-gray-500 text-sm ml-7">
                              Blocks multiple attempts from the same supplier participant ID.
                            </p>
                          </div>
                        </>
                      )}

                      {/* Fraud Protection Category */}
                      {(selectedCategory === "all" || selectedCategory === "fraud-protection") && (
                        <>
                          <div className="border rounded-md p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Zap className="h-5 w-5 text-gray-500" />
                                <h3 className="font-medium">Automation Detection</h3>
                              </div>
                              <Switch
                                checked={securityFeatures.automationDetection}
                                onCheckedChange={(checked) => handleToggleFeature("automationDetection", checked)}
                              />
                            </div>
                            <p className="text-gray-500 text-sm ml-7">
                              Blocks entrants using automated technology, such as bots and survey farms.
                            </p>
                          </div>

                          <div className="border rounded-md p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-gray-500" />
                                <h3 className="font-medium">Trusted Browsers & OS</h3>
                              </div>
                              <Switch
                                checked={securityFeatures.trustedBrowsers}
                                onCheckedChange={(checked) => handleToggleFeature("trustedBrowsers", checked)}
                              />
                            </div>
                            <p className="text-gray-500 text-sm ml-7">
                              Restrict participation to trusted browsers and operating systems, blocking those
                              associated with high-risk activity.
                            </p>
                          </div>

                          <div className="border rounded-md p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Siren className="h-5 w-5 text-gray-500" />
                                <div className="flex items-center">
                                  <h3 className="font-medium">Suspicious Signals</h3>
                                  <Badge className="ml-2 bg-black text-white">NEW</Badge>
                                </div>
                              </div>
                              <Switch
                                checked={securityFeatures.suspiciousSignals}
                                onCheckedChange={(checked) => handleToggleFeature("suspiciousSignals", checked)}
                              />
                            </div>
                            <p className="text-gray-500 text-sm ml-7">
                              Blocks participants who display unusual behaviors that may indicate potential risk.
                            </p>

                            {securityFeatures.suspiciousSignals && (
                              <div className="mt-4 ml-7 border-t pt-4">
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
                                          setSuspiciousSignals((prev) => ({
                                            ...prev,
                                            devToolsDetection: checked === true,
                                          }))
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
                                          setSuspiciousSignals((prev) => ({
                                            ...prev,
                                            torExitNodeDetection: checked === true,
                                          }))
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
                                          setSuspiciousSignals((prev) => ({
                                            ...prev,
                                            publicProxyDetection: checked === true,
                                          }))
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
                          </div>
                        </>
                      )}

                      {/* Pre-screening Category */}
                      {(selectedCategory === "all" || selectedCategory === "pre-screening") && (
                        <>
                          <div className="border rounded-md p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <UserCheck className="h-5 w-5 text-gray-500" />
                                <h3 className="font-medium">Audience Validation</h3>
                              </div>
                              <Switch
                                checked={securityFeatures.audienceValidation}
                                onCheckedChange={(checked) => handleToggleFeature("audienceValidation", checked)}
                              />
                            </div>
                            <p className="text-gray-500 text-sm ml-7">
                              Validates that entrants qualify as the target audience with randomized, audience-specific,
                              closed-end questions.
                            </p>

                            {securityFeatures.audienceValidation && (
                              <div className="mt-4 ml-7 border-t pt-4">
                                <h4 className="text-sm font-medium mb-3">Validation Type</h4>
                                <div className="grid grid-cols-2 gap-2 p-1 rounded-md bg-gray-100 mb-4">
                                  <button
                                    type="button"
                                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                                      audienceValidationType !== "b2b" ? "bg-white shadow-sm" : "text-gray-600"
                                    }`}
                                    onClick={() => setAudienceValidationType("response")}
                                  >
                                    Response Validation
                                  </button>
                                  <button
                                    type="button"
                                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                                      audienceValidationType === "b2b" ? "bg-white shadow-sm" : "text-gray-600"
                                    }`}
                                    onClick={() => setAudienceValidationType("b2b")}
                                  >
                                    B2B Audience Validation
                                  </button>
                                </div>

                                <div className="relative">
                                  <select
                                    className="w-full p-2 pr-8 border rounded-md appearance-none bg-white"
                                    value={audienceValidationCategory}
                                    onChange={(e) => setAudienceValidationCategory(e.target.value)}
                                  >
                                    {audienceValidationType === "b2b" ? (
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
                          </div>

                          <div className="border rounded-md p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Terminal className="h-5 w-5 text-gray-500" />
                                <h3 className="font-medium">AI Detection</h3>
                              </div>
                              <Switch
                                checked={securityFeatures.aiDetection}
                                onCheckedChange={(checked) => handleToggleFeature("aiDetection", checked)}
                              />
                            </div>
                            <p className="text-gray-500 text-sm ml-7">
                              Detects AI use by presenting entrants with randomized, audience-specific, open-end
                              questions.
                            </p>

                            {securityFeatures.aiDetection && (
                              <div className="mt-4 ml-7 border-t pt-4">
                                <h4 className="text-sm font-medium mb-3">Validation Type</h4>
                                <div className="grid grid-cols-2 gap-2 p-1 rounded-md bg-gray-100 mb-4">
                                  <button
                                    type="button"
                                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                                      aiDetectionType !== "b2b" ? "bg-white shadow-sm" : "text-gray-600"
                                    }`}
                                    onClick={() => setAiDetectionType("response")}
                                  >
                                    Response Validation
                                  </button>
                                  <button
                                    type="button"
                                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                                      aiDetectionType === "b2b" ? "bg-white shadow-sm" : "text-gray-600"
                                    }`}
                                    onClick={() => setAiDetectionType("b2b")}
                                  >
                                    B2B Audience Validation
                                  </button>
                                </div>

                                <div className="relative">
                                  <select
                                    className="w-full p-2 pr-8 border rounded-md appearance-none bg-white"
                                    value={aiDetectionCategory}
                                    onChange={(e) => setAiDetectionCategory(e.target.value)}
                                  >
                                    {aiDetectionType === "b2b" ? (
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
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => router.push("/link-protectors")}>
                Cancel
              </Button>
              <Button type="submit" className="bg-black text-white hover:bg-gray-800" disabled={isSubmitting}>
                <Check className="h-4 w-4 mr-2" />
                {isSubmitting ? "Creating..." : "Create Link Protector"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
