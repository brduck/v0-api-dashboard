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
  Search,
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
    badParticipants: 165460,
    suspiciousParticipants: 0,
    strength: "strong" as const,
    icon: Fingerprint,
    signals: [
      { name: "Duplicate IP", severity: "bad" as const, participants: 148230, description: "Same IP address seen across multiple sessions" },
      { name: "Duplicate Device", severity: "bad" as const, participants: 131542, description: "Same device fingerprint seen across multiple sessions" },
      { name: "Duplicate ID", severity: "bad" as const, participants: 92163, description: "Same user identifier submitted more than once" },
    ],
    coOccurrence: "Duplicate IP and Duplicate Device fired together in 84% of these sessions",
  },
  {
    id: "location-inconsistency",
    name: "Location Inconsistency",
    description: "The person's reported location is internally inconsistent or implausible for normal human activity.",
    badParticipants: 0,
    suspiciousParticipants: 87521,
    strength: "moderate" as const,
    icon: MapPin,
    signals: [
      { name: "Location Validation", severity: "suspicious" as const, participants: 87521, description: "Reported location mismatched IP geolocation or timezone data" },
    ],
    coOccurrence: "60% were timezone mismatches; 40% were country-level mismatches",
  },
  {
    id: "network-masking",
    name: "Network Masking",
    description: "The person is obscuring their true network origin using anonymization or relay services.",
    badParticipants: 0,
    suspiciousParticipants: 82340,
    strength: "strong" as const,
    icon: Shield,
    signals: [
      { name: "VPN Usage", severity: "suspicious" as const, participants: 74329, description: "Traffic routed through a VPN or proxy service" },
      { name: "Tor Exit Node", severity: "suspicious" as const, participants: 21873, description: "Connection through the Tor anonymity network" },
    ],
    coOccurrence: "72% of VPN Usage detections also triggered a Location Validation flag",
  },
  {
    id: "non-human-behavior",
    name: "Non-Human Behavior",
    description: "The session shows signs of being driven by automation or software rather than a real human.",
    badParticipants: 18935,
    suspiciousParticipants: 12450,
    strength: "moderate" as const,
    icon: Bot,
    signals: [
      { name: "Automation Detection", severity: "bad" as const, participants: 18935, description: "Patterns consistent with scripted or automated interaction" },
      { name: "High-Activity Device", severity: "suspicious" as const, participants: 18542, description: "Device seen in an abnormally high number of sessions" },
    ],
    coOccurrence: "Automation Detection and High-Activity Device co-fired in 38% of flagged sessions",
  },
  {
    id: "environment-manipulation",
    name: "Environment Manipulation",
    description: "The person appears to be altering or restricting their device or browser environment to reduce traceability or interfere with detection.",
    badParticipants: 0,
    suspiciousParticipants: 56060,
    strength: "weak" as const,
    icon: Eye,
    signals: [
      { name: "Device Tampering", severity: "suspicious" as const, participants: 42310, description: "Device fingerprint properties were altered or spoofed" },
      { name: "Virtual Machine", severity: "suspicious" as const, participants: 38740, description: "Session originated from a virtualized environment" },
      { name: "Dev Tools", severity: "suspicious" as const, participants: 29180, description: "Browser developer tools were active during the session" },
      { name: "Privacy-Focused Settings", severity: "suspicious" as const, participants: 24630, description: "Unusually restrictive privacy configuration detected" },
      { name: "Incognito Mode", severity: "suspicious" as const, participants: 15234, description: "Browsing in private or incognito mode" },
    ],
    coOccurrence: "Virtual Machine + Dev Tools co-occurred in 52% of these sessions",
  },
  {
    id: "behavioral-integrity",
    name: "Behavioral Integrity",
    description: "A human appears to be present, but their interaction patterns indicate low trust, low engagement, or manipulative behavior.",
    badParticipants: 11240,
    suspiciousParticipants: 12480,
    strength: "weak" as const,
    icon: Layers,
    signals: [
      { name: "AI Detection", severity: "bad" as const, participants: 5891, description: "Responses consistent with AI-generated text" },
      { name: "Quality Questions", severity: "bad" as const, participants: 7532, description: "Failed attention or quality screening checks" },
      { name: "Untrusted Browsers/OS", severity: "suspicious" as const, participants: 12480, description: "Interaction patterns indicate low engagement or manipulative behavior" },
    ],
    coOccurrence: "AI Usage and Quality Questions co-occurred in 22% of flagged sessions in this category",
  },
]

// Aggregate all signals across categories, sorted by participants desc
const ALL_SIGNALS = FRAUD_CATEGORIES.flatMap((cat) =>
  cat.signals.map((sig) => ({
    name: sig.name,
    severity: sig.severity,
    participants: sig.participants,
    pct: Number(((sig.participants / totalSessions) * 100).toFixed(1)),
    category: cat.name,
  }))
).sort((a, b) => b.participants - a.participants)

const SIGNAL_COLORS: Record<string, string> = {
  "Duplicate IP": "#f46a6a",
  "Duplicate Device": "#e8806e",
  "Duplicate ID": "#f1b44c",
  "Location Validation": "#5b9bd5",
  "VPN Usage": "#8c7bc7",
  "Tor Exit Node": "#34c38f",
  "Automation Detection": "#f46a6a",
  "High-Activity Device": "#6ba3be",
  "Device Tampering": "#e8806e",
  "Virtual Machine": "#f1b44c",
  "Dev Tools": "#5b9bd5",
  "Privacy-Focused Settings": "#34c38f",
  "Incognito Mode": "#6ba3be",
  "AI Detection": "#f46a6a",
  "Quality Questions": "#f1b44c",
  "Untrusted Browsers/OS": "#5b9bd5",
}

