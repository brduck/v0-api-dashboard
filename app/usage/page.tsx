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
  AlertTriangle,
  Copy,
  Monitor,
  Wifi,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  MapPinned,
  Download,
  X,
  PanelRightOpen,
  PanelRightClose,
  DollarSign,
  TrendingUp,
  Users,
  Target,
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
import { Checkbox } from "@/components/ui/checkbox"

import { cn } from "@/lib/utils"

// SHARED DATA

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
    coOccurrence: "Automation Detection and High-Activity Device co-fired in 38% of flagged sessions. This overlap is expected as both indicate non-human patterns.",
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

// TRAFFIC VOLUME DATA

const WEEKLY_TRAFFIC = [
  { label: "Jan 6", bad: 24120, suspicious: 11340, good: 78540 },
  { label: "Jan 13", bad: 26450, suspicious: 12080, good: 81230 },
  { label: "Jan 20", bad: 31200, suspicious: 14520, good: 84670 },
  { label: "Jan 27", bad: 28930, suspicious: 13110, good: 82410 },
  { label: "Feb 3", bad: 33680, suspicious: 15870, good: 87920 },
  { label: "Feb 10", bad: 29540, suspicious: 13490, good: 85340 },
  { label: "Feb 17", bad: 35210, suspicious: 16740, good: 89150 },
  { label: "Feb 24", bad: 32650, suspicious: 14960, good: 86780 },
  { label: "Mar 3", bad: 38420, suspicious: 17230, good: 91340 },
  { label: "Mar 10", bad: 36180, suspicious: 16100, good: 88960 },
  { label: "Mar 17", bad: 41350, suspicious: 18640, good: 93210 },
  { label: "Mar 24", bad: 39870, suspicious: 17890, good: 91958 },
]

const MONTHLY_TRAFFIC = [
  { label: "Oct", bad: 82340, suspicious: 38210, good: 245130 },
  { label: "Nov", bad: 91560, suspicious: 42870, good: 268450 },
  { label: "Dec", bad: 105200, suspicious: 49310, good: 289710 },
  { label: "Jan", bad: 110700, suspicious: 51050, good: 326850 },
  { label: "Feb", bad: 131080, suspicious: 61060, good: 349040 },
  { label: "Mar", bad: 155820, suspicious: 69860, good: 365328 },
]

const CATEGORY_COLORS: Record<string, string> = {
  "Identity Reuse": "#f46a6a",
  "Location Inconsistency": "#5b9bd5",
  "Network Masking": "#f1b44c",
  "Non-Human Behavior": "#8c7bc7",
  "Environment Manipulation": "#6ba3be",
  "Behavioral Integrity": "#34c38f",
}

// HELPERS

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
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-3.5 w-3.5 text-muted-foreground/50 hover:text-muted-foreground cursor-help transition-colors" />
        </TooltipTrigger>
        <TooltipContent side={side} className="max-w-xs text-xs">
          {text}
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

// LEAD-GEN CONFIG

const LEAD_SOURCES = ["Facebook Ads", "Google PPC", "Affiliate Network X", "Partner ABC", "Direct"] as const

// Marketing-friendly category labels
const LEAD_GEN_CATEGORY_LABELS: Record<string, string> = {
  "Network Masking": "Hidden Location",
  "Identity Reuse": "Repeat Submission",
  "Non-Human Behavior": "Bot Activity",
  "Environment Manipulation": "Suspicious Setup",
  "Location Inconsistency": "Location Mismatch",
  "Behavioral Integrity": "Unusual Behavior",
}

// Estimated cost per lead for different sources
const LEAD_COST_BY_SOURCE: Record<string, number> = {
  "Facebook Ads": 15,
  "Google PPC": 22,
  "Affiliate Network X": 18,
  "Partner ABC": 12,
  "Direct": 8,
}

// Summary stats
const LEAD_GEN_STATS = {
  leadsChecked: 1355345,
  leadsFlagged: 247892,
  fraudRate: 18.3,
  wastePrevented: 145230,
  topFraudSource: "Partner XYZ",
  topFraudSourceRate: 34,
}

// Source performance data
const SOURCE_PERFORMANCE = [
  { source: "Partner XYZ", leads: 45230, fraudRate: 34, waste: 48240 },
  { source: "Facebook Ads", leads: 89450, fraudRate: 12, waste: 19340 },
  { source: "Google PPC", leads: 125800, fraudRate: 8, waste: 12560 },
  { source: "Affiliate Network X", leads: 22100, fraudRate: 28, waste: 15090 },
  { source: "Direct", leads: 5400, fraudRate: 5, waste: 1200 },
]

// SESSION DETAILS SAMPLE DATA

type CheckResult = "PASS" | "FAIL" | "EMPTY"

interface SessionDetail {
  visitorId: string
  outcome: "good" | "suspicious" | "bad"
  createdAt: string
  categories: string[]
  checks: Record<string, CheckResult>
  source: typeof LEAD_SOURCES[number]
  leadCost: number
  location: {
    city: string
    country: string
    coords: string
    risk: "low" | "medium" | "high"
    ipTimezone: string
    browserTimezone: string
    offsetMinutes: number
    tzMismatch: boolean
    recentLocations24h: number
    recentLocations7d: number
  }
  network: {
    ip: string
    asn: string
    type: string
    typeRisk: "low" | "medium" | "high"
    proxy: string | null
    risk: "low" | "medium" | "high"
    firstSeen: string
    sessionsThisProject: number
    sessionsAllProjects: number
    projectsCount: number
    warning: string | null
  }
  device: {
    deviceId: string
    type: string
    os: string
    browser: string
    risk: "low" | "medium" | "high"
    firstSeen: string
    sessionsThisProject: number
    sessionsAllProjects: number
    projectsCount: number
    warning: string | null
    userAgent: string
  }
}

