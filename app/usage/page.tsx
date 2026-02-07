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
  MapPinned,
  Download,
  X,
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

interface SessionDetail {
  visitorId: string
  outcome: "good" | "suspicious" | "bad"
  createdAt: string
  categories: string[]
  checks: Record<string, CheckResult>
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
  const [checkFilters, setCheckFilters] = useState<Set<string>>(new Set())
  const [scoreDropdownOpen, setScoreDropdownOpen] = useState(false)
  const [checkDropdownOpen, setCheckDropdownOpen] = useState(false)
  const [categoryFilters, setCategoryFilters] = useState<Set<string>>(new Set())
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
  const [expandedSession, setExpandedSession] = useState<string | null>(null)

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
                  {badCount.toLocaleString()} sessions classified as Bad. Most common:{" "}
                  <span className="font-medium text-foreground">{sorted[0].name} ({Math.round(sorted[0].badParticipants / 1000)}K)</span> and{" "}
                  <span className="font-medium text-foreground">{sorted[1].name} ({Math.round((sorted[1].badParticipants + sorted[1].suspiciousParticipants) / 1000)}K)</span>
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
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm font-semibold">Sessions Flagged</CardTitle>
                  <InfoTip text="Each participant has one final outcome (Bad or Suspicious) based on their highest-severity check. Bad and Suspicious counts within each category are mutually exclusive." side="right" />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">Note: A single session may contribute to multiple findings</p>
              </div>
              <div className="inline-flex rounded-lg border border-border overflow-hidden">
                <button
                  onClick={() => setFlaggedView("categories")}
                  className={cn(
                    "px-3 py-1 text-xs font-medium transition-colors",
                    flaggedView === "categories" ? "bg-foreground text-background" : "bg-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  By Finding
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
                                <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium cursor-help inline-flex items-center gap-1", sl.color)}>
                                  {category.strength === "strong" && <AlertTriangle className="h-3 w-3 text-red-500" />}
                                  {category.strength === "moderate" && <AlertTriangle className="h-3 w-3 text-amber-500" />}
                                  {sl.text}
                                </span>
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
                              <div className="mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Check Breakdown</span>
                                  <InfoTip text="Each count represents distinct participants where this check fired. Counts may overlap across checks and do not represent final outcomes." side="right" />
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-0.5">These checks support the {category.name} finding:</p>
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
        <Card className="border border-border shadow-sm overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">Session Details</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Individual participant evaluations with signal-level detail</p>
              </div>
              <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 bg-transparent">
                <Download className="h-3.5 w-3.5" />
                Export
              </Button>
            </div>

            {/* Toolbar: Search + Filters */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <div className="relative flex-1 max-w-xs min-w-[200px]">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search by Visitor ID..."
                  value={sessionSearch}
                  onChange={(e) => setSessionSearch(e.target.value)}
                  className="pl-8 h-8 text-xs"
                />
              </div>

              {/* Score filter */}
              <Popover open={scoreDropdownOpen} onOpenChange={setScoreDropdownOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 font-normal bg-transparent">
                    Score
                    {scoreFilters.size > 0 && (
                      <span className="ml-0.5 h-4 min-w-[16px] px-1 rounded bg-foreground text-background text-[10px] font-semibold flex items-center justify-center">{scoreFilters.size}</span>
                    )}
                    <ChevronsUpDown className="ml-0.5 h-3.5 w-3.5 shrink-0 opacity-50" />
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
                        <span className={cn("font-medium", s === "bad" && "text-red-600", s === "suspicious" && "text-amber-600", s === "good" && "text-emerald-600")}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </span>
                      </button>
                    )
                  })}
                  {scoreFilters.size > 0 && (
                    <>
                      <div className="my-1 border-t border-border" />
                      <button onClick={() => setScoreFilters(new Set())} className="flex items-center gap-2 w-full px-2 py-1.5 rounded-sm text-xs text-muted-foreground hover:bg-muted transition-colors">Clear filters</button>
                    </>
                  )}
                </PopoverContent>
              </Popover>

