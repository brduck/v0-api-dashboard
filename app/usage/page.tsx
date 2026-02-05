"use client"

import * as React from "react"
import { useState } from "react"
import {
  Calendar,
  RefreshCw,
  Check,
  ChevronsUpDown,
  ChevronRight,
  Info,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  Fingerprint,
  Globe,
  Shield,
  Bot,
  MapPin,
  Eye,
  Layers,
} from "lucide-react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip as RechartsTooltip } from "recharts"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

// ─── SHARED DATA ──────────────────────────────────────────────────────────────

const CLIENTS = [
  {
    id: "client-a",
    name: "Client Name A",
    projects: [
      { id: "proj-7a2d9f3b", name: "proj-7a2d9f3b" },
      { id: "proj-c4e8b1a6", name: "proj-c4e8b1a6" },
      { id: "proj-9f5d2c7e", name: "proj-9f5d2c7e" },
    ],
  },
  {
    id: "client-b",
    name: "Client Name B",
    projects: [
      { id: "proj-3b8a4f9d", name: "proj-3b8a4f9d" },
      { id: "proj-6e2c9a5f", name: "proj-6e2c9a5f" },
    ],
  },
  {
    id: "client-c",
    name: "Client Name C",
    projects: [
      { id: "proj-1d7f3e9b", name: "proj-1d7f3e9b" },
      { id: "proj-8c4a2d6f", name: "proj-8c4a2d6f" },
      { id: "proj-5b9e1a7c", name: "proj-5b9e1a7c" },
    ],
  },
  {
    id: "client-d",
    name: "Client Name D",
    projects: [
      { id: "proj-2f6d8c9a", name: "proj-2f6d8c9a" },
      { id: "proj-4a9e3b7d", name: "proj-4a9e3b7d" },
    ],
  },
]

const totalSessions = 1355345
const goodCount = 1016508
const suspiciousCount = 108427
const badCount = 230408