const SAMPLE_SESSIONS: SessionDetail[] = [
  {
    visitorId: "21eaefbf-ca2f-33c8-3ad3-dac19aff3939",
    outcome: "good",
    createdAt: "2026-02-06 14:00:07",
    categories: [],
    checks: { "Location Validation": "PASS", "Automation Detection": "PASS", "Untrusted Browsers/OS": "PASS", "Blocked IP": "PASS", "Location Lock": "PASS", "Duplicate Device": "PASS", "Duplicate IP": "PASS", "Duplicate ID": "PASS", "VPN Usage": "PASS", "Device Tampering": "PASS", "Virtual Machine": "PASS", "Dev Tools": "PASS", "Privacy-Focused Settings": "PASS", "Tor Exit Node": "PASS", "High-Activity Device": "PASS", "Incognito Mode": "PASS", "AI Detection": "EMPTY", "Quality Questions": "EMPTY" },
    source: "Facebook Ads",
    leadCost: 15,
    location: { city: "Austin, TX", country: "United States", coords: "30.2672, -97.7431", risk: "low", ipTimezone: "America/Chicago", browserTimezone: "America/Chicago", offsetMinutes: 0, tzMismatch: false, recentLocations24h: 1, recentLocations7d: 1 },
    network: { ip: "73.162.45.112", asn: "Comcast Cable", type: "Residential", typeRisk: "low", proxy: null, risk: "low", firstSeen: "Nov 12, 2025", sessionsThisProject: 1, sessionsAllProjects: 1, projectsCount: 1, warning: null },
    device: { deviceId: "dev_f3a912bc-x1", type: "Macintosh (Apple)", os: "macOS 15.2", browser: "Safari 18.1", risk: "low", firstSeen: "Jan 10, 2026", sessionsThisProject: 1, sessionsAllProjects: 2, projectsCount: 1, warning: null, userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15" },
  },
  {
    visitorId: "4a72f5f8-292c-41d6-8cb4-24def0bfb258",
    outcome: "bad",
    createdAt: "2026-02-06 14:00:36",
    categories: ["Non-Human Behavior"],
    checks: { "Location Validation": "PASS", "Automation Detection": "FAIL", "Untrusted Browsers/OS": "PASS", "Blocked IP": "PASS", "Location Lock": "PASS", "Duplicate Device": "PASS", "Duplicate IP": "PASS", "Duplicate ID": "PASS", "VPN Usage": "PASS", "Device Tampering": "PASS", "Virtual Machine": "PASS", "Dev Tools": "PASS", "Privacy-Focused Settings": "PASS", "Tor Exit Node": "PASS", "High-Activity Device": "PASS", "Incognito Mode": "PASS", "AI Detection": "EMPTY", "Quality Questions": "EMPTY" },
    source: "Affiliate Network X",
    leadCost: 18,
    location: { city: "Mumbai", country: "India", coords: "19.0760, 72.8777", risk: "low", ipTimezone: "Asia/Kolkata", browserTimezone: "Asia/Kolkata", offsetMinutes: 0, tzMismatch: false, recentLocations24h: 1, recentLocations7d: 2 },
    network: { ip: "49.36.128.91", asn: "Reliance Jio", type: "Mobile", typeRisk: "low", proxy: null, risk: "low", firstSeen: "Dec 20, 2025", sessionsThisProject: 3, sessionsAllProjects: 8, projectsCount: 3, warning: null },
    device: { deviceId: "dev_7bc412f9-m2", type: "Linux (Server)", os: "Ubuntu 22.04", browser: "Headless Chrome 120.0", risk: "high", firstSeen: "Jan 28, 2026", sessionsThisProject: 3, sessionsAllProjects: 47, projectsCount: 12, warning: "Headless browser pattern", userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/120.0.6099.109 Safari/537.36" },
  },
  {
    visitorId: "9f6e415e-ccd3-9d3b-be32-7445be8f3fdc",
    outcome: "good",
    createdAt: "2026-02-06 14:01:04",
    categories: [],
    checks: { "Location Validation": "PASS", "Automation Detection": "PASS", "Untrusted Browsers/OS": "PASS", "Blocked IP": "PASS", "Location Lock": "PASS", "Duplicate Device": "PASS", "Duplicate IP": "PASS", "Duplicate ID": "PASS", "VPN Usage": "PASS", "Device Tampering": "PASS", "Virtual Machine": "PASS", "Dev Tools": "PASS", "Privacy-Focused Settings": "PASS", "Tor Exit Node": "PASS", "High-Activity Device": "PASS", "Incognito Mode": "PASS", "AI Detection": "EMPTY", "Quality Questions": "EMPTY" },
    source: "Google PPC",
    leadCost: 22,
    location: { city: "London", country: "United Kingdom", coords: "51.5074, -0.1278", risk: "low", ipTimezone: "Europe/London", browserTimezone: "Europe/London", offsetMinutes: 0, tzMismatch: false, recentLocations24h: 1, recentLocations7d: 1 },
    network: { ip: "86.21.143.77", asn: "BT Group", type: "Residential", typeRisk: "low", proxy: null, risk: "low", firstSeen: "Oct 5, 2025", sessionsThisProject: 1, sessionsAllProjects: 1, projectsCount: 1, warning: null },
    device: { deviceId: "dev_a2c891de-w3", type: "Windows PC", os: "Windows 11", browser: "Chrome 131.0", risk: "low", firstSeen: "Feb 1, 2026", sessionsThisProject: 1, sessionsAllProjects: 1, projectsCount: 1, warning: null, userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36" },
  },
  {
    visitorId: "53fe041c8984386916e220541cd934f0",
    outcome: "suspicious",
    createdAt: "2026-02-06 14:01:27",
    categories: ["Network Masking"],
    checks: { "Location Validation": "PASS", "Automation Detection": "PASS", "Untrusted Browsers/OS": "PASS", "Blocked IP": "PASS", "Location Lock": "PASS", "Duplicate Device": "PASS", "Duplicate IP": "PASS", "Duplicate ID": "PASS", "VPN Usage": "PASS", "Device Tampering": "PASS", "Virtual Machine": "PASS", "Dev Tools": "PASS", "Privacy-Focused Settings": "PASS", "Tor Exit Node": "FAIL", "High-Activity Device": "PASS", "Incognito Mode": "PASS", "AI Detection": "EMPTY", "Quality Questions": "EMPTY" },
    source: "Partner ABC",
    leadCost: 12,
    location: { city: "Frankfurt", country: "Germany", coords: "50.1109, 8.6821", risk: "medium", ipTimezone: "Europe/Berlin", browserTimezone: "America/Sao_Paulo", offsetMinutes: 240, tzMismatch: true, recentLocations24h: 2, recentLocations7d: 5 },
    network: { ip: "185.220.101.34", asn: "Tor Exit Node", type: "Hosting", typeRisk: "high", proxy: "Tor detected", risk: "high", firstSeen: "Feb 6, 2026", sessionsThisProject: 1, sessionsAllProjects: 1, projectsCount: 1, warning: "Tor exit node" },
    device: { deviceId: "dev_c9d3e2f1-t4", type: "Linux PC", os: "Tails 6.0", browser: "Tor Browser 13.0", risk: "high", firstSeen: "Feb 6, 2026", sessionsThisProject: 1, sessionsAllProjects: 1, projectsCount: 1, warning: "Privacy-hardened OS", userAgent: "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0" },
  },
  {
    visitorId: "b8ddacf5eaeef7c47d227be3450a7282928a0cb2",
    outcome: "bad",
    createdAt: "2026-02-06 14:02:03",
    categories: ["Identity Reuse", "Location Inconsistency"],
    checks: { "Location Validation": "FAIL", "Automation Detection": "PASS", "Untrusted Browsers/OS": "PASS", "Blocked IP": "PASS", "Location Lock": "PASS", "Duplicate Device": "PASS", "Duplicate IP": "FAIL", "Duplicate ID": "PASS", "VPN Usage": "PASS", "Device Tampering": "PASS", "Virtual Machine": "PASS", "Dev Tools": "PASS", "Privacy-Focused Settings": "PASS", "Tor Exit Node": "PASS", "High-Activity Device": "PASS", "Incognito Mode": "PASS", "AI Detection": "EMPTY", "Quality Questions": "EMPTY" },
    source: "Affiliate Network X",
    leadCost: 18,
    location: { city: "Madrid", country: "Spain", coords: "40.4168, -3.7038", risk: "medium", ipTimezone: "Europe/Madrid", browserTimezone: "America/Sao_Paulo", offsetMinutes: 240, tzMismatch: true, recentLocations24h: 3, recentLocations7d: 12 },
    network: { ip: "185.15.22.1", asn: "M247 Ltd", type: "Hosting", typeRisk: "high", proxy: "VPN detected", risk: "high", firstSeen: "Dec 1, 2025", sessionsThisProject: 1, sessionsAllProjects: 15, projectsCount: 5, warning: "Duplicate IP across accounts" },
    device: { deviceId: "dev_8x92123-ax", type: "Macintosh (Apple)", os: "macOS 26.0.1", browser: "Chrome 143.0", risk: "high", firstSeen: "Jan 15, 2024", sessionsThisProject: 3, sessionsAllProjects: 450, projectsCount: 42, warning: "Professional attacker pattern", userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36" },
  },
  {
    visitorId: "2e87e720-86de-4506-574c-d2ac44837abc",
    outcome: "bad",
    createdAt: "2026-02-06 14:02:04",
    categories: ["Identity Reuse", "Non-Human Behavior"],
    checks: { "Location Validation": "PASS", "Automation Detection": "FAIL", "Untrusted Browsers/OS": "PASS", "Blocked IP": "PASS", "Location Lock": "PASS", "Duplicate Device": "PASS", "Duplicate IP": "FAIL", "Duplicate ID": "PASS", "VPN Usage": "PASS", "Device Tampering": "PASS", "Virtual Machine": "PASS", "Dev Tools": "PASS", "Privacy-Focused Settings": "PASS", "Tor Exit Node": "PASS", "High-Activity Device": "PASS", "Incognito Mode": "PASS", "AI Detection": "EMPTY", "Quality Questions": "EMPTY" },
    source: "Partner ABC",
    leadCost: 12,
    location: { city: "Sao Paulo", country: "Brazil", coords: "-23.5505, -46.6333", risk: "low", ipTimezone: "America/Sao_Paulo", browserTimezone: "America/Sao_Paulo", offsetMinutes: 0, tzMismatch: false, recentLocations24h: 1, recentLocations7d: 3 },
    network: { ip: "177.84.23.192", asn: "Vivo SA", type: "Residential", typeRisk: "low", proxy: null, risk: "medium", firstSeen: "Nov 3, 2025", sessionsThisProject: 5, sessionsAllProjects: 22, projectsCount: 8, warning: "Duplicate IP across accounts" },
    device: { deviceId: "dev_44bc9f21-s5", type: "Android Phone", os: "Android 15", browser: "Chrome Mobile 131.0", risk: "medium", firstSeen: "Dec 10, 2025", sessionsThisProject: 5, sessionsAllProjects: 22, projectsCount: 8, warning: "High session velocity", userAgent: "Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.39 Mobile Safari/537.36" },
  },
  {
    visitorId: "0FfIE3Pgou5MdA",
    outcome: "good",
    createdAt: "2026-02-06 14:02:10",
    categories: [],
    checks: { "Location Validation": "PASS", "Automation Detection": "PASS", "Untrusted Browsers/OS": "PASS", "Blocked IP": "PASS", "Location Lock": "PASS", "Duplicate Device": "PASS", "Duplicate IP": "PASS", "Duplicate ID": "PASS", "VPN Usage": "PASS", "Device Tampering": "PASS", "Virtual Machine": "PASS", "Dev Tools": "PASS", "Privacy-Focused Settings": "PASS", "Tor Exit Node": "PASS", "High-Activity Device": "PASS", "Incognito Mode": "PASS", "AI Detection": "EMPTY", "Quality Questions": "EMPTY" },
    source: "Google PPC",
    leadCost: 22,
    location: { city: "Tokyo", country: "Japan", coords: "35.6762, 139.6503", risk: "low", ipTimezone: "Asia/Tokyo", browserTimezone: "Asia/Tokyo", offsetMinutes: 0, tzMismatch: false, recentLocations24h: 1, recentLocations7d: 1 },
    network: { ip: "126.78.210.43", asn: "SoftBank Corp", type: "Residential", typeRisk: "low", proxy: null, risk: "low", firstSeen: "Sep 15, 2025", sessionsThisProject: 1, sessionsAllProjects: 1, projectsCount: 1, warning: null },
    device: { deviceId: "dev_e1d49a3c-j6", type: "iPhone (Apple)", os: "iOS 18.2", browser: "Safari Mobile 18.2", risk: "low", firstSeen: "Jan 20, 2026", sessionsThisProject: 1, sessionsAllProjects: 1, projectsCount: 1, warning: null, userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Mobile/15E148 Safari/604.1" },
  },
  {
    visitorId: "04551dda-16f0-406d-a15e-f66dfa996a1f",
    outcome: "bad",
    createdAt: "2026-02-06 14:02:17",
    categories: ["Identity Reuse"],
    checks: { "Location Validation": "PASS", "Automation Detection": "PASS", "Untrusted Browsers/OS": "PASS", "Blocked IP": "PASS", "Location Lock": "PASS", "Duplicate Device": "FAIL", "Duplicate IP": "PASS", "Duplicate ID": "PASS", "VPN Usage": "PASS", "Device Tampering": "PASS", "Virtual Machine": "PASS", "Dev Tools": "PASS", "Privacy-Focused Settings": "PASS", "Tor Exit Node": "PASS", "High-Activity Device": "PASS", "Incognito Mode": "PASS", "AI Detection": "EMPTY", "Quality Questions": "EMPTY" },
    source: "Facebook Ads",
    leadCost: 15,
    location: { city: "Manila", country: "Philippines", coords: "14.5995, 120.9842", risk: "low", ipTimezone: "Asia/Manila", browserTimezone: "Asia/Manila", offsetMinutes: 0, tzMismatch: false, recentLocations24h: 1, recentLocations7d: 2 },
    network: { ip: "112.198.77.45", asn: "Globe Telecom", type: "Mobile", typeRisk: "low", proxy: null, risk: "low", firstSeen: "Jan 5, 2026", sessionsThisProject: 2, sessionsAllProjects: 6, projectsCount: 3, warning: null },
    device: { deviceId: "dev_b3f28a71-p8", type: "Android Phone", os: "Android 14", browser: "Chrome Mobile 130.0", risk: "medium", firstSeen: "Dec 15, 2025", sessionsThisProject: 4, sessionsAllProjects: 18, projectsCount: 6, warning: "Duplicate device across accounts", userAgent: "Mozilla/5.0 (Linux; Android 14; SM-A546B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.58 Mobile Safari/537.36" },
  },
  {
    visitorId: "D8TSOflVevtcRw",
    outcome: "bad",
    createdAt: "2026-02-06 14:02:33",
    categories: ["Behavioral Integrity"],
    checks: { "Location Validation": "PASS", "Automation Detection": "PASS", "Untrusted Browsers/OS": "FAIL", "Blocked IP": "PASS", "Location Lock": "PASS", "Duplicate Device": "PASS", "Duplicate IP": "PASS", "Duplicate ID": "PASS", "VPN Usage": "PASS", "Device Tampering": "PASS", "Virtual Machine": "PASS", "Dev Tools": "PASS", "Privacy-Focused Settings": "PASS", "Tor Exit Node": "PASS", "High-Activity Device": "PASS", "Incognito Mode": "PASS", "AI Detection": "EMPTY", "Quality Questions": "EMPTY" },
    source: "Direct",
    leadCost: 8,
    location: { city: "Lagos", country: "Nigeria", coords: "6.5244, 3.3792", risk: "low", ipTimezone: "Africa/Lagos", browserTimezone: "Africa/Lagos", offsetMinutes: 0, tzMismatch: false, recentLocations24h: 1, recentLocations7d: 1 },
    network: { ip: "197.210.52.88", asn: "MTN Nigeria", type: "Mobile", typeRisk: "low", proxy: null, risk: "low", firstSeen: "Jan 30, 2026", sessionsThisProject: 1, sessionsAllProjects: 3, projectsCount: 2, warning: null },
    device: { deviceId: "dev_91ca7b3e-n9", type: "Android Phone", os: "Android 13", browser: "UC Browser 15.5", risk: "medium", firstSeen: "Feb 2, 2026", sessionsThisProject: 1, sessionsAllProjects: 3, projectsCount: 2, warning: "Untrusted browser", userAgent: "Mozilla/5.0 (Linux; U; Android 13; en-US; Infinix X6831) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 UCBrowser/15.5.6.46 Mobile Safari/534.30" },
  },
  {
    visitorId: "NlJ3ZJwgfGGfjw",
    outcome: "suspicious",
    createdAt: "2026-02-06 14:03:15",
    categories: ["Network Masking"],
    checks: { "Location Validation": "PASS", "Automation Detection": "PASS", "Untrusted Browsers/OS": "PASS", "Blocked IP": "PASS", "Location Lock": "PASS", "Duplicate Device": "PASS", "Duplicate IP": "PASS", "Duplicate ID": "PASS", "VPN Usage": "FAIL", "Device Tampering": "PASS", "Virtual Machine": "PASS", "Dev Tools": "PASS", "Privacy-Focused Settings": "PASS", "Tor Exit Node": "PASS", "High-Activity Device": "PASS", "Incognito Mode": "PASS", "AI Detection": "EMPTY", "Quality Questions": "EMPTY" },
    source: "Facebook Ads",
    leadCost: 15,
    location: { city: "Amsterdam", country: "Netherlands", coords: "52.3676, 4.9041", risk: "medium", ipTimezone: "Europe/Amsterdam", browserTimezone: "Asia/Kolkata", offsetMinutes: 270, tzMismatch: true, recentLocations24h: 2, recentLocations7d: 4 },
    network: { ip: "45.76.182.211", asn: "Vultr Holdings", type: "Hosting", typeRisk: "high", proxy: "VPN detected", risk: "high", firstSeen: "Feb 5, 2026", sessionsThisProject: 1, sessionsAllProjects: 4, projectsCount: 3, warning: "Datacenter IP" },
    device: { deviceId: "dev_d4e56f78-v0", type: "Windows PC", os: "Windows 11", browser: "Chrome 131.0", risk: "low", firstSeen: "Feb 5, 2026", sessionsThisProject: 1, sessionsAllProjects: 4, projectsCount: 3, warning: null, userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36" },
  },
]

const CHECK_KEYS = [
  "Location Validation", "Automation Detection", "Untrusted Browsers/OS", "Blocked IP",
  "Location Lock", "Duplicate Device", "Duplicate IP", "Duplicate ID",
  "VPN Usage", "Device Tampering", "Virtual Machine", "Dev Tools",
  "Privacy-Focused Settings", "Tor Exit Node", "High-Activity Device", "Incognito Mode",
  "AI Detection", "Quality Questions",
] as const

const BAD_SIGNALS = new Set([
  "Location Lock", "Duplicate Device", "Duplicate IP", "Duplicate ID",
  "Automation Detection", "Untrusted Browsers/OS", "Blocked IP",
  "AI Detection", "Quality Questions",
])

const SUSPICIOUS_SIGNALS = new Set([
  "Location Validation", "VPN Usage", "Device Tampering", "Virtual Machine",
  "Dev Tools", "Privacy-Focused Settings", "Tor Exit Node",
  "High-Activity Device", "Incognito Mode",
])

function computeOutcome(checks: Record<string, CheckResult>): "good" | "suspicious" | "bad" {
  let hasSuspicious = false
  for (const [key, value] of Object.entries(checks)) {
    if (value !== "FAIL") continue
    if (BAD_SIGNALS.has(key)) return "bad"
    if (SUSPICIOUS_SIGNALS.has(key)) hasSuspicious = true
  }
  return hasSuspicious ? "suspicious" : "good"
}

// COMPONENT

export default function FraudDetectionPage() {
  const [selectedClient, setSelectedClient] = useState<string>("all")
  const [selectedProject, setSelectedProject] = useState<string>("all")
  const [clientOpen, setClientOpen] = useState(false)
  const [projectOpen, setProjectOpen] = useState(false)
  const [clientSearch, setClientSearch] = useState("")
  const [projectSearch, setProjectSearch] = useState("")
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [expandedSignal, setExpandedSignal] = useState<string | null>(null)
  const [expandedSession, setExpandedSession] = useState<string | null>(null)
  const [view, setView] = useState<"overview" | "session-details">("overview")
  const [flaggedView, setFlaggedView] = useState<"categories" | "signals" | "sources">("categories")
  const [trafficResolution, setTrafficResolution] = useState<"weekly" | "monthly">("weekly")
  const [showGoodInTraffic, setShowGoodInTraffic] = useState(false)
  const [sessionSearch, setSessionSearch] = useState("")
  const [scoreFilters, setScoreFilters] = useState<Set<string>>(new Set())
  const [checkFilters, setCheckFilters] = useState<Set<string>>(new Set())
  const [scoreDropdownOpen, setScoreDropdownOpen] = useState(false)
  const [checkDropdownOpen, setCheckDropdownOpen] = useState(false)
  const [categoryFilters, setCategoryFilters] = useState<Set<string>>(new Set())
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
  const [selectedSession, setSelectedSession] = useState<string | null>(null)
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [sortCol, setSortCol] = useState<"visitorId" | "outcome" | "country" | "city" | "createdAt" | "source" | "costSaved">("createdAt")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
  const tableRef = React.useRef<HTMLDivElement>(null)

  const [sourceFilters, setSourceFilters] = useState<Set<string>>(new Set())
  const [sourceDropdownOpen, setSourceDropdownOpen] = useState(false)

  // Helper to get category label (always use Lead-Gen friendly labels)
  const getCategoryLabel = (category: string) => {
    if (LEAD_GEN_CATEGORY_LABELS[category]) {
      return LEAD_GEN_CATEGORY_LABELS[category]
    }
    return category
  }

  // Session filtering, sorting, keyboard nav
  const availableProjects = React.useMemo(() => {
    if (selectedClient === "all") return CLIENTS.flatMap((c) => c.projects)
    const client = CLIENTS.find((c) => c.id === selectedClient)
    return client ? client.projects : []
  }, [selectedClient])

  React.useEffect(() => {
    if (selectedClient !== "all" && selectedProject !== "all") {
      const valid = availableProjects.some((p) => p.id === selectedProject)
      if (!valid) setSelectedProject("all")
    }
  }, [selectedClient, availableProjects, selectedProject])

  const filteredSessions = React.useMemo(() => {
    let sessions = SAMPLE_SESSIONS.filter((session) => {
      const matchesSearch = sessionSearch === "" || session.visitorId.toLowerCase().includes(sessionSearch.toLowerCase())
      const matchesScore = scoreFilters.size === 0 || scoreFilters.has(computeOutcome(session.checks))
      const matchesCheck = checkFilters.size === 0 || Array.from(checkFilters).every((key) => session.checks[key] === "FAIL")
      const matchesCategory = categoryFilters.size === 0 || session.categories.some((cat) => categoryFilters.has(cat))
      const matchesSource = sourceFilters.size === 0 || sourceFilters.has(session.source)
      return matchesSearch && matchesScore && matchesCheck && matchesCategory && matchesSource
    })
    const scoreOrder: Record<string, number> = { good: 0, suspicious: 1, bad: 2 }
    sessions.sort((a, b) => {
      let cmp = 0
      switch (sortCol) {
        case "visitorId": cmp = a.visitorId.localeCompare(b.visitorId); break
        case "outcome": cmp = scoreOrder[computeOutcome(a.checks)] - scoreOrder[computeOutcome(b.checks)]; break
        case "country": cmp = a.location.country.localeCompare(b.location.country); break
        case "city": cmp = a.location.city.localeCompare(b.location.city); break
        case "createdAt": cmp = a.createdAt.localeCompare(b.createdAt); break
        case "source": cmp = a.source.localeCompare(b.source); break
        case "costSaved": cmp = a.leadCost - b.leadCost; break
      }
      return sortDir === "asc" ? cmp : -cmp
    })
    return sessions
  }, [sessionSearch, scoreFilters, checkFilters, categoryFilters, sourceFilters, sortCol, sortDir])

  const toggleSort = (col: typeof sortCol) => {
    if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    else { setSortCol(col); setSortDir("asc") }
  }

  const SortIcon = ({ col }: { col: typeof sortCol }) => {
    if (sortCol !== col) return <ArrowUpDown className="h-3 w-3 opacity-30" />
    return sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
  }

  const toggleRowSelection = (id: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAllRows = () => {
    if (selectedRows.size === filteredSessions.length) setSelectedRows(new Set())
    else setSelectedRows(new Set(filteredSessions.map((s) => s.visitorId)))
  }

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
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Quality Overview</h1>
            <p className="text-sm text-muted-foreground mt-1">Lead-Gen / Affiliate</p>

            {/* View tabs */}
            <div className="inline-flex rounded-lg border border-border overflow-hidden mt-3">
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
                Lead Details
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Select defaultValue="30days">
              <SelectTrigger className="w-[140px] h-8 text-xs bg-transparent">
                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="campaign">This Campaign</SelectItem>
              </SelectContent>
            </Select>

            <Popover open={clientOpen} onOpenChange={setClientOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" role="combobox" aria-expanded={clientOpen} className="w-[160px] justify-between font-normal text-xs bg-transparent h-8">
                  {selectedClient === "all" ? "All Clients" : CLIENTS.find((c) => c.id === selectedClient)?.name}
                  <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[220px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search clients..." value={clientSearch} onValueChange={setClientSearch} className="text-xs" />
                  <CommandList>
                    <CommandEmpty>No clients found.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem value="all" onSelect={() => { setSelectedClient("all"); setClientOpen(false) }} className="text-xs">
                        <Check className={cn("mr-2 h-3.5 w-3.5", selectedClient === "all" ? "opacity-100" : "opacity-0")} />
                        All Clients
                      </CommandItem>
                      {CLIENTS.filter((c) => c.name.toLowerCase().includes(clientSearch.toLowerCase())).map((client) => (
                        <CommandItem key={client.id} value={client.id} onSelect={() => { setSelectedClient(client.id); setClientOpen(false) }} className="text-xs">
                          <Check className={cn("mr-2 h-3.5 w-3.5", selectedClient === client.id ? "opacity-100" : "opacity-0")} />
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
                <Button variant="outline" size="sm" role="combobox" aria-expanded={projectOpen} className="w-[160px] justify-between font-normal text-xs bg-transparent h-8">
                  {selectedProject === "all" ? "All Projects" : availableProjects.find((p) => p.id === selectedProject)?.name}
                  <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[220px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search projects..." value={projectSearch} onValueChange={setProjectSearch} className="text-xs" />
                  <CommandList>
                    <CommandEmpty>No projects found.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem value="all" onSelect={() => { setSelectedProject("all"); setProjectOpen(false) }} className="text-xs">
                        <Check className={cn("mr-2 h-3.5 w-3.5", selectedProject === "all" ? "opacity-100" : "opacity-0")} />
                        All Projects
                      </CommandItem>
                      {availableProjects.filter((p) => p.name.toLowerCase().includes(projectSearch.toLowerCase())).map((project) => (
                        <CommandItem key={project.id} value={project.id} onSelect={() => { setSelectedProject(project.id); setProjectOpen(false) }} className="text-xs">
                          <Check className={cn("mr-2 h-3.5 w-3.5", selectedProject === project.id ? "opacity-100" : "opacity-0")} />
                          {project.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <Button variant="outline" size="sm" className="gap-2 bg-transparent h-8">
              <RefreshCw className="h-3.5 w-3.5" />
              <span className="text-xs">Refresh</span>
            </Button>
          </div>
        </div>
      </div>

      {view === "overview" ? (
        <>
          {/* Lead-Gen Summary Stats Bar */}
          <Card className="border border-border shadow-sm bg-gradient-to-r from-emerald-50/50 to-background">
            <CardContent className="py-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Last 30 Days</p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-lg font-bold text-foreground">{LEAD_GEN_STATS.leadsChecked.toLocaleString()}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">leads checked</p>
                  </div>

                  <div className="h-8 w-px bg-border" />

                  <div className="text-center">
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                      <span className="text-lg font-bold text-foreground">{LEAD_GEN_STATS.leadsFlagged.toLocaleString()}</span>
                      <span className="text-xs text-amber-600 font-medium">({LEAD_GEN_STATS.fraudRate}%)</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">flagged (fraud rate)</p>
                  </div>

                  <div className="h-8 w-px bg-border" />

                  <div className="text-center">
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-lg font-bold text-emerald-600">${LEAD_GEN_STATS.wastePrevented.toLocaleString()}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">waste prevented</p>
                  </div>

                  <div className="h-8 w-px bg-border" />

                  <div className="text-center">
                    <div className="flex items-center gap-1.5">
                      <Target className="h-3.5 w-3.5 text-red-500" />
                      <span className="text-sm font-semibold text-foreground">{LEAD_GEN_STATS.topFraudSource}</span>
                      <span className="text-xs text-red-600 font-medium">({LEAD_GEN_STATS.topFraudSourceRate}% fraud)</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">top fraud source</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 1. Traffic Composition + Category Breakdown */}
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Traffic Composition */}
            <Card className="lg:col-span-2 border border-border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  Traffic Composition
                  <InfoTip text={labels.disclaimer} />
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-6">
                  <div className="relative w-[140px] h-[140px] flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={donutData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={65} strokeWidth={0} paddingAngle={1}>
                          {donutData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-lg font-bold text-foreground">{totalSessions.toLocaleString()}</span>
                      <span className="text-[10px] text-muted-foreground">Total</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#34c38f]" />
                        <span className="text-xs text-muted-foreground">{labels.goodShort}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-foreground">{goodCount.toLocaleString()}</span>
                        <span className="text-[10px] text-muted-foreground ml-1.5">({goodPct}%)</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#f1b44c]" />
                        <span className="text-xs text-muted-foreground">{labels.suspiciousShort}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-foreground">{suspiciousCount.toLocaleString()}</span>
                        <span className="text-[10px] text-muted-foreground ml-1.5">({suspPct}%)</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#f46a6a]" />
                        <span className="text-xs text-muted-foreground">{labels.badShort}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-foreground">{badCount.toLocaleString()}</span>
                        <span className="text-[10px] text-muted-foreground ml-1.5">({badPct}%)</span>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">Total Flagged</span>
                        <span className="text-sm font-bold text-foreground">{flaggedCount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Traffic Volume Over Time */}
            <Card className="lg:col-span-3 border border-border shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">Traffic Volume Over Time</CardTitle>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground cursor-pointer">
                      <Checkbox checked={showGoodInTraffic} onCheckedChange={(c) => setShowGoodInTraffic(!!c)} className="h-3.5 w-3.5" />
                      Show Good
                    </label>
                    <div className="inline-flex rounded-lg border border-border overflow-hidden">
                      <button onClick={() => setTrafficResolution("weekly")} className={cn("px-2 py-1 text-[10px] font-medium transition-colors", trafficResolution === "weekly" ? "bg-foreground text-background" : "bg-transparent text-muted-foreground hover:text-foreground")}>Weekly</button>
                      <button onClick={() => setTrafficResolution("monthly")} className={cn("px-2 py-1 text-[10px] font-medium transition-colors border-l border-border", trafficResolution === "monthly" ? "bg-foreground text-background" : "bg-transparent text-muted-foreground hover:text-foreground")}>Monthly</button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[160px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trafficResolution === "weekly" ? WEEKLY_TRAFFIC : MONTHLY_TRAFFIC} barCategoryGap="20%">
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="label" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
                      <RechartsTooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid hsl(var(--border))", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }} />
                      {showGoodInTraffic && <Bar dataKey="good" stackId="a" fill="#34c38f" radius={[0, 0, 0, 0]} />}
                      <Bar dataKey="suspicious" stackId="a" fill="#f1b44c" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="bad" stackId="a" fill="#f46a6a" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 3. Sessions Flagged */}
          <Card className="border border-border shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-sm font-semibold">Sessions Flagged</CardTitle>
                  <span className="text-xs text-muted-foreground">{flaggedCount.toLocaleString()} sessions</span>
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
                    onClick={() => setFlaggedView("sources")}
                    className={cn(
                      "px-3 py-1 text-xs font-medium transition-colors border-l border-border",
                      flaggedView === "sources" ? "bg-foreground text-background" : "bg-transparent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    By Source
                  </button>
                  <button
                    onClick={() => setFlaggedView("signals")}
                    className={cn(
                      "px-3 py-1 text-xs font-medium transition-colors border-l border-border",
                      flaggedView === "signals" ? "bg-foreground text-background" : "bg-transparent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    By Signal
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className={cn("pt-0", flaggedView === "categories" || flaggedView === "sources" ? "px-0" : "px-6")}>
              {flaggedView === "categories" ? (
                <div>
                  {/* Column Headers */}
                  <div className="grid grid-cols-[minmax(200px,1fr)_minmax(300px,2fr)_minmax(200px,1fr)_40px] items-center gap-4 px-6 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide border-b border-border">
                    <span>Category</span>
                    <span>Flagged Participants</span>
                    <span>Checks</span>
                    <span></span>
                  </div>
                  
                  <div className="divide-y divide-border">
                    {sorted.map((category) => {
                      const Icon = category.icon
                      const total = category.badParticipants + category.suspiciousParticipants
                      const pct = (total / flaggedCount) * 100
                      const isExpanded = expandedCategory === category.id
                      const maxBarWidth = sorted[0].badParticipants + sorted[0].suspiciousParticipants
                      const barPct = (total / maxBarWidth) * 100
                      
                      // Category colors matching the screenshot
                      const categoryColors: Record<string, { bg: string; icon: string; bar: string }> = {
                        "identity-reuse": { bg: "bg-red-50", icon: "text-red-500", bar: "bg-red-400" },
                        "location-inconsistency": { bg: "bg-blue-50", icon: "text-blue-500", bar: "bg-blue-400" },
                        "network-masking": { bg: "bg-amber-50", icon: "text-amber-500", bar: "bg-amber-400" },
                        "non-human-behavior": { bg: "bg-indigo-50", icon: "text-indigo-500", bar: "bg-indigo-400" },
                        "environment-manipulation": { bg: "bg-blue-50", icon: "text-blue-500", bar: "bg-blue-400" },
                        "behavioral-integrity": { bg: "bg-emerald-50", icon: "text-emerald-500", bar: "bg-emerald-400" },
                      }
                      const colors = categoryColors[category.id] || { bg: "bg-muted", icon: "text-muted-foreground", bar: "bg-muted-foreground" }
                      
                      // Get first 2 checks and overflow count
                      const checkNames = category.signals.map(s => s.name)
                      const displayedChecks = checkNames.slice(0, 2)
                      const overflowCount = checkNames.length - 2
                      
                      return (
                        <div key={category.id}>
                          <button
                            onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                            className="w-full grid grid-cols-[minmax(200px,1fr)_minmax(300px,2fr)_minmax(200px,1fr)_40px] items-center gap-4 px-6 py-4 hover:bg-muted/30 transition-colors text-left"
                          >
                            {/* Category */}
                            <div className="flex items-center gap-3">
                              <div className={cn("flex items-center justify-center w-9 h-9 rounded-lg", colors.bg)}>
                                <Icon className={cn("h-4 w-4", colors.icon)} />
                              </div>
                              <span className="text-sm font-medium text-foreground">{getCategoryLabel(category.name)}</span>
                            </div>
                            
                            {/* Flagged Participants - Progress bar with count */}
                            <div className="flex items-center gap-4">
                              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                <div className={cn("h-full rounded-full transition-all", colors.bar)} style={{ width: `${barPct}%` }} />
                              </div>
                              <span className="text-sm font-semibold text-foreground tabular-nums w-20 text-right">{total.toLocaleString()}</span>
                            </div>
                            
                            {/* Checks */}
                            <div className="flex items-center gap-2 flex-wrap">
                              {displayedChecks.map((check) => (
                                <span key={check} className="text-xs font-medium text-red-500">{check}</span>
                              ))}
                              {overflowCount > 0 && (
                                <span className="text-xs text-muted-foreground">+{overflowCount}</span>
                              )}
                            </div>
                            
                            {/* Chevron */}
                            <div className="flex justify-end">
                              <ChevronRight className={cn("h-4 w-4 text-muted-foreground transition-transform", isExpanded && "rotate-90")} />
                            </div>
                          </button>
                          
                          {isExpanded && (
                            <div className="px-6 pb-4 pl-[4.5rem] space-y-3">
                              <p className="text-xs text-muted-foreground">{category.description}</p>
                              <div className="grid gap-2">
                                {category.signals.map((sig) => {
                                  const sigPct = ((sig.participants / flaggedCount) * 100).toFixed(1)
                                  return (
                                    <div key={sig.name} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                                      <div className={cn("w-1.5 h-8 rounded-full", sig.severity === "bad" ? "bg-red-400" : "bg-amber-400")} />
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs font-medium text-foreground">{sig.name}</span>
                                          <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-medium", sig.severity === "bad" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600")}>{sig.severity === "bad" ? "Bad" : "Suspicious"}</span>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{sig.description}</p>
                                      </div>
                                      <div className="text-right shrink-0">
                                        <span className="text-xs font-medium text-foreground">{sig.participants.toLocaleString()}</span>
                                        <span className="text-[10px] text-muted-foreground ml-1">({sigPct}%)</span>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                              {category.coOccurrence && (
                                <div className="flex items-start gap-2 p-2 rounded-lg bg-blue-50/50 border border-blue-100">
                                  <Info className="h-3.5 w-3.5 text-blue-500 mt-0.5 shrink-0" />
                                  <p className="text-[10px] text-blue-700">{category.coOccurrence}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : flaggedView === "signals" ? (
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-4 text-[10px]">
                      <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-400" /><span className="text-muted-foreground">Bad</span></div>
                      <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-400" /><span className="text-muted-foreground">Suspicious</span></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {ALL_SIGNALS.map((sig) => (
                      <div key={sig.name} className="flex items-center gap-3">
                        <div className={cn("w-1.5 h-6 rounded-full shrink-0", sig.severity === "bad" ? "bg-red-400" : "bg-amber-400")} />
                        <span className="text-xs text-foreground w-[180px] truncate">{sig.name}</span>
                        <div className="flex-1 h-5 bg-muted/30 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(sig.pct * 3, 100)}%`, backgroundColor: SIGNAL_COLORS[sig.name] || "#6ba3be" }} />
                        </div>
                        <span className="text-xs text-muted-foreground w-[60px] text-right">{sig.participants.toLocaleString()}</span>
                        <span className="text-sm font-semibold text-foreground text-right tabular-nums">{sig.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : flaggedView === "sources" ? (
                <div>
                  {/* Table header */}
                  <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] items-center gap-4 px-6 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide border-b border-border bg-muted/30">
                    <span>Source</span>
                    <span className="text-right">Leads</span>
                    <span className="text-right">Fraud Rate</span>
                    <span className="text-right">Waste</span>
                  </div>

                  {/* Table rows */}
                  <div className="divide-y divide-border">
                    {SOURCE_PERFORMANCE.map((row) => (
                      <div
                        key={row.source}
                        className="grid grid-cols-[1.5fr_1fr_1fr_1fr] items-center gap-4 px-6 py-3 hover:bg-muted/20 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">{row.source}</span>
                        </div>
                        <span className="text-sm text-foreground text-right tabular-nums">{row.leads.toLocaleString()}</span>
                        <div className="flex items-center justify-end gap-1.5">
                          <span className={cn(
                            "text-sm font-medium text-right tabular-nums",
                            row.fraudRate >= 25 ? "text-amber-600" : "text-foreground"
                          )}>
                            {row.fraudRate}%
                          </span>
                          {row.fraudRate >= 25 && (
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                          )}
                        </div>
                        <span className="text-sm font-medium text-emerald-600 text-right tabular-nums">${row.waste.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  {/* Footer totals */}
                  <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] items-center gap-4 px-6 py-3 border-t border-border bg-muted/30">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">Total</span>
                    <span className="text-sm font-semibold text-foreground text-right tabular-nums">
                      {SOURCE_PERFORMANCE.reduce((sum, r) => sum + r.leads, 0).toLocaleString()}
                    </span>
                    <span className="text-sm font-medium text-muted-foreground text-right">--</span>
                    <span className="text-sm font-bold text-emerald-600 text-right tabular-nums">
                      ${SOURCE_PERFORMANCE.reduce((sum, r) => sum + r.waste, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* 4. Geographic Context */}
          <Card className="border border-border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Geographic Context</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground text-sm">
                Geographic visualization would appear here
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          {/* SESSION DETAILS VIEW */}
          <div className="flex gap-4 h-[calc(100vh-220px)]">
            {/* LEFT: Data Table */}
            <div className={cn("flex flex-col border border-border rounded-lg bg-card overflow-hidden transition-all", selectedSession ? "flex-1" : "w-full")}>
              {/* Toolbar */}
              <div className="flex items-center gap-2 p-3 border-b border-border bg-muted/30 shrink-0">
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search by Visitor ID..."
                    value={sessionSearch}
                    onChange={(e) => setSessionSearch(e.target.value)}
                    className="pl-8 h-8 text-xs bg-background"
                  />
                </div>

                {/* Score filter */}
                <Popover open={scoreDropdownOpen} onOpenChange={setScoreDropdownOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 text-xs gap-1 font-normal bg-transparent">
                      Score
                      {scoreFilters.size > 0 && (
                        <span className="ml-0.5 h-4 min-w-[16px] px-1 rounded bg-foreground text-background text-[10px] font-semibold flex items-center justify-center">{scoreFilters.size}</span>
                      )}
                      <ChevronsUpDown className="ml-0.5 h-3 w-3 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[160px] p-1" align="start">
                    {(["good", "suspicious", "bad"] as const).map((score) => {
                      const sel = scoreFilters.has(score)
                      return (
                        <button key={score} onClick={() => { const next = new Set(scoreFilters); if (sel) next.delete(score); else next.add(score); setScoreFilters(next) }} className="flex items-center gap-2 w-full px-2 py-1.5 rounded-sm text-xs hover:bg-muted transition-colors">
                          <div className={cn("h-3.5 w-3.5 rounded-sm border flex items-center justify-center", sel ? "bg-foreground border-foreground" : "border-input")}>
                            {sel && <Check className="h-2.5 w-2.5 text-background" />}
                          </div>
                          <span className="capitalize font-medium">{score}</span>
                        </button>
                      )
                    })}
                    {scoreFilters.size > 0 && (<><div className="my-1 border-t border-border" /><button onClick={() => setScoreFilters(new Set())} className="flex items-center gap-2 w-full px-2 py-1.5 rounded-sm text-xs text-muted-foreground hover:bg-muted transition-colors">Clear</button></>)}
                  </PopoverContent>
                </Popover>

                {/* Check filter */}
                <Popover open={checkDropdownOpen} onOpenChange={setCheckDropdownOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 text-xs gap-1 font-normal bg-transparent">
                      Check
                      {checkFilters.size > 0 && (
                        <span className="ml-0.5 h-4 min-w-[16px] px-1 rounded bg-foreground text-background text-[10px] font-semibold flex items-center justify-center">{checkFilters.size}</span>
                      )}
                      <ChevronsUpDown className="ml-0.5 h-3 w-3 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[220px] p-1" align="start">
                    {CHECK_KEYS.map((key) => {
                      const sel = checkFilters.has(key)
                      return (
                        <button key={key} onClick={() => { const next = new Set(checkFilters); if (sel) next.delete(key); else next.add(key); setCheckFilters(next) }} className="flex items-center gap-2 w-full px-2 py-1.5 rounded-sm text-xs hover:bg-muted transition-colors">
                          <div className={cn("h-3.5 w-3.5 rounded-sm border flex items-center justify-center", sel ? "bg-foreground border-foreground" : "border-input")}>
                            {sel && <Check className="h-2.5 w-2.5 text-background" />}
                          </div>
                          <span className="font-medium">{key}</span>
                        </button>
                      )
                    })}
                    {checkFilters.size > 0 && (<><div className="my-1 border-t border-border" /><button onClick={() => setCheckFilters(new Set())} className="flex items-center gap-2 w-full px-2 py-1.5 rounded-sm text-xs text-muted-foreground hover:bg-muted transition-colors">Clear</button></>)}
                  </PopoverContent>
                </Popover>

                {/* Category filter */}
                <Popover open={categoryDropdownOpen} onOpenChange={setCategoryDropdownOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 text-xs gap-1 font-normal bg-transparent">
                      Category
                      {categoryFilters.size > 0 && (
                        <span className="ml-0.5 h-4 min-w-[16px] px-1 rounded bg-foreground text-background text-[10px] font-semibold flex items-center justify-center">{categoryFilters.size}</span>
                      )}
                      <ChevronsUpDown className="ml-0.5 h-3 w-3 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[220px] p-1" align="start">
                    {FRAUD_CATEGORIES.map((cat) => {
                      const sel = categoryFilters.has(cat.name)
                      return (
                        <button key={cat.id} onClick={() => { const next = new Set(categoryFilters); if (sel) next.delete(cat.name); else next.add(cat.name); setCategoryFilters(next) }} className="flex items-center gap-2 w-full px-2 py-1.5 rounded-sm text-xs hover:bg-muted transition-colors">
                          <div className={cn("h-3.5 w-3.5 rounded-sm border flex items-center justify-center", sel ? "bg-foreground border-foreground" : "border-input")}>
                            {sel && <Check className="h-2.5 w-2.5 text-background" />}
                          </div>
                          <span className="font-medium">{getCategoryLabel(cat.name)}</span>
                        </button>
                      )
                    })}
                    {categoryFilters.size > 0 && (<><div className="my-1 border-t border-border" /><button onClick={() => setCategoryFilters(new Set())} className="flex items-center gap-2 w-full px-2 py-1.5 rounded-sm text-xs text-muted-foreground hover:bg-muted transition-colors">Clear</button></>)}
                  </PopoverContent>
                </Popover>

                {/* Source filter */}
                <Popover open={sourceDropdownOpen} onOpenChange={setSourceDropdownOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 text-xs gap-1 font-normal bg-transparent">
                      Source
                      {sourceFilters.size > 0 && (
                        <span className="ml-0.5 h-4 min-w-[16px] px-1 rounded bg-foreground text-background text-[10px] font-semibold flex items-center justify-center">{sourceFilters.size}</span>
                      )}
                      <ChevronsUpDown className="ml-0.5 h-3 w-3 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-1" align="start">
                    {LEAD_SOURCES.map((src) => {
                      const sel = sourceFilters.has(src)
                      return (
                        <button key={src} onClick={() => { const next = new Set(sourceFilters); if (sel) next.delete(src); else next.add(src); setSourceFilters(next) }} className="flex items-center gap-2 w-full px-2 py-1.5 rounded-sm text-xs hover:bg-muted transition-colors">
                          <div className={cn("h-3.5 w-3.5 rounded-sm border flex items-center justify-center", sel ? "bg-foreground border-foreground" : "border-input")}>
                            {sel && <Check className="h-2.5 w-2.5 text-background" />}
                          </div>
                          <span className="font-medium">{src}</span>
                        </button>
                      )
                    })}
                    {sourceFilters.size > 0 && (<><div className="my-1 border-t border-border" /><button onClick={() => setSourceFilters(new Set())} className="flex items-center gap-2 w-full px-2 py-1.5 rounded-sm text-xs text-muted-foreground hover:bg-muted transition-colors">Clear</button></>)}
                  </PopoverContent>
                </Popover>

                {/* Cost Saved sort */}
                <Button
                  variant="outline"
                  size="sm"
                  className={cn("h-8 text-xs gap-1 font-normal bg-transparent", sortCol === "costSaved" && "bg-muted")}
                  onClick={() => toggleSort("costSaved")}
                >
                  <DollarSign className="h-3.5 w-3.5" />
                  Cost Saved
                  <SortIcon col="costSaved" />
                </Button>

                <div className="flex-1" />

                <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 bg-transparent">
                  <Download className="h-3.5 w-3.5" />
                  Export
                </Button>
              </div>

              {/* Table */}
              <div ref={tableRef} className="flex-1 overflow-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-card z-10">
                    <TableRow className="hover:bg-transparent border-b border-border">
                      <TableHead className="w-[40px] pl-4">
                        <Checkbox
                          checked={selectedRows.size === filteredSessions.length && filteredSessions.length > 0}
                          onCheckedChange={toggleAllRows}
                          className="h-3.5 w-3.5"
                        />
                      </TableHead>
                      <TableHead className="min-w-[120px]">
                        <button onClick={() => toggleSort("visitorId")} className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
                          Visitor ID <SortIcon col="visitorId" />
                        </button>
                      </TableHead>
                      <TableHead className="min-w-[100px]">
                        <button onClick={() => toggleSort("source")} className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
                          Source <SortIcon col="source" />
                        </button>
                      </TableHead>
                      <TableHead className="w-[85px]">
                        <button onClick={() => toggleSort("outcome")} className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
                          Score <SortIcon col="outcome" />
                        </button>
                      </TableHead>
                      <TableHead className="min-w-[100px]">
                        <button onClick={() => toggleSort("country")} className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
                          Country <SortIcon col="country" />
                        </button>
                      </TableHead>
                      <TableHead className="min-w-[100px]">
                        <button onClick={() => toggleSort("city")} className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
                          City <SortIcon col="city" />
                        </button>
                      </TableHead>
                      <TableHead className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground min-w-[120px]">Flag Reason</TableHead>
                      <TableHead className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground min-w-[120px]">Signal</TableHead>
                      <TableHead className="min-w-[100px]">
                        <button onClick={() => toggleSort("costSaved")} className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
                          Est. Cost Saved <SortIcon col="costSaved" />
                        </button>
                      </TableHead>
                      <TableHead className="min-w-[140px] text-right pr-4">
                        <button onClick={() => toggleSort("createdAt")} className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors ml-auto">
                          Created At <SortIcon col="createdAt" />
                        </button>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSessions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-20 text-sm text-muted-foreground">
                          No leads match your filters.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSessions.map((session) => {
                        const isSelected = selectedSession === session.visitorId
                        const isChecked = selectedRows.has(session.visitorId)
                        const rowFailedChecks = Object.entries(session.checks).filter(([, v]) => v === "FAIL").map(([k]) => k)
                        const truncateId = (id: string) => id.length > 12 ? `${id.slice(0, 6)}...${id.slice(-4)}` : id
                        return (
                          <TableRow
                            key={session.visitorId}
                            className={cn(
                              "cursor-pointer transition-colors h-11",
                              isSelected ? "bg-muted" : "hover:bg-muted/50",
                              isChecked && "bg-primary/5"
                            )}
                            onClick={() => setSelectedSession(isSelected ? null : session.visitorId)}
                          >
                            <TableCell className="py-0 pl-4" onClick={(e) => e.stopPropagation()}>
                              <Checkbox
                                checked={isChecked}
                                onCheckedChange={() => toggleRowSelection(session.visitorId)}
                                className="h-3.5 w-3.5"
                              />
                            </TableCell>
                            <TableCell className="py-0">
                              <span className="font-mono text-xs text-foreground" title={session.visitorId}>{truncateId(session.visitorId)}</span>
                            </TableCell>
                            <TableCell className="py-0">
                              <span className="text-xs text-foreground">{session.source}</span>
                            </TableCell>
                            <TableCell className="py-0">
                              {(() => { const oc = computeOutcome(session.checks); return (
                                <Badge variant="outline" className={cn("text-[10px] font-medium px-1.5 py-0", oc === "good" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : oc === "suspicious" ? "border-amber-200 bg-amber-50 text-amber-700" : "border-red-200 bg-red-50 text-red-700")}>
                                  {oc === "good" ? <ShieldCheck className="h-3 w-3 mr-0.5" /> : oc === "suspicious" ? <ShieldAlert className="h-3 w-3 mr-0.5" /> : <ShieldX className="h-3 w-3 mr-0.5" />}
                                  {oc.charAt(0).toUpperCase() + oc.slice(1)}
                                </Badge>
                              )})()}
                            </TableCell>
                            <TableCell className="py-0">
                              <span className="text-xs text-foreground">{session.location.country}</span>
                            </TableCell>
                            <TableCell className="py-0">
                              <span className="text-xs text-muted-foreground">{session.location.city}</span>
                            </TableCell>
                            <TableCell className="py-0">
                              {session.categories.length === 0 ? (
                                <span className="text-[10px] text-muted-foreground/40">--</span>
                              ) : (
                                <span className="text-[10px] text-muted-foreground font-medium truncate block max-w-[140px]" title={session.categories.map(c => getCategoryLabel(c)).join(", ")}>
                                  {getCategoryLabel(session.categories[0])}{session.categories.length > 1 && <span className="text-muted-foreground/50 ml-0.5">+{session.categories.length - 1}</span>}
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="py-0">
                              {rowFailedChecks.length === 0 ? (
                                <span className="text-[10px] text-muted-foreground/40">--</span>
                              ) : (
                                <div className="flex items-center gap-1 overflow-hidden">
                                  <span className="px-1.5 py-0.5 rounded bg-red-50 text-[10px] font-medium text-red-600 whitespace-nowrap">{rowFailedChecks[0]}</span>
                                  {rowFailedChecks.length > 1 && (
                                    <span className="text-[10px] text-muted-foreground">+{rowFailedChecks.length - 1}</span>
                                  )}
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="py-0">
                              {computeOutcome(session.checks) !== "good" ? (
                                <span className="text-xs font-medium text-emerald-600">${session.leadCost.toFixed(2)}</span>
                              ) : (
                                <span className="text-[10px] text-muted-foreground/40">--</span>
                              )}
                            </TableCell>
                            <TableCell className="py-0 text-right pr-4">
                              <span className="text-xs text-muted-foreground tabular-nums">{session.createdAt}</span>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-2.5 border-t border-border bg-muted/30 shrink-0">
                <div className="flex items-center gap-4">
                  <span className="text-[11px] text-muted-foreground">
                    Showing <span className="font-medium text-foreground">{filteredSessions.length}</span> of <span className="font-medium text-foreground">{totalSessions.toLocaleString()}</span> leads
                  </span>
                  <span className="text-[11px] text-emerald-600 font-medium">
                    Total waste prevented: ${filteredSessions.filter(s => computeOutcome(s.checks) !== "good").reduce((sum, s) => sum + s.leadCost, 0).toLocaleString()} this month
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  Use <kbd className="px-1 py-0.5 rounded border border-border bg-muted text-[9px] font-mono">Arrow Up</kbd> <kbd className="px-1 py-0.5 rounded border border-border bg-muted text-[9px] font-mono">Arrow Down</kbd> to navigate
                </span>
              </div>
            </div>

            {/* RIGHT: Detail Side Panel */}
            {selectedSession && (() => {
              const s = SAMPLE_SESSIONS.find((x) => x.visitorId === selectedSession)
              if (!s) return null
              const failedChecks = Object.entries(s.checks).filter(([, v]) => v === "FAIL").map(([k]) => k)
              const passedChecks = Object.entries(s.checks).filter(([, v]) => v === "PASS").map(([k]) => k)
              const emptyChecks = Object.entries(s.checks).filter(([, v]) => v === "EMPTY").map(([k]) => k)
              const truncateId = (id: string) => id.length > 16 ? `${id.slice(0, 8)}...${id.slice(-6)}` : id
              const copyBtn = (text: string) => (
                <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(text) }} className="text-muted-foreground/50 hover:text-foreground transition-colors p-0.5">
                  <Copy className="h-3 w-3" />
                </button>
              )
              const riskBadge = (risk: "low" | "medium" | "high") => (
                <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-medium", risk === "low" ? "bg-emerald-50 text-emerald-600" : risk === "medium" ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600")}>{risk}</span>
              )
              return (
                <div className="w-[420px] border border-border rounded-lg bg-card flex flex-col overflow-hidden shrink-0 h-full">
                  {/* Panel header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30 shrink-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-[11px] text-muted-foreground truncate" title={s.visitorId}>{truncateId(s.visitorId)}</span>
                      {copyBtn(s.visitorId)}
                      <span className="ml-2 px-1.5 py-0.5 rounded bg-muted text-[10px] font-medium text-muted-foreground">{s.source}</span>
                    </div>
                    <button onClick={() => setSelectedSession(null)} className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-muted" aria-label="Close panel">
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Scrollable content */}
                  <div className="flex-1 overflow-y-auto">
                    {/* Warning Panel */}
                    {computeOutcome(s.checks) !== "good" && (
                      <div className="px-4 py-3 bg-amber-50 border-b-2 border-amber-300">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-4 w-4 text-amber-600" />
                          <span className="text-xs font-bold text-amber-800 uppercase">Suspicious - Do Not Pay For This Lead</span>
                        </div>

                        <div className="mb-3">
                          <span className="text-[10px] font-semibold text-amber-700 uppercase tracking-wide">Why We Flagged It:</span>
                          <ul className="mt-1 space-y-0.5">
                            {failedChecks.includes("Duplicate Device") && (
                              <li className="text-[11px] text-amber-900">• Repeat submission from same device</li>
                            )}
                            {failedChecks.includes("Duplicate IP") && (
                              <li className="text-[11px] text-amber-900">• Duplicate IP address detected</li>
                            )}
                            {(failedChecks.includes("VPN Usage") || failedChecks.includes("Tor Exit Node")) && (
                              <li className="text-[11px] text-amber-900">• VPN detected - hiding true location</li>
                            )}
                            {s.location.tzMismatch && (
                              <li className="text-[11px] text-amber-900">• TZ mismatch indicates location spoofing</li>
                            )}
                            {failedChecks.includes("Automation Detection") && (
                              <li className="text-[11px] text-amber-900">• Bot or automated submission detected</li>
                            )}
                            {failedChecks.includes("Untrusted Browsers/OS") && (
                              <li className="text-[11px] text-amber-900">• Untrusted browser or device configuration</li>
                            )}
                            {failedChecks.length === 0 && s.categories.map(cat => (
                              <li key={cat} className="text-[11px] text-amber-900">• {getCategoryLabel(cat)} detected</li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex items-center gap-2 p-2 bg-amber-100 rounded">
                          <DollarSign className="h-4 w-4 text-amber-700" />
                          <span className="text-xs font-semibold text-amber-800">
                            Cost Impact: ${s.leadCost.toFixed(2)} (based on your avg lead cost)
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Categories / Findings */}
                    {s.categories.length > 0 && (
                      <div className="px-4 py-2.5 border-b border-border">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mr-0.5">Flag Reasons:</span>
                          {s.categories.map((cat) => (
                            <span key={cat} className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-medium text-foreground">{getCategoryLabel(cat)}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Evidence header */}
                    {computeOutcome(s.checks) !== "good" && (
                      <div className="px-4 py-2 bg-muted/30 border-b border-border">
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Evidence</span>
                      </div>
                    )}

                    {/* LOCATION */}
                    <div className="px-4 py-3 border-b border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPinned className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Location</span>
                        {riskBadge(s.location.risk)}
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                        <div><span className="text-muted-foreground">City:</span> <span className="text-foreground">{s.location.city}</span></div>
                        <div><span className="text-muted-foreground">Country:</span> <span className="text-foreground">{s.location.country}</span></div>
                        <div><span className="text-muted-foreground">IP TZ:</span> <span className="text-foreground font-mono text-[11px]">{s.location.ipTimezone}</span></div>
                        <div><span className="text-muted-foreground">Browser TZ:</span> <span className={cn("font-mono text-[11px]", s.location.tzMismatch ? "text-red-600" : "text-foreground")}>{s.location.browserTimezone}</span></div>
                        {s.location.tzMismatch && (
                          <div className="col-span-2 flex items-center gap-1 text-red-600">
                            <AlertTriangle className="h-3 w-3" />
                            <span className="text-[10px] font-medium">Timezone mismatch ({s.location.offsetMinutes} min offset)</span>
                          </div>
                        )}
                        <div><span className="text-muted-foreground">Locations (24h):</span> <span className="text-foreground">{s.location.recentLocations24h}</span></div>
                        <div><span className="text-muted-foreground">Locations (7d):</span> <span className="text-foreground">{s.location.recentLocations7d}</span></div>
                      </div>
                    </div>

                    {/* NETWORK */}
                    <div className="px-4 py-3 border-b border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <Wifi className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Network</span>
                        {riskBadge(s.network.risk)}
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                        <div className="flex items-center gap-1"><span className="text-muted-foreground">IP:</span> <span className="text-foreground font-mono text-[11px]">{s.network.ip}</span>{copyBtn(s.network.ip)}</div>
                        <div><span className="text-muted-foreground">ASN:</span> <span className="text-foreground">{s.network.asn}</span></div>
                        <div><span className="text-muted-foreground">Type:</span> <span className={cn("font-medium", s.network.typeRisk === "high" ? "text-red-600" : "text-foreground")}>{s.network.type}</span></div>
                        <div><span className="text-muted-foreground">Proxy:</span> <span className={cn(s.network.proxy ? "text-red-600 font-medium" : "text-muted-foreground")}>{s.network.proxy || "None"}</span></div>
                        <div><span className="text-muted-foreground">First seen:</span> <span className="text-foreground">{s.network.firstSeen}</span></div>
                        <div><span className="text-muted-foreground">Sessions (project):</span> <span className="text-foreground">{s.network.sessionsThisProject}</span></div>
                        <div><span className="text-muted-foreground">Sessions (all):</span> <span className="text-foreground">{s.network.sessionsAllProjects}</span></div>
                        <div><span className="text-muted-foreground">Projects:</span> <span className="text-foreground">{s.network.projectsCount}</span></div>
                        {s.network.warning && (
                          <div className="col-span-2 flex items-center gap-1 text-red-600">
                            <AlertTriangle className="h-3 w-3" />
                            <span className="text-[10px] font-medium">{s.network.warning}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* DEVICE */}
                    <div className="px-4 py-3 border-b border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <Monitor className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Device</span>
                        {riskBadge(s.device.risk)}
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                        <div className="flex items-center gap-1"><span className="text-muted-foreground">ID:</span> <span className="text-foreground font-mono text-[11px]">{s.device.deviceId}</span>{copyBtn(s.device.deviceId)}</div>
                        <div><span className="text-muted-foreground">Type:</span> <span className="text-foreground">{s.device.type}</span></div>
                        <div><span className="text-muted-foreground">OS:</span> <span className="text-foreground">{s.device.os}</span></div>
                        <div><span className="text-muted-foreground">Browser:</span> <span className="text-foreground">{s.device.browser}</span></div>
                        <div><span className="text-muted-foreground">First seen:</span> <span className="text-foreground">{s.device.firstSeen}</span></div>
                        <div><span className="text-muted-foreground">Sessions (project):</span> <span className="text-foreground">{s.device.sessionsThisProject}</span></div>
                        <div><span className="text-muted-foreground">Sessions (all):</span> <span className="text-foreground">{s.device.sessionsAllProjects}</span></div>
                        <div><span className="text-muted-foreground">Projects:</span> <span className="text-foreground">{s.device.projectsCount}</span></div>
                        {s.device.warning && (
                          <div className="col-span-2 flex items-center gap-1 text-red-600">
                            <AlertTriangle className="h-3 w-3" />
                            <span className="text-[10px] font-medium">{s.device.warning}</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-2 p-2 bg-muted/30 rounded text-[10px] font-mono text-muted-foreground break-all">{s.device.userAgent}</div>
                    </div>

                    {/* Checks summary */}
                    <div className="px-4 py-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Checks ({passedChecks.length + failedChecks.length})</span>
                      </div>
                      {failedChecks.length > 0 && (
                        <div className="mb-2">
                          <span className="text-[10px] text-red-600 font-medium">Failed ({failedChecks.length})</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {failedChecks.map((c) => <span key={c} className="px-1.5 py-0.5 rounded bg-red-50 text-[10px] text-red-600">{c}</span>)}
                          </div>
                        </div>
                      )}
                      {passedChecks.length > 0 && (
                        <div className="mb-2">
                          <span className="text-[10px] text-emerald-600 font-medium">Passed ({passedChecks.length})</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {passedChecks.map((c) => <span key={c} className="px-1.5 py-0.5 rounded bg-emerald-50 text-[10px] text-emerald-600">{c}</span>)}
                          </div>
                        </div>
                      )}
                      {emptyChecks.length > 0 && (
                        <div>
                          <span className="text-[10px] text-muted-foreground font-medium">Not evaluated ({emptyChecks.length})</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {emptyChecks.map((c) => <span key={c} className="px-1.5 py-0.5 rounded bg-muted text-[10px] text-muted-foreground">{c}</span>)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>
        </>
      )}
    </div>
  )
}
