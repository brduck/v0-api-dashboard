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
  Fingerprint,
  Shield,
  Bot,
  MapPin,
  Eye,
  Layers,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Activity,
} from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"
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
const flaggedCount = suspiciousCount + badCount

const FRAUD_CATEGORIES = [
  {
    id: "identity-reuse",
    name: "Identity Reuse",
    description: "The same person, device, or network identity appears multiple times, indicating repeated or duplicate attempts.",
    badSessions: 112340,
    suspiciousSessions: 53120,
    strength: "strong" as const,
    icon: Fingerprint,
    signals: [
      { name: "isDuplicateDevice", severity: "bad" as const, fired: 175631, description: "Same device fingerprint seen across multiple sessions" },
      { name: "isDuplicateId", severity: "bad" as const, fired: 92163, description: "Same user identifier submitted more than once" },
      { name: "isDuplicateIp", severity: "bad" as const, fired: 198742, description: "Same IP address seen across multiple sessions" },
    ],
    coOccurrence: "isDuplicateIp and isDuplicateDevice fired together in 84% of these sessions",
  },
  {
    id: "location-inconsistency",
    name: "Location Inconsistency",
    description: "The person's reported location is internally inconsistent or implausible for normal human activity.",
    badSessions: 67150,
    suspiciousSessions: 28740,
    strength: "moderate" as const,
    icon: MapPin,
    signals: [
      { name: "isLocationInvalid", severity: "suspicious" as const, fired: 87521, description: "Reported location mismatched IP geolocation or timezone data" },
    ],
    coOccurrence: "60% were timezone mismatches; 40% were country-level mismatches",
  },
  {
    id: "network-masking",
    name: "Network Masking",
    description: "The person is obscuring their true network origin using anonymization or relay services.",
    badSessions: 89420,
    suspiciousSessions: 41230,
    strength: "strong" as const,
    icon: Shield,
    signals: [
      { name: "isVpnDetected", severity: "suspicious" as const, fired: 74329, description: "Traffic routed through a VPN or proxy service" },
      { name: "isTorDetected", severity: "suspicious" as const, fired: 21873, description: "Connection through the Tor anonymity network" },
    ],
    coOccurrence: "72% of VPN detections also triggered an isLocationInvalid flag",
  },
  {
    id: "non-human-behavior",
    name: "Non-Human Behavior",
    description: "The session shows signs of being driven by automation or software rather than a real human.",
    badSessions: 42860,
    suspiciousSessions: 12450,
    strength: "moderate" as const,
    icon: Bot,
    signals: [
      { name: "isAutomationDetected", severity: "bad" as const, fired: 18935, description: "Patterns consistent with scripted or automated interaction" },
      { name: "isHighActivityDevice", severity: "suspicious" as const, fired: 18542, description: "Device seen in an abnormally high number of sessions" },
    ],
    coOccurrence: "isAutomationDetected and isHighActivityDevice co-fired in 38% of flagged sessions",
  },
  {
    id: "environment-manipulation",
    name: "Environment Manipulation",
    description: "The person appears to be altering or restricting their device or browser environment to reduce traceability or interfere with detection.",
    badSessions: 31200,
    suspiciousSessions: 24860,
    strength: "weak" as const,
    icon: Eye,
    signals: [
      { name: "isDeviceTampered", severity: "suspicious" as const, fired: 62438, description: "Device fingerprint properties were altered or spoofed" },
      { name: "isVirtualMachine", severity: "suspicious" as const, fired: 54219, description: "Session originated from a virtualized environment" },
      { name: "isDevToolsOpened", severity: "suspicious" as const, fired: 43762, description: "Browser developer tools were active during the session" },
      { name: "isPrivacySettingsEnabled", severity: "suspicious" as const, fired: 38945, description: "Unusually restrictive privacy configuration detected" },
      { name: "isIncognito", severity: "suspicious" as const, fired: 15234, description: "Browsing in private or incognito mode" },
    ],
    coOccurrence: "isVirtualMachine + isDevToolsOpened co-occurred in 52% of these sessions",
  },
  {
    id: "behavioral-integrity",
    name: "Behavioral Integrity",
    description: "A human appears to be present, but their interaction patterns indicate low trust, low engagement, or manipulative behavior.",
    badSessions: 18900,
    suspiciousSessions: 15340,
    strength: "weak" as const,
    icon: Layers,
    signals: [
      { name: "AI Usage", severity: "bad" as const, fired: 5891, description: "Responses consistent with AI-generated text" },
      { name: "Quality Questions", severity: "bad" as const, fired: 7532, description: "Failed attention or quality screening checks" },
      { name: "Behavioral Signals", severity: "suspicious" as const, fired: 12480, description: "Interaction patterns indicate low engagement or manipulative behavior" },
    ],
    coOccurrence: "Privacy settings + Incognito mode appeared together in 61% of flagged sessions",
  },
]