const FRAUD_CATEGORIES = [
  {
    id: "identity-reuse",
    name: "Identity Reuse",
    description:
      "The same person, device, or identity appeared multiple times. This is the most common reason sessions are classified as bad.",
    badSessions: 112340,
    strength: "strong" as const,
    icon: Fingerprint,
    signals: [
      { name: "IP Deduplication", severity: "bad" as const, fired: 198742, description: "Same IP address seen across multiple sessions" },
      { name: "Device Deduplication", severity: "bad" as const, fired: 175631, description: "Same device fingerprint seen across sessions" },
      { name: "ID Deduplication", severity: "bad" as const, fired: 92163, description: "Same user identifier submitted more than once" },
    ],
    coOccurrence: "IP and Device deduplication fired together in 84% of these sessions",
  },
  {
    id: "network-masking",
    name: "Network Masking",
    description:
      "The participant was hiding their true network identity through VPNs, proxies, or anonymizing tools.",
    badSessions: 89420,
    strength: "strong" as const,
    icon: Shield,
    signals: [
      { name: "VPN Usage", severity: "suspicious" as const, fired: 74329, description: "Traffic routed through a VPN service" },
      { name: "Tor Exit Node", severity: "suspicious" as const, fired: 21873, description: "Connection through the Tor anonymity network" },
      { name: "IP Blocklist", severity: "bad" as const, fired: 15246, description: "IP found on known abuse/fraud blocklists" },
    ],
    coOccurrence: "72% of VPN detections also triggered a Location Validation flag",
  },
  {
    id: "location-inconsistency",
    name: "Location Inconsistency",
    description:
      "The participant's claimed or expected location did not match their actual connection details.",
    badSessions: 67150,
    strength: "moderate" as const,
    icon: MapPin,
    signals: [
      { name: "Location Validation", severity: "suspicious" as const, fired: 87521, description: "Claimed location mismatched IP geolocation" },
      { name: "Location Lock", severity: "bad" as const, fired: 45872, description: "Access attempted from an unauthorized region" },
    ],
    coOccurrence: "60% were timezone mismatches; 40% were country-level mismatches",
  },
  {
    id: "non-human-behavior",
    name: "Non-Human Behavior",
    description:
      "Behavioral signals suggest the session was automated, bot-driven, or AI-assisted rather than a genuine human participant.",
    badSessions: 42860,
    strength: "moderate" as const,
    icon: Bot,
    signals: [
      { name: "Automation Detection", severity: "bad" as const, fired: 18935, description: "Patterns consistent with scripted interaction" },
      { name: "AI Detection", severity: "bad" as const, fired: 5891, description: "Responses consistent with AI-generated text" },
      { name: "Quality Questions", severity: "bad" as const, fired: 7532, description: "Failed attention or quality screening checks" },
    ],
    coOccurrence: "Automation and AI detection co-fired in 38% of flagged sessions",
  },
  {
    id: "environment-tampering",
    name: "Environment Tampering",
    description:
      "The participant's device or browser environment was modified or operating in an unusual configuration.",
    badSessions: 31200,
    strength: "weak" as const,
    icon: Eye,
    signals: [
      { name: "Device Tampering", severity: "suspicious" as const, fired: 62438, description: "Device fingerprint properties were altered" },
      { name: "Virtual Machine", severity: "suspicious" as const, fired: 54219, description: "Session originated from a virtualized environment" },
      { name: "Untrusted Browser/OS", severity: "bad" as const, fired: 9874, description: "Browser or OS version commonly associated with fraud" },
      { name: "Dev Tools", severity: "suspicious" as const, fired: 43762, description: "Browser developer tools were active" },
    ],
    coOccurrence: "Virtual machine + Dev Tools co-occurred in 52% of these sessions",
  },
  {
    id: "evasion-signals",
    name: "Evasion Signals",
    description:
      "The participant used privacy-enhancing tools or techniques that may indicate an intent to avoid detection.",
    badSessions: 18900,
    strength: "weak" as const,
    icon: Layers,
    signals: [
      { name: "Privacy-Focused Settings", severity: "suspicious" as const, fired: 38945, description: "Unusually restrictive privacy configuration" },
      { name: "Incognito Mode", severity: "suspicious" as const, fired: 15234, description: "Browsing in private or incognito mode" },
      { name: "High-Activity Device", severity: "suspicious" as const, fired: 18542, description: "Device seen in an abnormally high number of sessions" },
    ],
    coOccurrence: "Privacy settings + Incognito mode appeared together in 61% of flagged sessions",
  },
]

const trendData = [
  { date: "Week 1", "Identity Reuse": 28100, "Network Masking": 22300, "Location Inconsistency": 16700, "Non-Human Behavior": 10600, "Environment Tampering": 7800, "Evasion Signals": 4700 },
  { date: "Week 2", "Identity Reuse": 29500, "Network Masking": 23100, "Location Inconsistency": 17200, "Non-Human Behavior": 11100, "Environment Tampering": 7900, "Evasion Signals": 4800 },
  { date: "Week 3", "Identity Reuse": 27200, "Network Masking": 21800, "Location Inconsistency": 16300, "Non-Human Behavior": 10400, "Environment Tampering": 7600, "Evasion Signals": 4600 },
  { date: "Week 4", "Identity Reuse": 27540, "Network Masking": 22220, "Location Inconsistency": 16950, "Non-Human Behavior": 10760, "Environment Tampering": 7900, "Evasion Signals": 4800 },
]

const CATEGORY_COLORS: Record<string, string> = {
  "Identity Reuse": "#6366f1",
  "Network Masking": "#0ea5e9",
  "Location Inconsistency": "#f59e0b",
  "Non-Human Behavior": "#8b5cf6",
  "Environment Tampering": "#64748b",
  "Evasion Signals": "#94a3b8",
}

// ─── HELPERS ───────────────────────────────────────────────────────────────────

const STRENGTH_DEFINITIONS: Record<string, string> = {
  Strong: "Multiple corroborating signals frequently co-occur in these sessions",
  Moderate: "One strong signal or several weaker signals contributed to these decisions",
  Weak: "Single signal with limited corroboration from other checks",
}