              {/* Failed Check filter */}
              <Popover open={checkDropdownOpen} onOpenChange={setCheckDropdownOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 font-normal bg-transparent">
                    Failed Check
                    {checkFilters.size > 0 && (
                      <span className="ml-0.5 h-4 min-w-[16px] px-1 rounded bg-foreground text-background text-[10px] font-semibold flex items-center justify-center">{checkFilters.size}</span>
                    )}
                    <ChevronsUpDown className="ml-0.5 h-3.5 w-3.5 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[240px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search checks..." className="h-8 text-xs" />
                    <CommandList>
                      <CommandEmpty className="py-3 text-xs text-center text-muted-foreground">No checks found.</CommandEmpty>
                      <CommandGroup>
                        {CHECK_KEYS.map((key) => {
                          const selected = checkFilters.has(key)
                          return (
                            <CommandItem key={key} value={key} onSelect={() => { const next = new Set(checkFilters); if (selected) next.delete(key); else next.add(key); setCheckFilters(next) }} className="text-xs">
                              <div className={cn("mr-2 h-3.5 w-3.5 rounded-sm border flex items-center justify-center shrink-0", selected ? "bg-foreground border-foreground" : "border-input")}>
                                {selected && <Check className="h-2.5 w-2.5 text-background" />}
                              </div>
                              {key}
                            </CommandItem>
                          )
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                  {checkFilters.size > 0 && (
                    <div className="p-1 border-t border-border">
                      <button onClick={() => setCheckFilters(new Set())} className="flex items-center gap-2 w-full px-2 py-1.5 rounded-sm text-xs text-muted-foreground hover:bg-muted transition-colors">Clear filters</button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>

              {/* Finding filter */}
              <Popover open={categoryDropdownOpen} onOpenChange={setCategoryDropdownOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 font-normal bg-transparent">
                    Finding
                    {categoryFilters.size > 0 && (
                      <span className="ml-0.5 h-4 min-w-[16px] px-1 rounded bg-foreground text-background text-[10px] font-semibold flex items-center justify-center">{categoryFilters.size}</span>
                    )}
                    <ChevronsUpDown className="ml-0.5 h-3.5 w-3.5 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[220px] p-1" align="start">
                  {FRAUD_CATEGORIES.map((cat) => {
                    const selected = categoryFilters.has(cat.name)
                    return (
                      <button key={cat.id} onClick={() => { const next = new Set(categoryFilters); if (selected) next.delete(cat.name); else next.add(cat.name); setCategoryFilters(next) }} className="flex items-center gap-2 w-full px-2 py-1.5 rounded-sm text-xs hover:bg-muted transition-colors">
                        <div className={cn("h-3.5 w-3.5 rounded-sm border flex items-center justify-center", selected ? "bg-foreground border-foreground" : "border-input")}>
                          {selected && <Check className="h-2.5 w-2.5 text-background" />}
                        </div>
                        <span className="font-medium">{cat.name}</span>
                      </button>
                    )
                  })}
                  {categoryFilters.size > 0 && (
                    <>
                      <div className="my-1 border-t border-border" />
                      <button onClick={() => setCategoryFilters(new Set())} className="flex items-center gap-2 w-full px-2 py-1.5 rounded-sm text-xs text-muted-foreground hover:bg-muted transition-colors">Clear filters</button>
                    </>
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
                const matchesCheck = checkFilters.size === 0 || Array.from(checkFilters).every((key) => session.checks[key] === "FAIL")
                const matchesCategory = categoryFilters.size === 0 || session.categories.some((cat) => categoryFilters.has(cat))
                return matchesSearch && matchesScore && matchesCheck && matchesCategory
              })

              const truncateId = (id: string) => {
                if (id.length <= 12) return id
                return `${id.slice(0, 6)}...${id.slice(-4)}`
              }

              const riskBadge = (risk: "low" | "medium" | "high") => (
                <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-medium inline-flex",
                  risk === "high" && "bg-red-50 text-red-600",
                  risk === "medium" && "bg-amber-50 text-amber-700",
                  risk === "low" && "bg-emerald-50 text-emerald-700",
                )}>
                  {risk.charAt(0).toUpperCase() + risk.slice(1)}
                </span>
              )

              const copyBtn = (text: string) => (
                <button
                  onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(text) }}
                  className="text-muted-foreground hover:text-foreground transition-colors p-0.5"
                  aria-label={`Copy ${text}`}
                >
                  <Copy className="h-3 w-3" />
                </button>
              )

              const detailRow = (label: string, value: React.ReactNode, mono = false) => (
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">{label}</span>
                  <span className={cn("text-[11px] text-foreground text-right", mono && "font-mono")}>{value}</span>
                </div>
              )

              return (
                <>
                  {/* Table */}
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent bg-muted/40">
                          <TableHead className="w-[40px] pl-5 pr-0" />
                          <TableHead className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground min-w-[130px]">Visitor ID</TableHead>
                          <TableHead className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground w-[80px]">Score</TableHead>
                          <TableHead className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground min-w-[130px]">Location</TableHead>
                          <TableHead className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground min-w-[140px]">Findings</TableHead>
                          <TableHead className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground min-w-[150px]">Failed Checks</TableHead>
                          <TableHead className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-right min-w-[150px] pr-5">Created At</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredSessions.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-16 text-sm text-muted-foreground">
                              No sessions match your filters.
                            </TableCell>
                          </TableRow>
                        ) : (
                          <>
                            {filteredSessions.map((session) => {
                              const isExpanded = expandedSession === session.visitorId
                              const failedChecks = Object.entries(session.checks).filter(([, v]) => v === "FAIL").map(([k]) => k)
                              const passedChecks = Object.entries(session.checks).filter(([, v]) => v === "PASS").map(([k]) => k)

                              return (
                                <React.Fragment key={session.visitorId}>
                                  {/* Data row */}
                                  <TableRow
                                    onClick={() => setExpandedSession(isExpanded ? null : session.visitorId)}
                                    className={cn(
                                      "cursor-pointer transition-colors group h-[50px]",
                                      isExpanded ? "bg-muted/50" : "hover:bg-muted/30",
                                      session.outcome === "bad" && "border-l-[3px] border-l-red-400",
                                      session.outcome === "suspicious" && "border-l-[3px] border-l-amber-400",
                                      session.outcome === "good" && "border-l-[3px] border-l-transparent",
                                    )}
                                  >
                                    <TableCell className="pl-5 pr-0 py-0">
                                      <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground/60 transition-transform group-hover:text-muted-foreground", isExpanded && "rotate-180")} />
                                    </TableCell>
                                    <TableCell className="py-0">
                                      <span className="font-mono text-xs text-foreground" title={session.visitorId}>{truncateId(session.visitorId)}</span>
                                    </TableCell>
                                    <TableCell className="py-0">
                                      <span className={cn(
                                        "text-xs font-medium capitalize",
                                        session.outcome === "bad" && "text-red-600",
                                        session.outcome === "suspicious" && "text-amber-600",
                                        session.outcome === "good" && "text-emerald-600",
                                      )}>
                                        {session.outcome}
                                      </span>
                                    </TableCell>
                                    <TableCell className="py-0">
                                      <span className="text-xs text-foreground">{session.location.city}</span>
                                      <span className="text-[10px] text-muted-foreground ml-1.5">{session.location.country}</span>
                                    </TableCell>
                                    <TableCell className="py-0">
                                      <div className="flex items-center gap-1 overflow-hidden">
                                        {session.categories.length === 0 ? (
                                          <span className="text-xs text-muted-foreground/40">--</span>
                                        ) : (
                                          <>
                                            {session.categories.slice(0, 2).map((cat) => (
                                              <span key={cat} className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-medium text-muted-foreground whitespace-nowrap">{cat}</span>
                                            ))}
                                            {session.categories.length > 2 && (
                                              <span className="text-[10px] text-muted-foreground ml-0.5">+{session.categories.length - 2}</span>
                                            )}
                                          </>
                                        )}
                                      </div>
                                    </TableCell>
                                    <TableCell className="py-0">
                                      <div className="flex items-center gap-1 overflow-hidden">
                                        {failedChecks.length === 0 ? (
                                          <span className="text-xs text-muted-foreground/40">--</span>
                                        ) : (
                                          <>
                                            {failedChecks.slice(0, 2).map((fc) => (
                                              <span key={fc} className="px-1.5 py-0.5 rounded bg-red-50 text-[10px] font-medium text-red-600 whitespace-nowrap">{fc}</span>
                                            ))}
                                            {failedChecks.length > 2 && (
                                              <span className="text-[10px] text-muted-foreground ml-0.5">+{failedChecks.length - 2}</span>
                                            )}
                                          </>
                                        )}
                                      </div>
                                    </TableCell>
                                    <TableCell className="py-0 text-right pr-5">
                                      <span className="text-xs text-muted-foreground tabular-nums">{session.createdAt}</span>
                                    </TableCell>
                                  </TableRow>

                                  {/* Expanded detail panel */}
                                  {isExpanded && (
                                    <TableRow className="hover:bg-transparent">
                                      <TableCell colSpan={7} className="p-0 border-b-0">
                                        <div className="relative bg-muted/20 border-y border-border">
                                          {/* Close */}
                                          <button onClick={() => setExpandedSession(null)} className="absolute top-3 right-4 text-muted-foreground hover:text-foreground transition-colors z-10" aria-label="Close">
                                            <X className="h-4 w-4" />
                                          </button>

                                          <div className="px-8 py-5">
                                            {/* Top: ID + Failed checks strip */}
                                            <div className="flex items-center gap-3 mb-5">
                                              <span className="font-mono text-xs text-foreground">{session.visitorId}</span>
                                              {copyBtn(session.visitorId)}
                                              {failedChecks.length > 0 && (
                                                <div className="flex items-center gap-1.5 ml-2">
                                                  {failedChecks.map((fc) => (
                                                    <span key={fc} className="px-2 py-0.5 rounded bg-red-50 text-[10px] font-medium text-red-600">{fc}</span>
                                                  ))}
                                                </div>
                                              )}
                                            </div>

                                            {/* 3 Signal columns */}
                                            <div className="grid md:grid-cols-3 gap-px bg-border rounded-lg overflow-hidden">
                                              {/* ── LOCATION ───────────────────── */}
                                              <div className="bg-background p-4 space-y-3">
                                                <div className="flex items-center justify-between">
                                                  <div className="flex items-center gap-1.5">
                                                    <MapPinned className="h-3.5 w-3.5 text-muted-foreground" />
                                                    <span className="text-[11px] font-semibold text-foreground uppercase tracking-wide">Location</span>
                                                  </div>
                                                  {riskBadge(session.location.risk)}
                                                </div>
                                                <div>
                                                  <div className="text-sm font-medium text-foreground">{session.location.city}</div>
                                                  <div className="text-[11px] text-muted-foreground">{session.location.country}</div>
                                                  <div className="text-[10px] text-muted-foreground/70 font-mono mt-0.5">{session.location.coords}</div>
                                                </div>
                                                <div className="space-y-1.5 pt-2 border-t border-border">
                                                  {detailRow("IP Timezone", session.location.ipTimezone, true)}
                                                  {detailRow("Browser TZ", session.location.browserTimezone, true)}
                                                  {session.location.tzMismatch && (
                                                    <div className="flex items-center gap-1.5 py-1 px-2 rounded bg-amber-50 mt-1">
                                                      <AlertTriangle className="h-3 w-3 text-amber-500 shrink-0" />
                                                      <span className="text-[10px] font-medium text-amber-700">TZ Mismatch ({session.location.offsetMinutes}m offset)</span>
                                                    </div>
                                                  )}
                                                  {detailRow("Locations (24h)", String(session.location.recentLocations24h))}
                                                  {detailRow("Locations (7d)", String(session.location.recentLocations7d))}
                                                </div>
                                              </div>

                                              {/* ── NETWORK ────────────────────── */}
                                              <div className="bg-background p-4 space-y-3">
                                                <div className="flex items-center justify-between">
                                                  <div className="flex items-center gap-1.5">
                                                    <Wifi className="h-3.5 w-3.5 text-muted-foreground" />
                                                    <span className="text-[11px] font-semibold text-foreground uppercase tracking-wide">Network</span>
                                                  </div>
                                                  {riskBadge(session.network.risk)}
                                                </div>
                                                <div>
                                                  <div className="flex items-center gap-1.5">
                                                    <span className="text-sm font-medium font-mono text-foreground">{session.network.ip}</span>
                                                    {copyBtn(session.network.ip)}
                                                  </div>
                                                  <div className="text-[11px] text-muted-foreground mt-0.5">{session.network.asn}</div>
                                                </div>
                                                <div className="space-y-1.5 pt-2 border-t border-border">
                                                  {detailRow("Type", session.network.type)}
                                                  {session.network.proxy && (
                                                    <div className="flex items-center gap-1.5 py-1 px-2 rounded bg-amber-50">
                                                      <AlertTriangle className="h-3 w-3 text-amber-500 shrink-0" />
                                                      <span className="text-[10px] font-medium text-amber-700">{session.network.proxy}</span>
                                                    </div>
                                                  )}
                                                  {detailRow("First seen", session.network.firstSeen)}
                                                  {detailRow("This project", `${session.network.sessionsThisProject} session${session.network.sessionsThisProject !== 1 ? "s" : ""}`)}
                                                  {detailRow("All projects", `${session.network.sessionsAllProjects} across ${session.network.projectsCount}`)}
                                                  {session.network.warning && (
                                                    <div className="flex items-center gap-1.5 py-1 px-2 rounded bg-amber-50 mt-1">
                                                      <AlertTriangle className="h-3 w-3 text-amber-500 shrink-0" />
                                                      <span className="text-[10px] font-medium text-amber-700">{session.network.warning}</span>
                                                    </div>
                                                  )}
                                                </div>
                                              </div>

                                              {/* ── DEVICE ─────────────────────── */}
                                              <div className="bg-background p-4 space-y-3">
                                                <div className="flex items-center justify-between">
                                                  <div className="flex items-center gap-1.5">
                                                    <Monitor className="h-3.5 w-3.5 text-muted-foreground" />
                                                    <span className="text-[11px] font-semibold text-foreground uppercase tracking-wide">Device</span>
                                                  </div>
                                                  {riskBadge(session.device.risk)}
                                                </div>
                                                <div>
                                                  <div className="flex items-center gap-1.5">
                                                    <span className="text-sm font-medium font-mono text-foreground truncate" title={session.device.deviceId}>{truncateId(session.device.deviceId)}</span>
                                                    {copyBtn(session.device.deviceId)}
                                                  </div>
                                                  <div className="text-[11px] text-muted-foreground mt-0.5">{session.device.type}</div>
                                                </div>
                                                <div className="space-y-1.5 pt-2 border-t border-border">
                                                  {detailRow("OS", session.device.os)}
                                                  {detailRow("Browser", session.device.browser)}
                                                  {detailRow("First seen", session.device.firstSeen)}
                                                  {detailRow("This project", `${session.device.sessionsThisProject} session${session.device.sessionsThisProject !== 1 ? "s" : ""}`)}
                                                  {detailRow("All projects", `${session.device.sessionsAllProjects} across ${session.device.projectsCount}`)}
                                                  {session.device.warning && (
                                                    <div className={cn("flex items-center gap-1.5 py-1 px-2 rounded mt-1", session.device.risk === "high" ? "bg-red-50" : "bg-amber-50")}>
                                                      <AlertTriangle className={cn("h-3 w-3 shrink-0", session.device.risk === "high" ? "text-red-500" : "text-amber-500")} />
                                                      <span className={cn("text-[10px] font-medium", session.device.risk === "high" ? "text-red-600" : "text-amber-700")}>{session.device.warning}</span>
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            </div>

                                            {/* User Agent bar */}
                                            <div className="mt-4 flex items-start gap-3 py-2.5 px-3 rounded-lg bg-muted/50">
                                              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap pt-px">UA</span>
                                              <p className="text-[10px] text-muted-foreground font-mono leading-relaxed break-all flex-1">{session.device.userAgent}</p>
                                              {copyBtn(session.device.userAgent)}
                                            </div>

                                            {/* Passed checks */}
                                            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
                                              {passedChecks.map((check) => (
                                                <span key={check} className="text-[10px] text-muted-foreground/70 inline-flex items-center gap-0.5">
                                                  <Check className="h-2.5 w-2.5 text-emerald-400" />
                                                  {check}
                                                </span>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  )}
                                </React.Fragment>
                              )
                            })}
                          </>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-muted/30">
                    <span className="text-xs text-muted-foreground">
                      Rows Displayed: <span className="font-medium text-foreground">{filteredSessions.length}</span>
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Total Results: <span className="font-medium text-foreground">{totalSessions.toLocaleString()}</span>
                    </span>
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