const trendData = [
  { date: "Week 1", "Identity Reuse": 28100, "Location Inconsistency": 16700, "Network Masking": 22300, "Non-Human Behavior": 10600, "Environment Manipulation": 7800, "Behavioral Integrity": 4700 },
  { date: "Week 2", "Identity Reuse": 29500, "Location Inconsistency": 17200, "Network Masking": 23100, "Non-Human Behavior": 11100, "Environment Manipulation": 7900, "Behavioral Integrity": 4800 },
  { date: "Week 3", "Identity Reuse": 27200, "Location Inconsistency": 16300, "Network Masking": 21800, "Non-Human Behavior": 10400, "Environment Manipulation": 7600, "Behavioral Integrity": 4600 },
  { date: "Week 4", "Identity Reuse": 27540, "Location Inconsistency": 16950, "Network Masking": 22220, "Non-Human Behavior": 10760, "Environment Manipulation": 7900, "Behavioral Integrity": 4800 },
]

const CATEGORY_COLORS: Record<string, string> = {
  "Identity Reuse": "#ef4444",
  "Location Inconsistency": "#3b82f6",
  "Network Masking": "#f59e0b",
  "Non-Human Behavior": "#8b5cf6",
  "Environment Manipulation": "#64748b",
  "Behavioral Integrity": "#0d9488",
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

function useProductLabels(product: "api" | "link-protector") {
  if (product === "api") {
    return {
      goodLabel: "Labeled Good", suspiciousLabel: "Labeled Suspicious", badLabel: "Labeled Bad",
      goodShort: "Good", suspiciousShort: "Suspicious", badShort: "Bad",
      disclaimer: "Results are advisory. Enforcement decisions are made by you.",
      summaryVerb: "labeled",
    }
  }
  return {
    goodLabel: "Allowed", suspiciousLabel: "Reviewed", badLabel: "Blocked",
    goodShort: "Allowed", suspiciousShort: "Reviewed", badShort: "Blocked",
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

  React.useEffect(() => { setSelectedProject("all") }, [selectedClient])

  const sorted = [...FRAUD_CATEGORIES].sort((a, b) => (b.badSessions + b.suspiciousSessions) - (a.badSessions + a.suspiciousSessions))

  const goodPct = ((goodCount / totalSessions) * 100).toFixed(1)
  const suspPct = ((suspiciousCount / totalSessions) * 100).toFixed(1)
  const badPct = ((badCount / totalSessions) * 100).toFixed(1)

  const donutData = [
    { name: labels.goodShort, value: goodCount, fill: "#10b981" },
    { name: labels.suspiciousShort, value: suspiciousCount, fill: "#f59e0b" },
    { name: labels.badShort, value: badCount, fill: "#ef4444" },
  ]

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Fraud Detection</h1>
            <div className="inline-flex rounded-lg border border-border overflow-hidden mt-2">
              <button
                onClick={() => setProduct("api")}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium transition-colors",
                  product === "api" ? "bg-foreground text-background" : "bg-background text-muted-foreground hover:text-foreground"
                )}
              >
                API
              </button>
              <button
                onClick={() => setProduct("link-protector")}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium transition-colors border-l border-border",
                  product === "link-protector" ? "bg-foreground text-background" : "bg-background text-muted-foreground hover:text-foreground"
                )}
              >
                Link Protector
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent text-xs">
              <Calendar className="h-3.5 w-3.5" />
              Last 30 days
            </Button>

            <Popover open={clientOpen} onOpenChange={setClientOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={clientOpen} className="w-[180px] justify-between bg-transparent text-xs">
                  {selectedClient !== "all" ? CLIENTS.find((c) => c.id === selectedClient)?.name : "All Clients"}
                  <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-50" />
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
                <Button variant="outline" role="combobox" aria-expanded={projectOpen} className="w-[190px] justify-between bg-transparent text-xs" disabled={!selectedClient || selectedClient === "all"}>
                  {selectedProject !== "all" ? availableProjects.find((p) => p.id === selectedProject)?.name : "All Projects"}
                  <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-50" />
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

            <Button size="sm" variant="outline" className="gap-2 bg-transparent text-xs">
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* ── 1. Traffic Composition + Category Breakdown ────────── */}
        <div className="grid lg:grid-cols-5 gap-4">
          {/* Left: Donut + breakdown */}
          <Card className="lg:col-span-2 border border-border shadow-sm">
            <CardHeader className="pb-0">
              <CardTitle className="text-sm font-semibold">Traffic Composition</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <ResponsiveContainer width={160} height={160}>
                    <PieChart>
                      <Pie data={donutData} cx="50%" cy="50%" innerRadius={50} outerRadius={72} dataKey="value" strokeWidth={0}>
                        {donutData.map((entry) => (
                          <Cell key={entry.name} fill={entry.fill} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          color: "hsl(var(--popover-foreground))",
                          fontSize: "12px",
                          padding: "6px 10px",
                        }}
                        formatter={(value: number) => value.toLocaleString()}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex flex-col items-center cursor-default">
                            <span className="text-xs text-muted-foreground">Total</span>
                            <span className="text-lg font-bold text-foreground">{(totalSessions / 1000000).toFixed(1)}M</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="text-xs">
                          <p>{totalSessions.toLocaleString()} sessions</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  {donutData.map((entry) => {
                    const pct = ((entry.value / totalSessions) * 100).toFixed(1)
                    return (
                      <div key={entry.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.fill }} />
                          <span className="text-sm text-foreground">{entry.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-semibold text-foreground">{entry.value.toLocaleString()}</span>
                          <span className="text-xs text-muted-foreground ml-2">{pct}%</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Stacked progress bar */}
              <div className="mt-5 w-full h-2 rounded-full overflow-hidden flex">
                <div className="bg-emerald-500 transition-all" style={{ width: `${(goodCount / totalSessions) * 100}%` }} />
                <div className="bg-amber-500 transition-all" style={{ width: `${(suspiciousCount / totalSessions) * 100}%` }} />
                <div className="bg-red-500 transition-all" style={{ width: `${(badCount / totalSessions) * 100}%` }} />
              </div>

              {/* Summary */}
              <div className="mt-4 p-3 bg-muted/40 rounded-lg">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {flaggedCount.toLocaleString()} sessions flagged, primarily due to{" "}
                  <span className="font-medium text-foreground">{sorted[0].name}</span> and{" "}
                  <span className="font-medium text-foreground">{sorted[1].name}</span>.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Right: Top categories as detail list */}
          <Card className="lg:col-span-3 border border-border shadow-sm">
            <CardHeader className="pb-0">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-semibold">Top Fraud Categories</CardTitle>
                <InfoTip text="Categories summarize behavior patterns across flagged sessions. A session may appear in multiple categories. Categories are not additive." side="right" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {sorted.map((cat, idx) => {
                  const totalAffected = cat.badSessions + cat.suspiciousSessions
                  const pct = ((totalAffected / flaggedCount) * 100).toFixed(0)
                  return (
                    <div key={cat.id} className="flex items-center gap-4">
                      <span className="text-xs font-mono text-muted-foreground w-5">{idx + 1}</span>
                      <div className="h-3 w-3 rounded-sm shrink-0" style={{ backgroundColor: CATEGORY_COLORS[cat.name] }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-foreground truncate">{cat.name}</span>
                          <span className="text-sm font-semibold text-foreground ml-2">{totalAffected.toLocaleString()}</span>
                        </div>
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${Number(pct)}%`, backgroundColor: CATEGORY_COLORS[cat.name] }}
                          />
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground w-12 text-right">{pct}%</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── 3. Sessions Flagged (Drill-In) ───────────────────────── */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-base font-semibold text-foreground">Sessions Flagged</h2>
            <InfoTip text="Expand a category to see its severity breakdown and supporting signals. Percentages are relative to total flagged sessions." side="right" />
          </div>

          <div className="grid gap-3">
            {FRAUD_CATEGORIES.map((category) => {
              const isExpanded = expandedCategory === category.id
              const totalAffected = category.badSessions + category.suspiciousSessions
              const pctOfFlagged = ((totalAffected / flaggedCount) * 100).toFixed(0)
              const sl = strengthLabel(category.strength)
              const Icon = category.icon
              const badSignals = category.signals.filter((s) => s.severity === "bad")
              const suspSignals = category.signals.filter((s) => s.severity === "suspicious")

              return (
                <Card
                  key={category.id}
                  className={cn(
                    "border transition-all cursor-pointer",
                    isExpanded ? "shadow-md border-gray-300" : "hover:border-gray-300"
                  )}
                >
                  <div className="p-4" onClick={() => setExpandedCategory(isExpanded ? null : category.id)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-9 w-9 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${CATEGORY_COLORS[category.name]}12` }}
                        >
                          <Icon className="h-4 w-4" style={{ color: CATEGORY_COLORS[category.name] }} />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-foreground">{category.name}</div>
                          <div className="text-xs text-muted-foreground">{totalAffected.toLocaleString()} sessions</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-xl font-bold text-foreground">{pctOfFlagged}%</div>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium cursor-help", sl.color)}>{sl.text}</span>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-[240px] text-xs"><p>{sl.definition}</p></TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <ChevronRight className={cn("h-4 w-4 text-muted-foreground transition-transform", isExpanded && "rotate-90")} />
                      </div>
                    </div>

                    <div className="mt-3 w-full h-1 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${Number(pctOfFlagged)}%`, backgroundColor: CATEGORY_COLORS[category.name] }} />
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-border">
                      <p className="text-xs text-muted-foreground mt-3 mb-4 leading-relaxed">{category.description}</p>

                    {/* Signal presence breakdown */}
                    <div className="mb-4 p-3 bg-muted/30 rounded-lg">
                      <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Signals Observed in These Sessions</div>
                      <p className="text-[10px] text-muted-foreground mb-3">
                        {"Final session outcome is determined by the most severe signal. Suspicious signals may appear in sessions ultimately classified as Bad."}
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5">
                          <div className="h-2 w-2 rounded-full bg-red-500" />
                          <span className="text-sm font-semibold text-foreground">{category.badSessions.toLocaleString()}</span>
                          <span className="text-[10px] text-muted-foreground">{"Sessions with \u22651 Bad signal in this category"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="h-2 w-2 rounded-full bg-amber-500" />
                          <span className="text-sm font-semibold text-foreground">{category.suspiciousSessions.toLocaleString()}</span>
                          <span className="text-[10px] text-muted-foreground">{"Sessions with Suspicious signals in this category"}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground/70 italic pl-4">
                          {"(may also include Bad signals from this or other categories)"}
                        </p>
                      </div>
                      <div className="mt-3 w-full h-1.5 rounded-full overflow-hidden flex">
                        <div className="bg-red-500" style={{ width: `${(category.badSessions / totalAffected) * 100}%` }} />
                        <div className="bg-amber-500" style={{ width: `${(category.suspiciousSessions / totalAffected) * 100}%` }} />
                      </div>
                    </div>

                      {/* Bad signals */}
                      {badSignals.length > 0 && (
                        <div className="mb-3">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Bad Signals</span>
                          </div>
                          <div className="space-y-1.5 pl-3 border-l-2 border-red-200">
                            {badSignals.map((signal) => {
                              const isSigExp = expandedSignal === `${category.id}-${signal.name}`
                              return (
                                <div key={signal.name} className={cn("border rounded-lg transition-all", isSigExp && "bg-muted/30")}>
                                  <div className="flex items-center justify-between p-2.5 cursor-pointer" onClick={(e) => { e.stopPropagation(); setExpandedSignal(isSigExp ? null : `${category.id}-${signal.name}`) }}>
                                    <span className="text-xs text-muted-foreground">{signal.name}</span>
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] text-muted-foreground">{signal.fired.toLocaleString()}</span>
                                      <ChevronRight className={cn("h-3 w-3 text-muted-foreground transition-transform", isSigExp && "rotate-90")} />
                                    </div>
                                  </div>
                                  {isSigExp && <div className="px-2.5 pb-2.5 pt-0.5 border-t border-border"><p className="text-[11px] text-muted-foreground">{signal.description}</p></div>}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {/* Suspicious signals */}
                      {suspSignals.length > 0 && (
                        <div className="mb-3">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Suspicious Signals</span>
                          </div>
                          <div className="space-y-1.5 pl-3 border-l-2 border-amber-200">
                            {suspSignals.map((signal) => {
                              const isSigExp = expandedSignal === `${category.id}-${signal.name}`
                              return (
                                <div key={signal.name} className={cn("border rounded-lg transition-all", isSigExp && "bg-muted/30")}>
                                  <div className="flex items-center justify-between p-2.5 cursor-pointer" onClick={(e) => { e.stopPropagation(); setExpandedSignal(isSigExp ? null : `${category.id}-${signal.name}`) }}>
                                    <span className="text-xs text-muted-foreground">{signal.name}</span>
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] text-muted-foreground">{signal.fired.toLocaleString()}</span>
                                      <ChevronRight className={cn("h-3 w-3 text-muted-foreground transition-transform", isSigExp && "rotate-90")} />
                                    </div>
                                  </div>
                                  {isSigExp && <div className="px-2.5 pb-2.5 pt-0.5 border-t border-border"><p className="text-[11px] text-muted-foreground">{signal.description}</p></div>}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      <div className="p-2.5 bg-muted/40 rounded-lg">
                        <p className="text-[11px] text-muted-foreground">
                          <span className="font-medium text-foreground">Co-occurrence:</span> {category.coOccurrence}
                        </p>
                      </div>
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        </div>

        {/* ── 4. Category Trends ────────────────────────────────────── */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-semibold">Category Trends</CardTitle>
              <InfoTip text="Trends reflect category volume over time. An upward trend indicates more sessions flagged, not necessarily increased severity." side="right" />
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={trendData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--popover-foreground))",
                    fontSize: "11px",
                    padding: "6px 10px",
                  }}
                  cursor={{ fill: "hsl(var(--muted) / 0.3)" }}
                />
                {FRAUD_CATEGORIES.map((cat) => (
                  <Bar key={cat.name} dataKey={cat.name} fill={CATEGORY_COLORS[cat.name]} radius={[3, 3, 0, 0]} stackId="a" />
                ))}
              </BarChart>
            </ResponsiveContainer>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-3">
              {FRAUD_CATEGORIES.map((cat) => (
                <div key={cat.name} className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: CATEGORY_COLORS[cat.name] }} />
                  <span className="text-[10px] text-muted-foreground">{cat.name}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-border">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-amber-500" />
                <span className="text-xs text-muted-foreground">Identity Reuse</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingDown className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-xs text-muted-foreground">Location Inconsistency</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Minus className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Non-Human Behavior</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── 5. Geographic Context ─────────────────────────────────── */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-semibold">Geographic Context</CardTitle>
              <InfoTip text="Where flagged sessions originated, grouped by category. Location alone does not determine a session's decision." side="right" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
      title: "Identity Reuse by Region",
      subtitle: "% of 165,460 identity reuse sessions",
      color: CATEGORY_COLORS["Identity Reuse"],
                  regions: [
                    { region: "North America", pct: 34, sessions: 56256 },
                    { region: "Southeast Asia", pct: 28, sessions: 46329 },
                    { region: "South America", pct: 18, sessions: 29783 },
                    { region: "Europe", pct: 12, sessions: 19855 },
                    { region: "Other", pct: 8, sessions: 13237 },
                  ],
                },
                {
      title: "Network Masking by Region",
      subtitle: "% of 130,650 network masking sessions",
      color: CATEGORY_COLORS["Network Masking"],
                  regions: [
                    { region: "Europe", pct: 31, sessions: 40502 },
                    { region: "North America", pct: 25, sessions: 32663 },
                    { region: "East Asia", pct: 22, sessions: 28743 },
                    { region: "South America", pct: 14, sessions: 18291 },
                    { region: "Other", pct: 8, sessions: 10452 },
                  ],
                },
              ].map((section) => (
                <div key={section.title}>
                  <div className="text-sm font-medium text-foreground mb-0.5">{section.title}</div>
                  <div className="text-[10px] text-muted-foreground mb-3">{section.subtitle}</div>
                  <div className="space-y-2.5">
                    {section.regions.map((item) => (
                      <div key={item.region}>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs text-foreground">{item.region}</span>
                          <span className="text-[10px] text-muted-foreground">{item.pct}%</span>
                        </div>
                        <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${item.pct}%`, backgroundColor: section.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Product disclaimer */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border">
          <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <p className="text-[11px] text-muted-foreground">{labels.disclaimer}</p>
        </div>
      </div>
    </div>
  )
}