function strengthLabel(s: "strong" | "moderate" | "weak") {
  if (s === "strong") return { text: "Strong", color: "bg-red-100 text-red-700", definition: STRENGTH_DEFINITIONS.Strong }
  if (s === "moderate") return { text: "Moderate", color: "bg-amber-100 text-amber-700", definition: STRENGTH_DEFINITIONS.Moderate }
  return { text: "Weak", color: "bg-gray-100 text-gray-600", definition: STRENGTH_DEFINITIONS.Weak }
}

function InfoTip({ text, side = "top" }: { text: string; side?: "top" | "right" | "bottom" | "left" }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-4 w-4 text-muted-foreground cursor-help shrink-0" />
        </TooltipTrigger>
        <TooltipContent side={side} className="max-w-[300px] text-xs">
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Product-specific language
function useProductLabels(product: "api" | "link-protector") {
  if (product === "api") {
    return {
      goodLabel: "Labeled Good",
      suspiciousLabel: "Labeled Suspicious",
      badLabel: "Labeled Bad",
      goodShort: "Good",
      suspiciousShort: "Suspicious",
      badShort: "Bad",
      disclaimer: "Results are advisory. Enforcement decisions are made by you.",
      summaryVerb: "labeled",
    }
  }
  return {
    goodLabel: "Allowed",
    suspiciousLabel: "Reviewed",
    badLabel: "Blocked",
    goodShort: "Allowed",
    suspiciousShort: "Reviewed",
    badShort: "Blocked",
    disclaimer: "Actions are applied automatically based on your configuration.",
    summaryVerb: "classified",
  }
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function FraudDetectionPage() {
  const [selectedClient, setSelectedClient] = useState<string>("all")
  const [selectedProject, setSelectedProject] = useState<string>("all")
  const [clientOpen, setClientOpen] = useState(false)
  const [projectOpen, setProjectOpen] = useState(false)
  const [clientSearch, setClientSearch] = useState("")
  const [projectSearch, setProjectSearch] = useState("")
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [expandedSignal, setExpandedSignal] = useState<string | null>(null)
  const [product, setProduct] = useState<"api" | "link-protector">("api")

  const labels = useProductLabels(product)

  const availableProjects = React.useMemo(() => {
    if (!selectedClient || selectedClient === "all") return []
    const client = CLIENTS.find((c) => c.id === selectedClient)
    return client?.projects || []
  }, [selectedClient])

  React.useEffect(() => {
    setSelectedProject("all")
  }, [selectedClient])

  const sorted = [...FRAUD_CATEGORIES].sort((a, b) => b.badSessions - a.badSessions)

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* ── Header + Product Switch + Filters ─────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Fraud Detection</h1>
          <div className="inline-flex rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setProduct("api")}
              className={cn(
                "px-3.5 py-1.5 text-sm font-medium transition-colors",
                product === "api"
                  ? "bg-foreground text-background"
                  : "bg-background text-muted-foreground hover:text-foreground"
              )}
            >
              API
            </button>
            <button
              onClick={() => setProduct("link-protector")}
              className={cn(
                "px-3.5 py-1.5 text-sm font-medium transition-colors border-l border-border",
                product === "link-protector"
                  ? "bg-foreground text-background"
                  : "bg-background text-muted-foreground hover:text-foreground"
              )}
            >
              Link Protector
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Calendar className="h-4 w-4" />
            Last 30 days
          </Button>

          <Popover open={clientOpen} onOpenChange={setClientOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={clientOpen}
                className="w-[200px] justify-between bg-transparent"
              >
                {selectedClient && selectedClient !== "all"
                  ? CLIENTS.find((c) => c.id === selectedClient)?.name
                  : "All Clients"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="end">
              <Command>
                <CommandInput placeholder="Search clients..." value={clientSearch} onValueChange={setClientSearch} />
                <CommandList>
                  <CommandEmpty>No client found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem value="all" onSelect={() => { setSelectedClient("all"); setClientOpen(false) }}>
                      <Check className={cn("mr-2 h-4 w-4", selectedClient === "all" ? "opacity-100" : "opacity-0")} />
                      All Clients
                    </CommandItem>
                    {CLIENTS.map((client) => (
                      <CommandItem key={client.id} value={client.name} onSelect={() => { setSelectedClient(client.id); setClientOpen(false) }}>
                        <Check className={cn("mr-2 h-4 w-4", selectedClient === client.id ? "opacity-100" : "opacity-0")} />
                        {client.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <Popover open={projectOpen} onOpenChange={setProjectOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={projectOpen}
                className="w-[220px] justify-between bg-transparent"
                disabled={!selectedClient || selectedClient === "all"}
              >
                {selectedProject && selectedProject !== "all"
                  ? availableProjects.find((p) => p.id === selectedProject)?.name
                  : "All Projects"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[220px] p-0">
              <Command>
                <CommandInput placeholder="Search projects..." value={projectSearch} onValueChange={setProjectSearch} />
                <CommandList>
                  <CommandEmpty>No project found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem value="all" onSelect={() => { setSelectedProject("all"); setProjectOpen(false) }}>
                      <Check className={cn("mr-2 h-4 w-4", selectedProject === "all" ? "opacity-100" : "opacity-0")} />
                      All Projects
                    </CommandItem>
                    {availableProjects.map((p) => (
                      <CommandItem key={p.id} value={p.id} onSelect={(v) => { setSelectedProject(v === selectedProject ? "all" : v); setProjectOpen(false) }}>
                        <Check className={cn("mr-2 h-4 w-4", selectedProject === p.id ? "opacity-100" : "opacity-0")} />
                        {p.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <Button size="sm" variant="outline" className="gap-2 bg-transparent">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Product disclaimer */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border">
        <Info className="h-4 w-4 text-muted-foreground shrink-0" />
        <p className="text-xs text-muted-foreground">{labels.disclaimer}</p>
      </div>

      {/* ── 1. Outcome Summary ────────────────────────────────────── */}
      <Card className="border border-border shadow-sm">
        <CardContent className="pt-6 pb-5">
          <div className="flex items-center gap-2 mb-5">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Outcome Summary</span>
          </div>

          <div className="grid grid-cols-4 gap-6 mb-6">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Sessions Evaluated</div>
              <div className="text-4xl font-bold text-foreground">{totalSessions.toLocaleString()}</div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="text-sm text-muted-foreground">{labels.goodShort}</span>
              </div>
              <div className="text-3xl font-bold text-foreground">{goodCount.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">{((goodCount / totalSessions) * 100).toFixed(0)}% of total</div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                <span className="text-sm text-muted-foreground">{labels.suspiciousShort}</span>
              </div>
              <div className="text-3xl font-bold text-foreground">{suspiciousCount.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">{((suspiciousCount / totalSessions) * 100).toFixed(0)}% of total</div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                <span className="text-sm text-muted-foreground">{labels.badShort}</span>
              </div>
              <div className="text-3xl font-bold text-foreground">{badCount.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">{((badCount / totalSessions) * 100).toFixed(0)}% of total</div>
            </div>
          </div>

          <div className="w-full h-3 rounded-full overflow-hidden flex mb-3">
            <div className="bg-emerald-500 transition-all" style={{ width: `${(goodCount / totalSessions) * 100}%` }} />
            <div className="bg-amber-500 transition-all" style={{ width: `${(suspiciousCount / totalSessions) * 100}%` }} />
            <div className="bg-red-500 transition-all" style={{ width: `${(badCount / totalSessions) * 100}%` }} />
          </div>

          {/* Plain-English summary */}
          <div className="flex items-start gap-2 mt-4 p-3 bg-muted/50 rounded-lg">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground">
              Sessions were {labels.summaryVerb} {labels.badShort} primarily due to{" "}
              {sorted.slice(0, 2).map((c, i) => (
                <span key={c.id} className="font-medium text-foreground">
                  {c.name}{i === 0 ? " and " : ""}
                </span>
              ))}.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ── 2. Why Were Sessions Flagged? ─────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-lg font-semibold text-foreground">Why Were Sessions Flagged?</h2>
          <InfoTip
            text="Each category groups related signals that explain a decision. Percentages are relative to sessions labeled Bad, not total traffic. Categories are not additive."
            side="right"
          />
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Categories summarize behavior patterns. A session may appear in multiple categories.
        </p>

        <div className="grid gap-3">
          {FRAUD_CATEGORIES.map((category) => {
            const isExpanded = expandedCategory === category.id
            const pctOfBad = ((category.badSessions / badCount) * 100).toFixed(0)
            const sl = strengthLabel(category.strength)
            const Icon = category.icon
            const badSignals = category.signals.filter((s) => s.severity === "bad")
            const suspSignals = category.signals.filter((s) => s.severity === "suspicious")

            return (
              <Card
                key={category.id}
                className={cn(
                  "border transition-all cursor-pointer",
                  isExpanded ? "border-border shadow-md" : "border-border hover:border-gray-300"
                )}
              >
                <div className="p-5" onClick={() => setExpandedCategory(isExpanded ? null : category.id)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="h-10 w-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${CATEGORY_COLORS[category.name]}15` }}
                      >
                        <Icon className="h-5 w-5" style={{ color: CATEGORY_COLORS[category.name] }} />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{category.name}</div>
                        <div className="text-sm text-muted-foreground mt-0.5">
                          {category.badSessions.toLocaleString()} sessions affected
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-foreground">{pctOfBad}%</div>
                        <div className="text-xs text-muted-foreground">of {badCount.toLocaleString()} {labels.badShort.toLowerCase()} sessions</div>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium cursor-help", sl.color)}>
                              {sl.text}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-[240px] text-xs">
                            <p>{sl.definition}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <ChevronRight className={cn("h-5 w-5 text-muted-foreground transition-transform", isExpanded && "rotate-90")} />
                    </div>
                  </div>

                  <div className="mt-4 w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${Number(pctOfBad)}%`, backgroundColor: CATEGORY_COLORS[category.name] }}
                    />
                  </div>
                </div>

                {/* ── Category Drill-In ──────────────────────────────── */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-border">
                    <p className="text-sm text-muted-foreground mt-4 mb-5 leading-relaxed">{category.description}</p>

                    {/* Bad signals */}
                    {badSignals.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="h-2 w-2 rounded-full bg-red-500" />
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Bad Signals</span>
                          <InfoTip text="Signals that directly contributed to a Bad classification. Detection counts may exceed session counts when signals trigger across repeated attempts." />
                        </div>
                        <div className="space-y-2 pl-3 border-l-2 border-red-200">
                          {badSignals.map((signal) => {
                            const isSignalExpanded = expandedSignal === `${category.id}-${signal.name}`
                            return (
                              <div key={signal.name} className={cn("border rounded-lg transition-all", isSignalExpanded ? "border-border bg-muted/30" : "border-border")}>
                                <div
                                  className="flex items-center justify-between p-3 cursor-pointer"
                                  onClick={(e) => { e.stopPropagation(); setExpandedSignal(isSignalExpanded ? null : `${category.id}-${signal.name}`) }}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-red-500" />
                                    <span className="text-sm text-muted-foreground">{signal.name}</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="text-xs text-muted-foreground">{signal.fired.toLocaleString()} detections</span>
                                    <ChevronRight className={cn("h-4 w-4 text-muted-foreground transition-transform", isSignalExpanded && "rotate-90")} />
                                  </div>
                                </div>
                                {isSignalExpanded && (
                                  <div className="px-3 pb-3 pt-1 border-t border-border">
                                    <p className="text-xs text-muted-foreground">{signal.description}</p>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Suspicious signals */}
                    {suspSignals.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="h-2 w-2 rounded-full bg-amber-500" />
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Suspicious Signals</span>
                          <InfoTip text="Signals that indicate potentially suspicious behavior but are not conclusive on their own. They contribute to the overall category assessment." />
                        </div>
                        <div className="space-y-2 pl-3 border-l-2 border-amber-200">
                          {suspSignals.map((signal) => {
                            const isSignalExpanded = expandedSignal === `${category.id}-${signal.name}`
                            return (
                              <div key={signal.name} className={cn("border rounded-lg transition-all", isSignalExpanded ? "border-border bg-muted/30" : "border-border")}>
                                <div
                                  className="flex items-center justify-between p-3 cursor-pointer"
                                  onClick={(e) => { e.stopPropagation(); setExpandedSignal(isSignalExpanded ? null : `${category.id}-${signal.name}`) }}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-amber-500" />
                                    <span className="text-sm text-muted-foreground">{signal.name}</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="text-xs text-muted-foreground">{signal.fired.toLocaleString()} detections</span>
                                    <ChevronRight className={cn("h-4 w-4 text-muted-foreground transition-transform", isSignalExpanded && "rotate-90")} />
                                  </div>
                                </div>
                                {isSignalExpanded && (
                                  <div className="px-3 pb-3 pt-1 border-t border-border">
                                    <p className="text-xs text-muted-foreground">{signal.description}</p>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Co-occurrence insight */}
                    <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                      <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">Multiple signals frequently fired together in these sessions.</span>{" "}
                        {category.coOccurrence}
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </div>

      {/* ── 3. Category Trends ────────────────────────────────────── */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-semibold">Category Trends</CardTitle>
            <InfoTip text="Trends reflect category volume over time. An upward trend indicates more sessions flagged in this category, not necessarily increased severity." side="right" />
          </div>
          <p className="text-sm text-muted-foreground mt-1">Are these issues increasing or decreasing over time?</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--popover-foreground))",
                  fontSize: "13px",
                  padding: "8px 12px",
                }}
                cursor={{ fill: "hsl(var(--muted) / 0.3)" }}
              />
              {FRAUD_CATEGORIES.map((cat) => (
                <Bar key={cat.name} dataKey={cat.name} fill={CATEGORY_COLORS[cat.name]} radius={[4, 4, 0, 0]} stackId="a" />
              ))}
            </BarChart>
          </ResponsiveContainer>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
            {FRAUD_CATEGORIES.map((cat) => (
              <div key={cat.name} className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: CATEGORY_COLORS[cat.name] }} />
                <span className="text-xs text-muted-foreground">{cat.name}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-amber-500" />
                <span className="text-sm text-muted-foreground">Identity Reuse &mdash; Trending up</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-emerald-500" />
                <span className="text-sm text-muted-foreground">Location Inconsistency &mdash; Trending down</span>
              </div>
              <div className="flex items-center gap-2">
                <Minus className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Non-Human Behavior &mdash; Stable</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── 4. Geographic Context (Secondary) ─────────────────────── */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-semibold">Geographic Context</CardTitle>
            <InfoTip text="Where flagged sessions originated, grouped by category. Location alone does not determine a session's decision. Percentages are relative to the category, not total traffic." side="right" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm font-medium text-foreground mb-1">Identity Reuse by Region</div>
              <div className="text-xs text-muted-foreground mb-3">% of 112,340 identity reuse sessions</div>
              <div className="space-y-3">
                {[
                  { region: "North America", pct: 34, sessions: 38196 },
                  { region: "Southeast Asia", pct: 28, sessions: 31455 },
                  { region: "South America", pct: 18, sessions: 20221 },
                  { region: "Europe", pct: 12, sessions: 13481 },
                  { region: "Other", pct: 8, sessions: 8987 },
                ].map((item) => (
                  <div key={item.region}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-foreground">{item.region}</span>
                      <span className="text-xs text-muted-foreground">{item.pct}% &middot; {item.sessions.toLocaleString()} sessions</span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${item.pct}%`, backgroundColor: CATEGORY_COLORS["Identity Reuse"] }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-foreground mb-1">Network Masking by Region</div>
              <div className="text-xs text-muted-foreground mb-3">% of 89,420 network masking sessions</div>
              <div className="space-y-3">
                {[
                  { region: "Europe", pct: 31, sessions: 27720 },
                  { region: "North America", pct: 25, sessions: 22355 },
                  { region: "East Asia", pct: 22, sessions: 19672 },
                  { region: "South America", pct: 14, sessions: 12519 },
                  { region: "Other", pct: 8, sessions: 7154 },
                ].map((item) => (
                  <div key={item.region}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-foreground">{item.region}</span>
                      <span className="text-xs text-muted-foreground">{item.pct}% &middot; {item.sessions.toLocaleString()} sessions</span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${item.pct}%`, backgroundColor: CATEGORY_COLORS["Network Masking"] }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