// ─── TRAFFIC VOLUME DATA ──────────────────────────────────────────────────────

const WEEKLY_TRAFFIC = [
  { label: "Jan 6", bad: 24120, suspicious: 11340 },
  { label: "Jan 13", bad: 26450, suspicious: 12080 },
  { label: "Jan 20", bad: 31200, suspicious: 14520 },
  { label: "Jan 27", bad: 28930, suspicious: 13110 },
  { label: "Feb 3", bad: 33680, suspicious: 15870 },
  { label: "Feb 10", bad: 29540, suspicious: 13490 },
  { label: "Feb 17", bad: 35210, suspicious: 16740 },
  { label: "Feb 24", bad: 32650, suspicious: 14960 },
  { label: "Mar 3", bad: 38420, suspicious: 17230 },
  { label: "Mar 10", bad: 36180, suspicious: 16100 },
  { label: "Mar 17", bad: 41350, suspicious: 18640 },
  { label: "Mar 24", bad: 39870, suspicious: 17890 },
]

const MONTHLY_TRAFFIC = [
  { label: "Oct", bad: 82340, suspicious: 38210 },
  { label: "Nov", bad: 91560, suspicious: 42870 },
  { label: "Dec", bad: 105200, suspicious: 49310 },
  { label: "Jan", bad: 110700, suspicious: 51050 },
  { label: "Feb", bad: 131080, suspicious: 61060 },
  { label: "Mar", bad: 155820, suspicious: 69860 },
]

const CATEGORY_COLORS: Record<string, string> = {
  "Identity Reuse": "#f46a6a",
  "Location Inconsistency": "#5b9bd5",
  "Network Masking": "#f1b44c",
  "Non-Human Behavior": "#8c7bc7",
  "Environment Manipulation": "#6ba3be",
  "Behavioral Integrity": "#34c38f",
}

// ─── HELPERS ───────────────────────────────────────────────────────────────────

const STRENGTH_DEFINITIONS: Record<string, string> = {
  Strong: "Multiple corroborating checks frequently co-occur in these sessions",
  Moderate: "One strong check or several weaker checks contributed to these decisions",
  Weak: "Single check with limited corroboration from other checks",
}

function strengthLabel(s: "strong" | "moderate" | "weak") {
  if (s === "strong") return { text: "Strong", color: "bg-red-50 text-red-600", definition: STRENGTH_DEFINITIONS.Strong }
  if (s === "moderate") return { text: "Moderate", color: "bg-amber-50 text-amber-700", definition: STRENGTH_DEFINITIONS.Moderate }
  return { text: "Weak", color: "bg-gray-50 text-gray-500", definition: STRENGTH_DEFINITIONS.Weak }
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

const labels = {
  goodLabel: "Labeled Good", suspiciousLabel: "Labeled Suspicious", badLabel: "Labeled Bad",
  goodShort: "Good", suspiciousShort: "Suspicious", badShort: "Bad",
  disclaimer: "Results are advisory. Enforcement decisions are made by you.",
  summaryVerb: "labeled",
}

// ─── SESSION DETAILS SAMPLE DATA ─────────────────────────────────────────────

type CheckResult = "PASS" | "FAIL" | "EMPTY"

const SAMPLE_SESSIONS = [
  {
    visitorId: "21eaefbf-ca2f-33c8-3ad3-dac19aff3939",
    outcome: "good" as const,
    createdAt: "2026-02-06 14:00:07",
    checks: { "Location Validation": "PASS" as CheckResult, "Automation Detection": "PASS" as CheckResult, "Untrusted Browsers/OS": "PASS" as CheckResult, "Blocked IP": "PASS" as CheckResult, "Location Lock": "PASS" as CheckResult, "Duplicate Device": "PASS" as CheckResult, "Duplicate IP": "PASS" as CheckResult, "Duplicate ID": "PASS" as CheckResult, "VPN Usage": "PASS" as CheckResult, "Device Tampering": "PASS" as CheckResult, "Virtual Machine": "PASS" as CheckResult, "Dev Tools": "PASS" as CheckResult, "Privacy-Focused Settings": "PASS" as CheckResult, "Tor Exit Node": "PASS" as CheckResult, "High-Activity Device": "PASS" as CheckResult, "Incognito Mode": "PASS" as CheckResult, "AI Detection": "EMPTY" as CheckResult, "Quality Questions": "EMPTY" as CheckResult },
  },
  {
    visitorId: "4a72f5f8-292c-41d6-8cb4-24def0bfb258",
    outcome: "bad" as const,
    createdAt: "2026-02-06 14:00:36",
    checks: { "Location Validation": "PASS" as CheckResult, "Automation Detection": "FAIL" as CheckResult, "Untrusted Browsers/OS": "PASS" as CheckResult, "Blocked IP": "PASS" as CheckResult, "Location Lock": "PASS" as CheckResult, "Duplicate Device": "PASS" as CheckResult, "Duplicate IP": "PASS" as CheckResult, "Duplicate ID": "PASS" as CheckResult, "VPN Usage": "PASS" as CheckResult, "Device Tampering": "PASS" as CheckResult, "Virtual Machine": "PASS" as CheckResult, "Dev Tools": "PASS" as CheckResult, "Privacy-Focused Settings": "PASS" as CheckResult, "Tor Exit Node": "PASS" as CheckResult, "High-Activity Device": "PASS" as CheckResult, "Incognito Mode": "PASS" as CheckResult, "AI Detection": "EMPTY" as CheckResult, "Quality Questions": "EMPTY" as CheckResult },
  },
  {
    visitorId: "9f6e415e-ccd3-9d3b-be32-7445be8f3fdc",
    outcome: "good" as const,
    createdAt: "2026-02-06 14:01:04",
    checks: { "Location Validation": "PASS" as CheckResult, "Automation Detection": "PASS" as CheckResult, "Untrusted Browsers/OS": "PASS" as CheckResult, "Blocked IP": "PASS" as CheckResult, "Location Lock": "PASS" as CheckResult, "Duplicate Device": "PASS" as CheckResult, "Duplicate IP": "PASS" as CheckResult, "Duplicate ID": "PASS" as CheckResult, "VPN Usage": "PASS" as CheckResult, "Device Tampering": "PASS" as CheckResult, "Virtual Machine": "PASS" as CheckResult, "Dev Tools": "PASS" as CheckResult, "Privacy-Focused Settings": "PASS" as CheckResult, "Tor Exit Node": "PASS" as CheckResult, "High-Activity Device": "PASS" as CheckResult, "Incognito Mode": "PASS" as CheckResult, "AI Detection": "EMPTY" as CheckResult, "Quality Questions": "EMPTY" as CheckResult },
  },
  {
    visitorId: "53fe041c8984386916e220541cd934f0",
    outcome: "suspicious" as const,
    createdAt: "2026-02-06 14:01:27",
    checks: { "Location Validation": "PASS" as CheckResult, "Automation Detection": "PASS" as CheckResult, "Untrusted Browsers/OS": "PASS" as CheckResult, "Blocked IP": "PASS" as CheckResult, "Location Lock": "PASS" as CheckResult, "Duplicate Device": "PASS" as CheckResult, "Duplicate IP": "PASS" as CheckResult, "Duplicate ID": "PASS" as CheckResult, "VPN Usage": "PASS" as CheckResult, "Device Tampering": "PASS" as CheckResult, "Virtual Machine": "PASS" as CheckResult, "Dev Tools": "PASS" as CheckResult, "Privacy-Focused Settings": "PASS" as CheckResult, "Tor Exit Node": "FAIL" as CheckResult, "High-Activity Device": "PASS" as CheckResult, "Incognito Mode": "PASS" as CheckResult, "AI Detection": "EMPTY" as CheckResult, "Quality Questions": "EMPTY" as CheckResult },
  },
  {
    visitorId: "b8ddacf5eaeef7c47d227be3450a7282928a0cb2",
    outcome: "bad" as const,
    createdAt: "2026-02-06 14:02:03",
    checks: { "Location Validation": "FAIL" as CheckResult, "Automation Detection": "PASS" as CheckResult, "Untrusted Browsers/OS": "PASS" as CheckResult, "Blocked IP": "PASS" as CheckResult, "Location Lock": "PASS" as CheckResult, "Duplicate Device": "PASS" as CheckResult, "Duplicate IP": "FAIL" as CheckResult, "Duplicate ID": "PASS" as CheckResult, "VPN Usage": "PASS" as CheckResult, "Device Tampering": "PASS" as CheckResult, "Virtual Machine": "PASS" as CheckResult, "Dev Tools": "PASS" as CheckResult, "Privacy-Focused Settings": "PASS" as CheckResult, "Tor Exit Node": "PASS" as CheckResult, "High-Activity Device": "PASS" as CheckResult, "Incognito Mode": "PASS" as CheckResult, "AI Detection": "EMPTY" as CheckResult, "Quality Questions": "EMPTY" as CheckResult },
  },
  {
    visitorId: "2e87e720-86de-4506-574c-d2ac44837abc",
    outcome: "bad" as const,
    createdAt: "2026-02-06 14:02:04",
    checks: { "Location Validation": "PASS" as CheckResult, "Automation Detection": "FAIL" as CheckResult, "Untrusted Browsers/OS": "PASS" as CheckResult, "Blocked IP": "PASS" as CheckResult, "Location Lock": "PASS" as CheckResult, "Duplicate Device": "PASS" as CheckResult, "Duplicate IP": "FAIL" as CheckResult, "Duplicate ID": "PASS" as CheckResult, "VPN Usage": "PASS" as CheckResult, "Device Tampering": "PASS" as CheckResult, "Virtual Machine": "PASS" as CheckResult, "Dev Tools": "PASS" as CheckResult, "Privacy-Focused Settings": "PASS" as CheckResult, "Tor Exit Node": "PASS" as CheckResult, "High-Activity Device": "PASS" as CheckResult, "Incognito Mode": "PASS" as CheckResult, "AI Detection": "EMPTY" as CheckResult, "Quality Questions": "EMPTY" as CheckResult },
  },
  {
    visitorId: "0FfIE3Pgou5MdA",
    outcome: "good" as const,
    createdAt: "2026-02-06 14:02:10",
    checks: { "Location Validation": "PASS" as CheckResult, "Automation Detection": "PASS" as CheckResult, "Untrusted Browsers/OS": "PASS" as CheckResult, "Blocked IP": "PASS" as CheckResult, "Location Lock": "PASS" as CheckResult, "Duplicate Device": "PASS" as CheckResult, "Duplicate IP": "PASS" as CheckResult, "Duplicate ID": "PASS" as CheckResult, "VPN Usage": "PASS" as CheckResult, "Device Tampering": "PASS" as CheckResult, "Virtual Machine": "PASS" as CheckResult, "Dev Tools": "PASS" as CheckResult, "Privacy-Focused Settings": "PASS" as CheckResult, "Tor Exit Node": "PASS" as CheckResult, "High-Activity Device": "PASS" as CheckResult, "Incognito Mode": "PASS" as CheckResult, "AI Detection": "EMPTY" as CheckResult, "Quality Questions": "EMPTY" as CheckResult },
  },
  {
    visitorId: "04551dda-16f0-406d-a15e-f66dfa996a1f",
    outcome: "bad" as const,
    createdAt: "2026-02-06 14:02:17",
    checks: { "Location Validation": "PASS" as CheckResult, "Automation Detection": "PASS" as CheckResult, "Untrusted Browsers/OS": "PASS" as CheckResult, "Blocked IP": "PASS" as CheckResult, "Location Lock": "PASS" as CheckResult, "Duplicate Device": "FAIL" as CheckResult, "Duplicate IP": "PASS" as CheckResult, "Duplicate ID": "PASS" as CheckResult, "VPN Usage": "PASS" as CheckResult, "Device Tampering": "PASS" as CheckResult, "Virtual Machine": "PASS" as CheckResult, "Dev Tools": "PASS" as CheckResult, "Privacy-Focused Settings": "PASS" as CheckResult, "Tor Exit Node": "PASS" as CheckResult, "High-Activity Device": "PASS" as CheckResult, "Incognito Mode": "PASS" as CheckResult, "AI Detection": "EMPTY" as CheckResult, "Quality Questions": "EMPTY" as CheckResult },
  },
  {
    visitorId: "d97e8c60-7184-2f65-ae0c-b95548db99e2",
    outcome: "good" as const,
    createdAt: "2026-02-06 14:02:24",
    checks: { "Location Validation": "PASS" as CheckResult, "Automation Detection": "PASS" as CheckResult, "Untrusted Browsers/OS": "PASS" as CheckResult, "Blocked IP": "PASS" as CheckResult, "Location Lock": "PASS" as CheckResult, "Duplicate Device": "PASS" as CheckResult, "Duplicate IP": "PASS" as CheckResult, "Duplicate ID": "PASS" as CheckResult, "VPN Usage": "PASS" as CheckResult, "Device Tampering": "PASS" as CheckResult, "Virtual Machine": "PASS" as CheckResult, "Dev Tools": "PASS" as CheckResult, "Privacy-Focused Settings": "PASS" as CheckResult, "Tor Exit Node": "PASS" as CheckResult, "High-Activity Device": "PASS" as CheckResult, "Incognito Mode": "PASS" as CheckResult, "AI Detection": "EMPTY" as CheckResult, "Quality Questions": "EMPTY" as CheckResult },
  },
  {
    visitorId: "D8TSOflVevtcRw",
    outcome: "bad" as const,
    createdAt: "2026-02-06 14:02:33",
    checks: { "Location Validation": "PASS" as CheckResult, "Automation Detection": "PASS" as CheckResult, "Untrusted Browsers/OS": "FAIL" as CheckResult, "Blocked IP": "PASS" as CheckResult, "Location Lock": "PASS" as CheckResult, "Duplicate Device": "PASS" as CheckResult, "Duplicate IP": "PASS" as CheckResult, "Duplicate ID": "PASS" as CheckResult, "VPN Usage": "PASS" as CheckResult, "Device Tampering": "PASS" as CheckResult, "Virtual Machine": "PASS" as CheckResult, "Dev Tools": "PASS" as CheckResult, "Privacy-Focused Settings": "PASS" as CheckResult, "Tor Exit Node": "PASS" as CheckResult, "High-Activity Device": "PASS" as CheckResult, "Incognito Mode": "PASS" as CheckResult, "AI Detection": "EMPTY" as CheckResult, "Quality Questions": "EMPTY" as CheckResult },
  },
  {
    visitorId: "NlJ3ZJwgfGGfjw",
    outcome: "suspicious" as const,
    createdAt: "2026-02-06 14:03:15",
    checks: { "Location Validation": "PASS" as CheckResult, "Automation Detection": "PASS" as CheckResult, "Untrusted Browsers/OS": "PASS" as CheckResult, "Blocked IP": "PASS" as CheckResult, "Location Lock": "PASS" as CheckResult, "Duplicate Device": "PASS" as CheckResult, "Duplicate IP": "PASS" as CheckResult, "Duplicate ID": "PASS" as CheckResult, "VPN Usage": "FAIL" as CheckResult, "Device Tampering": "PASS" as CheckResult, "Virtual Machine": "PASS" as CheckResult, "Dev Tools": "PASS" as CheckResult, "Privacy-Focused Settings": "PASS" as CheckResult, "Tor Exit Node": "PASS" as CheckResult, "High-Activity Device": "PASS" as CheckResult, "Incognito Mode": "PASS" as CheckResult, "AI Detection": "EMPTY" as CheckResult, "Quality Questions": "EMPTY" as CheckResult },
  },
  {
    visitorId: "458d796098c0564cb161be3d2c831f898595f9bb",
    outcome: "good" as const,
    createdAt: "2026-02-06 14:03:18",
    checks: { "Location Validation": "PASS" as CheckResult, "Automation Detection": "PASS" as CheckResult, "Untrusted Browsers/OS": "PASS" as CheckResult, "Blocked IP": "PASS" as CheckResult, "Location Lock": "PASS" as CheckResult, "Duplicate Device": "PASS" as CheckResult, "Duplicate IP": "PASS" as CheckResult, "Duplicate ID": "PASS" as CheckResult, "VPN Usage": "PASS" as CheckResult, "Device Tampering": "PASS" as CheckResult, "Virtual Machine": "PASS" as CheckResult, "Dev Tools": "PASS" as CheckResult, "Privacy-Focused Settings": "PASS" as CheckResult, "Tor Exit Node": "PASS" as CheckResult, "High-Activity Device": "PASS" as CheckResult, "Incognito Mode": "PASS" as CheckResult, "AI Detection": "EMPTY" as CheckResult, "Quality Questions": "EMPTY" as CheckResult },
  },
]

const CHECK_KEYS = [
  "Location Validation", "Automation Detection", "Untrusted Browsers/OS", "Blocked IP",
  "Location Lock", "Duplicate Device", "Duplicate IP", "Duplicate ID",
  "VPN Usage", "Device Tampering", "Virtual Machine", "Dev Tools",
  "Privacy-Focused Settings", "Tor Exit Node", "High-Activity Device", "Incognito Mode",
  "AI Detection", "Quality Questions",
] as const

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
  const [view, setView] = useState<"overview" | "session-details">("overview")
  const [flaggedView, setFlaggedView] = useState<"categories" | "signals">("categories")
  const [trafficResolution, setTrafficResolution] = useState<"weekly" | "monthly">("weekly")
  const [sessionSearch, setSessionSearch] = useState("")
  const [scoreFilters, setScoreFilters] = useState<Set<string>>(new Set())
  const [checkFilter, setCheckFilter] = useState<string | null>(null)
  const [scoreDropdownOpen, setScoreDropdownOpen] = useState(false)
  const [checkDropdownOpen, setCheckDropdownOpen] = useState(false)

  const availableProjects = React.useMemo(() => {
    if (!selectedClient || selectedClient === "all") return []
    const client = CLIENTS.find((c) => c.id === selectedClient)
    return client?.projects || []
  }, [selectedClient])

  React.useEffect(() => { setSelectedProject("all") }, [selectedClient])

  const sorted = [...FRAUD_CATEGORIES].sort((a, b) => (b.badParticipants + b.suspiciousParticipants) - (a.badParticipants + a.suspiciousParticipants))

  const goodPct = ((goodCount / totalSessions) * 100).toFixed(1)
  const suspPct = ((suspiciousCount / totalSessions) * 100).toFixed(1)
  const badPct = ((badCount / totalSessions) * 100).toFixed(1)

  const donutData = [
    { name: labels.goodShort, value: goodCount, fill: "#34c38f" },
    { name: labels.suspiciousShort, value: suspiciousCount, fill: "#f1b44c" },
    { name: labels.badShort, value: badCount, fill: "#f46a6a" },
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
                onClick={() => setView("overview")}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium transition-colors",
                  view === "overview" ? "bg-foreground text-background" : "bg-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                Overview
              </button>
              <button
                onClick={() => setView("session-details")}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium transition-colors border-l border-border",
                  view === "session-details" ? "bg-foreground text-background" : "bg-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                Session Details
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

        {view === "overview" ? (
        <>
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
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xs text-muted-foreground">Total</span>
                    <span className="text-lg font-bold text-foreground">{totalSessions.toLocaleString()}</span>
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

              {/* Summary */}
              <div className="mt-4 p-3 bg-muted/40 rounded-lg">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {badCount.toLocaleString()} sessions classified as Bad. The most common explanations are{" "}
                  <span className="font-medium text-foreground">{sorted[0].name}</span> and{" "}
                  <span className="font-medium text-foreground">{sorted[1].name}</span>.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Right: Traffic volume bar chart */}
          <Card className="lg:col-span-3 border border-border shadow-sm">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Traffic Volume</CardTitle>
                <div className="inline-flex rounded-lg border border-border overflow-hidden">
                  <button
                    onClick={() => setTrafficResolution("weekly")}
                    className={cn(
                      "px-3 py-1 text-xs font-medium transition-colors",
                      trafficResolution === "weekly" ? "bg-foreground text-background" : "bg-transparent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Weekly
                  </button>
                  <button
                    onClick={() => setTrafficResolution("monthly")}
                    className={cn(
                      "px-3 py-1 text-xs font-medium transition-colors border-l border-border",
                      trafficResolution === "monthly" ? "bg-foreground text-background" : "bg-transparent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Monthly
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {(() => {
                const data = trafficResolution === "weekly" ? WEEKLY_TRAFFIC : MONTHLY_TRAFFIC
                const totalBad = data.reduce((s, d) => s + d.bad, 0)
                const totalSusp = data.reduce((s, d) => s + d.suspicious, 0)

                return (
                  <>
                    <div className="flex items-center gap-5 mb-4">
                      <div className="flex items-center gap-1.5">
                        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#f46a6a" }} />
                        <span className="text-xs text-muted-foreground">Bad</span>
                        <span className="text-xs font-semibold text-foreground ml-1">{totalBad.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#f1b44c" }} />
                        <span className="text-xs text-muted-foreground">Suspicious</span>
                        <span className="text-xs font-semibold text-foreground ml-1">{totalSusp.toLocaleString()}</span>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                        <XAxis
                          dataKey="label"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                          tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)}
                        />
                        <RechartsTooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--popover))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            color: "hsl(var(--popover-foreground))",
                            fontSize: "11px",
                            padding: "8px 12px",
                          }}
                          formatter={(value: number, name: string) => [
                            value.toLocaleString(),
                            name === "bad" ? "Bad" : "Suspicious",
                          ]}
                          cursor={{ fill: "hsl(var(--muted) / 0.3)" }}
                        />
                        <Bar dataKey="bad" fill="#f46a6a" radius={[3, 3, 0, 0]} stackId="stack" />
                        <Bar dataKey="suspicious" fill="#f1b44c" radius={[3, 3, 0, 0]} stackId="stack" />
                      </BarChart>
                    </ResponsiveContainer>
                  </>
                )
              })()}
            </CardContent>
          </Card>
        </div>

        {/* ── 3. Sessions Flagged ────────────────────────────────── */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-semibold">Sessions Flagged</CardTitle>
                <InfoTip text="Each participant has one final outcome (Bad or Suspicious) based on their highest-severity check. Bad and Suspicious counts within each category are mutually exclusive." side="right" />
              </div>
              <div className="inline-flex rounded-lg border border-border overflow-hidden">
                <button
                  onClick={() => setFlaggedView("categories")}
                  className={cn(
                    "px-3 py-1 text-xs font-medium transition-colors",
                    flaggedView === "categories" ? "bg-foreground text-background" : "bg-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  By Category
                </button>
                <button
                  onClick={() => setFlaggedView("signals")}
                  className={cn(
                    "px-3 py-1 text-xs font-medium transition-colors border-l border-border",
                    flaggedView === "signals" ? "bg-foreground text-background" : "bg-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  By Check
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent className={cn("pt-2", flaggedView === "categories" ? "px-0" : "px-6")}>
            {flaggedView === "categories" ? (
            <>
            {/* Column headers */}
            <div className="grid grid-cols-[minmax(140px,1.2fr)_minmax(120px,1.5fr)_minmax(100px,1.2fr)_80px_28px] items-center gap-4 px-6 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide border-b border-border">
              <span>Category</span>
              <span>Flagged Participants</span>
              <span>Checks</span>
              <span className="text-center">Strength</span>
              <span />
            </div>

            <div className="divide-y divide-border">
              {(() => {
                const maxFlagged = Math.max(...FRAUD_CATEGORIES.map((c) => c.badParticipants + c.suspiciousParticipants))

                return FRAUD_CATEGORIES.map((category) => {
                  const isExpanded = expandedCategory === category.id
                  const sl = strengthLabel(category.strength)
                  const Icon = category.icon
                  const badSignals = category.signals.filter((s) => s.severity === "bad")
                  const suspSignals = category.signals.filter((s) => s.severity === "suspicious")
                  const hasBad = category.badParticipants > 0
                  const hasSusp = category.suspiciousParticipants > 0
                  const totalFlagged = category.badParticipants + category.suspiciousParticipants
                  const barPct = (totalFlagged / maxFlagged) * 100

                  return (
                    <div key={category.id}>
                      {/* Row */}
                      <div
                        className={cn(
                          "grid grid-cols-[minmax(140px,1.2fr)_minmax(120px,1.5fr)_minmax(100px,1.2fr)_80px_28px] items-center gap-4 px-6 py-3 cursor-pointer transition-colors",
                          isExpanded ? "bg-muted/40" : "hover:bg-muted/20"
                        )}
                        onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                      >
                        {/* Category name */}
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className="h-7 w-7 rounded-md flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${CATEGORY_COLORS[category.name]}12` }}
                          >
                            <Icon className="h-3.5 w-3.5" style={{ color: CATEGORY_COLORS[category.name] }} />
                          </div>
                          <span className="text-sm font-medium text-foreground truncate">{category.name}</span>
                        </div>

                        {/* Progress bar + count */}
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${barPct}%`, backgroundColor: CATEGORY_COLORS[category.name] }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-foreground tabular-nums shrink-0">{totalFlagged.toLocaleString()}</span>
                        </div>

                          {/* Checks */}
                        <div className="flex items-center gap-1 flex-wrap min-w-0">
                          {category.signals.slice(0, 2).map((sig) => (
                            <span
                              key={sig.name}
                              className={cn(
                                "px-1.5 py-px rounded text-[9px] font-mono leading-tight",
                                sig.severity === "bad"
                                  ? "bg-red-50 text-red-600"
                                  : "bg-amber-50 text-amber-700"
                              )}
                            >
                              {sig.name}
                            </span>
                          ))}
                          {category.signals.length > 2 && (
                            <span className="text-[10px] text-muted-foreground shrink-0">+{category.signals.length - 2}</span>
                          )}
                        </div>

                        {/* Strength */}
                        <div className="flex justify-center">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium cursor-help", sl.color)}>{sl.text}</span>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-[240px] text-xs"><p>{sl.definition}</p></TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>

                        {/* Chevron */}
                        <ChevronRight className={cn("h-4 w-4 text-muted-foreground transition-transform shrink-0", isExpanded && "rotate-90")} />
                      </div>

                      {/* Expanded detail */}
                      {isExpanded && (() => {
                        // Validate: bad check participants should not exceed bad outcome count
                        const hasDataError = badSignals.some((s) => s.participants > category.badParticipants) ||
                          (badSignals.length === 0 && category.badParticipants > 0) ||
                          (suspSignals.length === 0 && category.suspiciousParticipants > 0)

                        return (
                          <div className="px-6 pb-5 pt-3 bg-muted/20 border-t border-border">
                            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{category.description}</p>

                            {/* Outcome counts -- mutually exclusive */}
                            <div className="mb-4 flex items-center gap-6">
                              {hasBad && (
                                <div className="flex items-center gap-1.5">
                                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: "#f46a6a" }} />
                                  <span className="text-sm font-semibold text-foreground">{category.badParticipants.toLocaleString()}</span>
                                  <span className="text-xs text-muted-foreground">Bad participants</span>
                                </div>
                              )}
                              {hasSusp && (
                                <div className="flex items-center gap-1.5">
                                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: "#f1b44c" }} />
                                  <span className="text-sm font-semibold text-foreground">{category.suspiciousParticipants.toLocaleString()}</span>
                                  <span className="text-xs text-muted-foreground">Suspicious-only participants</span>
                                </div>
                              )}
                            </div>

                            {hasDataError && (
                              <div className="mb-4 p-2.5 border border-red-100 bg-red-50 rounded-lg">
                                <p className="text-[11px] text-red-500 font-medium">Data error: Outcome counts are inconsistent with check severity rules for this category.</p>
                              </div>
                            )}

                            {/* Check breakdown table */}
                            <div className="mb-4">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Check Breakdown</span>
                                <InfoTip text="Each count represents distinct participants where this check fired. Counts may overlap across checks and do not represent final outcomes." side="right" />
                              </div>
                              <div className="rounded-lg border border-border overflow-hidden">
                                <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-3 py-1.5 bg-muted/50 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                                  <span>Check</span>
                                  <span className="text-right w-24">Participants</span>
                                  <span className="w-16 text-center">Severity</span>
                                </div>
                                {category.signals.map((signal) => (
                                  <div key={signal.name} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-3 py-2.5 border-t border-border">
                                    <div>
                                      <span className="text-xs font-mono text-foreground">{signal.name}</span>
                                      <p className="text-[10px] text-muted-foreground mt-0.5">{signal.description}</p>
                                    </div>
                                    <span className="text-xs font-semibold text-foreground text-right w-24">{signal.participants.toLocaleString()}</span>
                                    <span className={cn(
                                      "w-16 text-center text-[10px] font-medium px-2 py-0.5 rounded-full",
                                      signal.severity === "bad" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-700"
                                    )}>
                                      {signal.severity === "bad" ? "Bad" : "Suspicious"}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="p-2.5 bg-muted/40 rounded-lg">
                              <p className="text-[11px] text-muted-foreground">
                                <span className="font-medium text-foreground">Co-occurrence:</span> {category.coOccurrence}
                              </p>
                            </div>
                          </div>
                        )
                      })()}
                    </div>
                  )
                })
              })()}
            </div>
            </>
            ) : (
              <div className="rounded-lg border border-border overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-[minmax(0,1fr)_120px_80px] items-center gap-4 px-4 py-2 bg-muted/50">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Security Check</span>
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide text-center">Type</span>
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide text-right">Percentage</span>
                </div>
                {/* Rows */}
                <div className="divide-y divide-border">
                  {ALL_SIGNALS.map((sig) => (
                    <div key={sig.name} className="grid grid-cols-[minmax(0,1fr)_120px_80px] items-center gap-4 px-4 py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-3 w-3 rounded shrink-0" style={{ backgroundColor: SIGNAL_COLORS[sig.name] || "#94a3b8" }} />
                        <span className="text-sm font-medium text-foreground truncate">{sig.name}</span>
                      </div>
                      <div className="flex justify-center">
                        <span className={cn(
                          "px-2.5 py-0.5 rounded text-[10px] font-medium",
                          sig.severity === "bad" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-700"
                        )}>
                          {sig.severity === "bad" ? "Bad Check" : "Suspicious Check"}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-foreground text-right tabular-nums">{sig.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── 4. Geographic Context ─────────────────────────────────── */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-semibold">Geographic Context</CardTitle>
              <InfoTip text="Top countries where flagged participants originated, grouped by category. Location alone does not determine a participant's outcome." side="right" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "Identity Reuse by Country",
                  subtitle: "% of 165,460 identity reuse participants",
                  color: CATEGORY_COLORS["Identity Reuse"],
                  countries: [
                    { country: "United States", pct: 22, count: 36401 },
                    { country: "India", pct: 18, count: 29783 },
                    { country: "Brazil", pct: 14, count: 23164 },
                    { country: "Philippines", pct: 12, count: 19855 },
                    { country: "Vietnam", pct: 9, count: 14891 },
                    { country: "Indonesia", pct: 8, count: 13237 },
                    { country: "Other", pct: 17, count: 28129 },
                  ],
                },
                {
                  title: "Network Masking by Country",
                  subtitle: "% of 82,340 network masking participants",
                  color: CATEGORY_COLORS["Network Masking"],
                  countries: [
                    { country: "Germany", pct: 18, count: 14821 },
                    { country: "United States", pct: 16, count: 13174 },
                    { country: "Netherlands", pct: 13, count: 10704 },
                    { country: "Romania", pct: 11, count: 9057 },
                    { country: "Japan", pct: 10, count: 8234 },
                    { country: "United Kingdom", pct: 9, count: 7411 },
                    { country: "Other", pct: 23, count: 18938 },
                  ],
                },
              ].map((section) => (
                <div key={section.title}>
                  <div className="text-sm font-medium text-foreground mb-0.5">{section.title}</div>
                  <div className="text-[10px] text-muted-foreground mb-3">{section.subtitle}</div>
                  <div className="space-y-2.5">
                    {section.countries.map((item) => (
                      <div key={item.country}>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs text-foreground">{item.country}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-muted-foreground tabular-nums">{item.count.toLocaleString()}</span>
                            <span className="text-[10px] font-medium text-muted-foreground tabular-nums w-8 text-right">{item.pct}%</span>
                          </div>
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
        </>
        ) : (
        <>
        {/* ── SESSION DETAILS VIEW ────────────────────────────────── */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">Session Details</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">Raw check results per session. Each row represents a single participant evaluation.</p>
              </div>
            </div>

            {/* Search + Filter controls */}
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <div className="relative flex-1 max-w-sm min-w-[180px]">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search by Visitor ID..."
                  value={sessionSearch}
                  onChange={(e) => setSessionSearch(e.target.value)}
                  className="pl-8 h-8 text-xs"
                />
              </div>

              {/* Score multi-select dropdown */}
              <Popover open={scoreDropdownOpen} onOpenChange={setScoreDropdownOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 font-normal">
                    Score
                    {scoreFilters.size > 0 && (
                      <span className="ml-0.5 h-4 min-w-[16px] px-1 rounded bg-foreground text-background text-[10px] font-semibold flex items-center justify-center">{scoreFilters.size}</span>
                    )}
                    <ChevronsUpDown className="ml-1 h-3.5 w-3.5 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[180px] p-1" align="start">
                  {(["good", "suspicious", "bad"] as const).map((s) => {
                    const selected = scoreFilters.has(s)
                    return (
                      <button
                        key={s}
                        onClick={() => {
                          const next = new Set(scoreFilters)
                          if (selected) next.delete(s)
                          else next.add(s)
                          setScoreFilters(next)
                        }}
                        className="flex items-center gap-2 w-full px-2 py-1.5 rounded-sm text-xs hover:bg-muted transition-colors"
                      >
                        <div className={cn("h-3.5 w-3.5 rounded-sm border flex items-center justify-center", selected ? "bg-foreground border-foreground" : "border-input")}>
                          {selected && <Check className="h-2.5 w-2.5 text-background" />}
                        </div>
                        <span className={cn(
                          "font-medium",
                          s === "bad" && "text-red-600",
                          s === "suspicious" && "text-amber-600",
                          s === "good" && "text-emerald-600",
                        )}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </span>
                      </button>
                    )
                  })}
                  {scoreFilters.size > 0 && (
                    <>
                      <div className="my-1 border-t border-border" />
                      <button
                        onClick={() => setScoreFilters(new Set())}
                        className="flex items-center gap-2 w-full px-2 py-1.5 rounded-sm text-xs text-muted-foreground hover:bg-muted transition-colors"
                      >
                        Clear filters
                      </button>
                    </>
                  )}
                </PopoverContent>
              </Popover>

              {/* Failed check filter dropdown */}
              <Popover open={checkDropdownOpen} onOpenChange={setCheckDropdownOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 font-normal">
                    {checkFilter ? (
                      <span className="max-w-[160px] truncate">{checkFilter}</span>
                    ) : "Failed Check"}
                    <ChevronsUpDown className="ml-1 h-3.5 w-3.5 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[220px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search checks..." className="h-8 text-xs" />
                    <CommandList>
                      <CommandEmpty className="py-3 text-xs text-center text-muted-foreground">No checks found.</CommandEmpty>
                      <CommandGroup>
                        {CHECK_KEYS.map((key) => (
                          <CommandItem
                            key={key}
                            value={key}
                            onSelect={() => {
                              setCheckFilter(checkFilter === key ? null : key)
                              setCheckDropdownOpen(false)
                            }}
                            className="text-xs"
                          >
                            <Check className={cn("mr-2 h-3.5 w-3.5", checkFilter === key ? "opacity-100" : "opacity-0")} />
                            {key}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                  {checkFilter && (
                    <div className="p-1 border-t border-border">
                      <button
                        onClick={() => { setCheckFilter(null); setCheckDropdownOpen(false) }}
                        className="flex items-center gap-2 w-full px-2 py-1.5 rounded-sm text-xs text-muted-foreground hover:bg-muted transition-colors"
                      >
                        Clear filter
                      </button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {(() => {
              const filteredSessions = SAMPLE_SESSIONS.filter((session) => {
                const matchesSearch = sessionSearch === "" || session.visitorId.toLowerCase().includes(sessionSearch.toLowerCase())
                const matchesScore = scoreFilters.size === 0 || scoreFilters.has(session.outcome)
                const matchesCheck = !checkFilter || session.checks[checkFilter] === "FAIL"
                return matchesSearch && matchesScore && matchesCheck
              })

              return (
                <>
                  <div className="px-6 pb-2">
                    <span className="text-xs text-muted-foreground">Showing {filteredSessions.length} of {totalSessions.toLocaleString()} sessions</span>
                  </div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="text-[10px] font-semibold uppercase tracking-wide whitespace-nowrap sticky left-0 bg-background z-10 min-w-[180px]">Visitor ID</TableHead>
                          <TableHead className="text-[10px] font-semibold uppercase tracking-wide whitespace-nowrap min-w-[90px]">dtect Score</TableHead>
                          {CHECK_KEYS.map((key) => (
                            <TableHead key={key} className="text-[10px] font-semibold uppercase tracking-wide text-center whitespace-nowrap px-2.5 min-w-[75px]">{key}</TableHead>
                          ))}
                          <TableHead className="text-[10px] font-semibold uppercase tracking-wide whitespace-nowrap text-right min-w-[150px]">Created At</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredSessions.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={CHECK_KEYS.length + 3} className="text-center py-8 text-sm text-muted-foreground">
                              No sessions match your filters.
                            </TableCell>
                          </TableRow>
                        ) : filteredSessions.map((session) => (
                          <TableRow key={session.visitorId}>
                            <TableCell className="font-mono text-[11px] text-muted-foreground whitespace-nowrap sticky left-0 bg-background z-10">{session.visitorId}</TableCell>
                      <TableCell>
                        <span className={cn(
                          "text-[11px] font-medium",
                          session.outcome === "bad" && "text-red-600",
                          session.outcome === "suspicious" && "text-amber-600",
                          session.outcome === "good" && "text-emerald-600",
                        )}>
                          {session.outcome}
                        </span>
                      </TableCell>
                      {CHECK_KEYS.map((key) => {
                        const val = session.checks[key]
                        return (
                          <TableCell key={key} className="text-center px-2.5">
                            <span className={cn(
                              "text-[11px] font-medium",
                              val === "PASS" && "text-emerald-600",
                              val === "FAIL" && "text-red-500",
                              val === "EMPTY" && "text-muted-foreground/50",
                            )}>
                              {val}
                            </span>
                          </TableCell>
                        )
                      })}
                      <TableCell className="text-[11px] text-muted-foreground tabular-nums text-right whitespace-nowrap">{session.createdAt}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )
            })()}
          </CardContent>
        </Card>

        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border">
          <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <p className="text-[11px] text-muted-foreground">{labels.disclaimer}</p>
        </div>
        </>
        )}
      </div>
    </div>
  )
}
