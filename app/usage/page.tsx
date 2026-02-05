"use client"

import * as React from "react"
import { useState } from "react"
import {
  Calendar,
  RefreshCw,
  Check,
  ChevronsUpDown,
  MapPin,
  Shield,
  Globe,
  Fingerprint,
  Info,
  AlertCircle,
  ChevronRight,
  Bot,
  ChevronLeft,
} from "lucide-react"
import { Bar, BarChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, XAxis, YAxis, Cell, Legend } from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const SECURITY_CHECKS = {
  bad: [
    {
      name: "IP Deduplication",
      count: 198742,
      description: "Detects repeated access attempts from the same IP address.",
      tooltip:
        "Identifies when multiple participants try to access from the same IP, which may indicate fraud or automated attacks.",
    },
    {
      name: "Device Deduplication",
      count: 175631,
      description: "Identifies multiple attempts from the same device.",
      tooltip: "Tracks unique device fingerprints to prevent the same device from participating multiple times.",
    },
    {
      name: "ID Deduplication",
      count: 92163,
      description: "Prevents duplicate entries using the same identifier.",
      tooltip: "Blocks repeated submissions using the same user ID, email, or other unique identifiers.",
    },
    {
      name: "Location Lock",
      count: 45872,
      description: "Restricts access to specific geographic locations.",
      tooltip: "Enforces geographic boundaries by blocking access from unauthorized regions or countries.",
    },
    {
      name: "Automation Detection",
      count: 18935,
      description: "Identifies bot-like behavior and automated scripts.",
      tooltip: "Detects patterns indicating non-human interaction such as rapid clicks or scripted behavior.",
    },
    {
      name: "IP Blocklist",
      count: 15246,
      description: "Blocks known malicious IP addresses.",
      tooltip: "Prevents access from IPs with a history of fraudulent or abusive activity.",
    },
    {
      name: "Untrusted Browser/OS",
      count: 9874,
      description: "Detects suspicious or modified browsers and operating systems.",
      tooltip: "Identifies browsers or OS versions commonly used for fraud or that have been tampered with.",
    },
    {
      name: "Quality Questions",
      count: 7532,
      description: "Validates attention and quality through screening questions.",
      tooltip: "Uses attention checks and quality questions to ensure legitimate participant engagement.",
    },
    {
      name: "AI Detection",
      count: 5891,
      description: "Identifies AI-generated or bot-assisted responses.",
      tooltip: "Detects patterns consistent with AI-written text or automated response generation.",
    },
  ],
  suspicious: [
    {
      name: "Location Validation",
      count: 87521,
      description: "Verifies that claimed location matches actual location.",
      tooltip: "Cross-references user-provided location data with IP geolocation and device signals.",
    },
    {
      name: "VPN Usage",
      count: 74329,
      description: "Detects virtual private network usage.",
      tooltip: "Identifies traffic routed through VPN services which may be used to mask true location.",
    },
    {
      name: "Device Tampering",
      count: 62438,
      description: "Identifies modified device fingerprints.",
      tooltip: "Detects when device properties have been altered to evade detection systems.",
    },
    {
      name: "Virtual Machine",
      count: 54219,
      description: "Detects virtualized environments.",
      tooltip: "Identifies when participants are using virtual machines, which may indicate automation.",
    },
    {
      name: "Dev Tools",
      count: 43762,
      description: "Monitors browser developer console activity.",
      tooltip: "Detects when browser dev tools are open, which may indicate tampering attempts.",
    },
    {
      name: "Privacy-Focused Settings",
      count: 38945,
      description: "Identifies extreme privacy configurations.",
      tooltip: "Detects unusually restrictive privacy settings that may be used to avoid detection.",
    },
    {
      name: "Tor Exit Node",
      count: 21873,
      description: "Detects Tor network connections.",
      tooltip: "Identifies traffic routed through the Tor anonymity network.",
    },
    {
      name: "High-Activity Device",
      count: 18542,
      description: "Flags devices with unusually high activity patterns.",
      tooltip: "Detects devices that have participated in an abnormally large number of sessions.",
    },
    {
      name: "Incognito Mode",
      count: 15234,
      description: "Identifies private browsing mode usage.",
      tooltip: "Detects when users are browsing in incognito or private mode.",
    },
  ],
}

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

const SIGNAL_COLORS = {
  "IP Deduplication": "#8b5cf6", // purple
  "Device Deduplication": "#ec4899", // pink
  "ID Deduplication": "#f59e0b", // amber
  "Location Lock": "#10b981", // emerald
  "Location Validation": "#3b82f6", // blue
  "Automation Detection": "#ef4444", // red
  "IP Blocklist": "#f97316", // orange
  "Untrusted Browser/OS": "#06b6d4", // cyan
  "VPN Usage": "#8b5cf6", // purple
  "Device Tampering": "#ec4899", // pink
  "Virtual Machine": "#f59e0b", // amber
  "Developer Tools Usage": "#10b981", // emerald
  "Privacy-Focused Settings": "#3b82f6", // blue
  "Tor Usage": "#ef4444", // red
  "Public Proxy": "#f97316", // orange
  "High-Activity Device": "#06b6d4", // cyan
  "Incognito Usage": "#a855f7", // purple
}

const FRAUD_MAP_DATA = [
  { country: "United States", count: 45230, code: "US", color: "#ef4444" }, // Dark red - high risk
  { country: "China", count: 38150, code: "CN", color: "#f87171" }, // Medium-dark red
  { country: "Russia", count: 29480, code: "RU", color: "#f87171" }, // Medium-dark red
  { country: "India", count: 21890, code: "IN", color: "#fca5a5" }, // Medium red
  { country: "Brazil", count: 18750, code: "BR", color: "#fca5a5" }, // Medium red
  { country: "Nigeria", count: 15620, code: "NG", color: "#fecaca" }, // Light-medium red
  { country: "Vietnam", count: 12340, code: "VN", color: "#fecaca" }, // Light-medium red
  { country: "Indonesia", count: 9870, code: "ID", color: "#fee2e2" }, // Light red
  { country: "Philippines", count: 8450, code: "PH", color: "#fee2e2" }, // Light red
  { country: "Mexico", count: 7120, code: "MX", color: "#fee2e2" }, // Light red
]

export default function APIUsagePage() {
  const [date, setDate] = React.useState<Date>(new Date())
  const [activeTab, setActiveTab] = React.useState<string>("suspicious")
  const [selectedClient, setSelectedClient] = React.useState<string>("all")
  const [selectedProject, setSelectedProject] = React.useState<string>("all")
  const [clientOpen, setClientOpen] = React.useState(false)
  const [projectOpen, setProjectOpen] = React.useState(false)
  const [clientSearch, setClientSearch] = React.useState("")
  const [projectSearch, setProjectSearch] = React.useState("")
  const [timePeriod, setTimePeriod] = React.useState<"day" | "week" | "month">("day")
  const [hoveredCountry, setHoveredCountry] = React.useState<string | null>(null)
  const [signalsView, setSignalsView] = useState<"chart" | "list">("chart")
  const [signalTypeFilter, setSignalTypeFilter] = useState<"all" | "bad" | "suspicious">("all")

  const [expandedSignal, setExpandedSignal] = React.useState<string | null>(null)
  const [currentPage, setCurrentPage] = React.useState(1)
  const signalsPerPage = 6

  const totalStarts = 1355345
  const goodCount = 1016508
  const suspiciousCount = 108427
  const badCount = 230408

  const goodPercent = ((goodCount / totalStarts) * 100).toFixed(0)
  const suspiciousPercent = ((suspiciousCount / totalStarts) * 100).toFixed(0)
  const badPercent = ((badCount / totalStarts) * 100).toFixed(0)

  const dailyData = [
    { date: "Mar 1", suspicious: 3200, bad: 7100 },
    { date: "Mar 2", suspicious: 2800, bad: 6400 },
    { date: "Mar 3", suspicious: 3500, bad: 7800 },
    { date: "Mar 4", suspicious: 2950, bad: 6900 },
    { date: "Mar 5", suspicious: 4100, bad: 8200 },
    { date: "Mar 6", suspicious: 3800, bad: 7650 },
    { date: "Mar 7", suspicious: 3300, bad: 7200 },
  ]

  const weeklyData = [
    { date: "Week 1", suspicious: 9500, bad: 21400 },
    { date: "Week 2", suspicious: 11900, bad: 23850 },
    { date: "Week 3", suspicious: 8700, bad: 19300 },
    { date: "Week 4", suspicious: 10200, bad: 22500 },
  ]

  const monthlyData = [
    { date: "Jan", suspicious: 32000, bad: 71000 },
    { date: "Feb", suspicious: 35000, bad: 78000 },
    { date: "Mar", suspicious: 40300, bad: 87050 },
  ]

  const chartData = React.useMemo(() => {
    if (timePeriod === "week") return weeklyData
    if (timePeriod === "month") return monthlyData
    return dailyData
  }, [timePeriod])

  const allSignals = [
    ...SECURITY_CHECKS.bad.map((s) => ({ ...s, type: "bad" as const })),
    ...SECURITY_CHECKS.suspicious.map((s) => ({ ...s, type: "suspicious" as const })),
  ]

  const filteredSignals = allSignals.filter((signal) => {
    if (signalTypeFilter === "all") return true
    return signal.type === signalTypeFilter
  })

  const totalPages = Math.ceil(filteredSignals.length / signalsPerPage)
  const startIndex = (currentPage - 1) * signalsPerPage
  const endIndex = startIndex + signalsPerPage
  const paginatedSignals = filteredSignals.slice(startIndex, endIndex)

  React.useEffect(() => {
    setCurrentPage(1)
  }, [signalTypeFilter])

  const currentChecks = SECURITY_CHECKS[activeTab as keyof typeof SECURITY_CHECKS]
  const maxCount = Math.max(...currentChecks.map((check) => check.count))
  const totalFraudCount = FRAUD_MAP_DATA.reduce((sum, item) => sum + item.count, 0)

  const availableProjects = React.useMemo(() => {
    if (!selectedClient) return []
    const client = CLIENTS.find((c) => c.id === selectedClient)
    return client?.projects || []
  }, [selectedClient])

  React.useEffect(() => {
    setSelectedProject("")
  }, [selectedClient])

  const signalTypes: Record<string, "bad" | "suspicious"> = {
    "IP Deduplication": "bad",
    "Device Deduplication": "bad",
    "ID Deduplication": "bad",
    "Location Lock": "bad",
    "Automation Detection": "bad",
    "IP Blocklist": "bad",
    "Untrusted Browser/OS": "bad",
    "Quality Questions": "bad",
    "AI Detection": "bad",
    "Location Validation": "suspicious",
    "VPN Usage": "suspicious",
    "Device Tampering": "suspicious",
    "Virtual Machine": "suspicious",
    "Dev Tools": "suspicious",
    "Privacy-Focused Settings": "suspicious",
    "Tor Exit Node": "suspicious",
    "High-Activity Device": "suspicious",
    "Incognito Mode": "suspicious",
  }

  return (
    <TooltipProvider>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">API Usage</h1>
            <p className="text-muted-foreground mt-1">Monitor your API performance and security metrics</p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Calendar className="h-4 w-4" />
              Last 30 days
            </Button>

            {/* Replaced Select with searchable Popover combobox for client filter */}
            <Popover open={clientOpen} onOpenChange={setClientOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={clientOpen}
                  className="w-[200px] justify-between bg-transparent"
                >
                  {selectedClient && selectedClient !== "all"
                    ? CLIENTS.find((client) => client.id === selectedClient)?.name
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
                      <CommandItem
                        value="all"
                        onSelect={() => {
                          setSelectedClient("all")
                          setClientOpen(false)
                        }}
                      >
                        <Check className={cn("mr-2 h-4 w-4", selectedClient === "all" ? "opacity-100" : "opacity-0")} />
                        All Clients
                      </CommandItem>
                      {CLIENTS.map((client) => (
                        <CommandItem
                          key={client.id}
                          value={client.name}
                          onSelect={() => {
                            setSelectedClient(client.id)
                            setClientOpen(false)
                          }}
                        >
                          <Check
                            className={cn("mr-2 h-4 w-4", selectedClient === client.id ? "opacity-100" : "opacity-0")}
                          />
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
                    ? availableProjects.find((project) => project.id === selectedProject)?.name
                    : "All Projects"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[220px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Search projects..."
                    value={projectSearch}
                    onValueChange={setProjectSearch}
                  />
                  <CommandList>
                    <CommandEmpty>No project found.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        value="all"
                        onSelect={() => {
                          setSelectedProject("all")
                          setProjectOpen(false)
                        }}
                      >
                        <Check
                          className={cn("mr-2 h-4 w-4", selectedProject === "all" ? "opacity-100" : "opacity-0")}
                        />
                        All Projects
                      </CommandItem>
                      {availableProjects.map((project) => (
                        <CommandItem
                          key={project.id}
                          value={project.id}
                          onSelect={(currentValue) => {
                            setSelectedProject(currentValue === selectedProject ? "" : currentValue)
                            setProjectOpen(false)
                          }}
                        >
                          <Check
                            className={cn("mr-2 h-4 w-4", selectedProject === project.id ? "opacity-100" : "opacity-0")}
                          />
                          {project.name}
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

        <div className="grid gap-4 md:grid-cols-2">
          {/* Total Starts Card */}
          <Card className="border border-gray-100 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col">
                <div className="text-5xl font-bold mb-1">{totalStarts.toLocaleString()}</div>
                <div className="text-sm text-gray-500 font-medium">Total Starts</div>
              </div>
            </CardContent>
          </Card>

          {/* Detect Score Card */}
          <Card className="border border-gray-100 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-around">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Good</span>
                  </div>
                  <div className="text-3xl font-bold mb-0.5">{goodCount.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">{goodPercent}%</div>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-3 w-3 rounded-full bg-teal-500"></div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Suspicious</span>
                  </div>
                  <div className="text-3xl font-bold mb-0.5">{suspiciousCount.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">{suspiciousPercent}%</div>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Bad</span>
                  </div>
                  <div className="text-3xl font-bold mb-0.5">{badCount.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">{badPercent}%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Daily Traffic Breakdown</CardTitle>
            <div className="flex items-center gap-2">
              <Select value={timePeriod} onValueChange={setTimePeriod}>
                <SelectTrigger className="w-[120px] h-8 bg-transparent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <RefreshCw className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "14px",
                    padding: "8px 12px",
                  }}
                  cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: "20px" }}
                  iconType="circle"
                  formatter={(value) => <span style={{ color: "#6b7280", fontSize: "12px" }}>{value}</span>}
                />
                <Bar dataKey="suspicious" fill="rgb(20, 184, 166)" radius={[8, 8, 0, 0]} name="Suspicious" />
                <Bar dataKey="bad" fill="rgb(239, 68, 68)" radius={[8, 8, 0, 0]} name="Bad" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border border-gray-100 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Security Signals Breakdown</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Click on any signal to view detailed failure analysis and reconciliation insights
                </p>
              </div>
              <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setSignalTypeFilter("all")}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    signalTypeFilter === "all"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSignalTypeFilter("bad")}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    signalTypeFilter === "bad"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Bad
                </button>
                <button
                  onClick={() => setSignalTypeFilter("suspicious")}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    signalTypeFilter === "suspicious"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Suspicious
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {paginatedSignals.map((signal) => {
                const isExpanded = expandedSignal === signal.name
                const borderColor =
                  signal.type === "bad" ? "border-red-300 bg-red-50/50" : "border-orange-300 bg-orange-50/50"
                const bgColor = signal.type === "bad" ? "bg-red-100" : "bg-orange-100"
                const iconColor = signal.type === "bad" ? "text-red-600" : "text-orange-600"
                const borderTopColor = signal.type === "bad" ? "border-red-200" : "border-orange-200"

                return (
                  <div
                    key={signal.name}
                    className={`border rounded-lg transition-all ${
                      isExpanded ? borderColor : "border-gray-200 hover:border-gray-300 cursor-pointer"
                    }`}
                    onClick={() => setExpandedSignal(isExpanded ? null : signal.name)}
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`rounded-lg ${bgColor} p-2`}>
                            {signal.name === "Location Validation" && <MapPin className={`h-5 w-5 ${iconColor}`} />}
                            {signal.name === "VPN Usage" && <Shield className={`h-5 w-5 ${iconColor}`} />}
                            {signal.name === "IP Deduplication" && <Globe className={`h-5 w-5 ${iconColor}`} />}
                            {signal.name === "Bot Detection" && <Bot className={`h-5 w-5 ${iconColor}`} />}
                            {signal.name === "Device Deduplication" && (
                              <Fingerprint className={`h-5 w-5 ${iconColor}`} />
                            )}
                            {signal.name === "Device Tampering" && <Fingerprint className={`h-5 w-5 ${iconColor}`} />}
                            {![
                              "Location Validation",
                              "VPN Usage",
                              "IP Deduplication",
                              "Bot Detection",
                              "Device Deduplication",
                              "Device Tampering",
                            ].includes(signal.name) && <Shield className={`h-5 w-5 ${iconColor}`} />}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{signal.name}</div>
                            <div className="text-sm text-gray-500">{signal.count.toLocaleString()} detected</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-500">
                              {signal.type === "bad" ? "Bad Signal" : "Suspicious Signal"}
                            </div>
                            <div className="text-lg font-bold text-gray-900">
                              {((signal.count / totalStarts) * 100).toFixed(1)}%
                            </div>
                          </div>
                          <ChevronRight
                            className={`h-5 w-5 text-gray-400 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                          />
                        </div>
                      </div>

                      {isExpanded && signal.name === "Location Validation" && (
                        <div className={`mt-6 pt-6 border-t ${borderTopColor} space-y-4`}>
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Failure Breakdown
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-sm text-gray-700">Timezone Mismatch</span>
                              <span className="text-sm font-medium text-gray-900">
                                60% ({Math.round(signal.count * 0.6).toLocaleString()} failures)
                              </span>
                            </div>
                            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-orange-500 rounded-full transition-all"
                                style={{ width: "60%" }}
                              ></div>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-sm text-gray-700">Country Mismatch</span>
                              <span className="text-sm font-medium text-gray-900">
                                40% ({Math.round(signal.count * 0.4).toLocaleString()} failures)
                              </span>
                            </div>
                            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-red-500 rounded-full transition-all"
                                style={{ width: "40%" }}
                              ></div>
                            </div>
                          </div>

                          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                            <div className="text-xs text-blue-900">
                              <span className="font-semibold">Avg. Timezone Offset:</span> 6.5 hrs
                            </div>
                          </div>
                        </div>
                      )}

                      {isExpanded && signal.name === "VPN Usage" && (
                        <div className={`mt-6 pt-6 border-t ${borderTopColor} space-y-4`}>
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Connection Composition
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="flex-shrink-0">
                              <ResponsiveContainer width={110} height={110}>
                                <PieChart>
                                  <Pie
                                    data={[
                                      { name: "Public Data Center", value: Math.round(signal.count * 0.5) },
                                      { name: "Consumer VPN", value: Math.round(signal.count * 0.4) },
                                      { name: "Privacy Relay", value: Math.round(signal.count * 0.1) },
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={32}
                                    outerRadius={50}
                                    paddingAngle={2}
                                    dataKey="value"
                                  >
                                    <Cell fill="#ef4444" />
                                    <Cell fill="#f97316" />
                                    <Cell fill="#3b82f6" />
                                  </Pie>
                                </PieChart>
                              </ResponsiveContainer>
                            </div>

                            <div className="flex-1 space-y-2.5">
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                  <span className="text-gray-700">Public Data Center</span>
                                  <span className="text-xs text-gray-400">(High Risk)</span>
                                </div>
                                <span className="font-medium text-gray-900">
                                  50% ({Math.round(signal.count * 0.5).toLocaleString()})
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                  <span className="text-gray-700">Consumer VPN</span>
                                  <span className="text-xs text-gray-400">(Medium)</span>
                                </div>
                                <span className="font-medium text-gray-900">
                                  40% ({Math.round(signal.count * 0.4).toLocaleString()})
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                  <span className="text-gray-700">Privacy Relay</span>
                                  <span className="text-xs text-gray-400">(Low Risk)</span>
                                </div>
                                <span className="font-medium text-gray-900">
                                  10% ({Math.round(signal.count * 0.1).toLocaleString()})
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                            <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                            <div className="text-xs text-amber-900">
                              <span className="font-semibold">Causality Insight:</span> 72% of VPN failures resulted in
                              an automatic Location Validation fail.
                            </div>
                          </div>
                        </div>
                      )}

                      {isExpanded && !["Location Validation", "VPN Usage"].includes(signal.name) && (
                        <div className={`mt-6 pt-6 border-t ${borderTopColor}`}>
                          <div className="text-sm text-gray-600">{signal.description}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
                <div className="text-sm text-gray-500">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredSignals.length)} of {filteredSignals.length}{" "}
                  signals
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="min-w-[36px]"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Fraud Map with Rankings Card */}
        <Card className="border border-gray-100 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Fraud Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Simple Map Visual */}
              <div className="relative w-full h-[140px] flex items-center justify-center bg-gray-50 rounded-lg">
                <svg viewBox="0 0 1000 500" className="w-full h-full">
                  {/* North America - USA */}
                  <g
                    onMouseEnter={() => setHoveredCountry("US")}
                    onMouseLeave={() => setHoveredCountry(null)}
                    style={{ cursor: "pointer" }}
                  >
                    <path
                      d="M 50 120 Q 60 100 80 95 L 120 85 L 150 90 L 180 100 L 200 110 L 210 130 L 220 150 L 215 170 L 200 185 L 180 195 L 160 200 L 140 195 L 120 185 L 100 175 L 80 160 L 65 145 Z"
                      fill={FRAUD_MAP_DATA.find((d) => d.code === "US")?.color || "#e5e7eb"}
                      stroke="#fff"
                      strokeWidth="0.5"
                    />
                    {hoveredCountry === "US" && (
                      <foreignObject x="120" y="120" width="150" height="60">
                        <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
                          <div className="font-semibold">United States</div>
                          <div className="text-gray-300">
                            {FRAUD_MAP_DATA.find((d) => d.code === "US")?.count.toLocaleString()} incidents
                          </div>
                          <div className="text-gray-400">
                            {(
                              ((FRAUD_MAP_DATA.find((d) => d.code === "US")?.count || 0) / totalFraudCount) *
                              100
                            ).toFixed(1)}
                            % of total
                          </div>
                        </div>
                      </foreignObject>
                    )}
                  </g>

                  {/* Canada */}
                  <path
                    d="M 60 50 L 100 45 L 140 50 L 180 55 L 220 65 L 240 75 L 235 90 L 220 95 L 200 92 L 180 88 L 150 85 L 120 80 L 90 75 L 70 65 Z"
                    fill="#e5e7eb"
                    stroke="#fff"
                    strokeWidth="0.5"
                  />

                  {/* Mexico */}
                  <g
                    onMouseEnter={() => setHoveredCountry("MX")}
                    onMouseLeave={() => setHoveredCountry(null)}
                    style={{ cursor: "pointer" }}
                  >
                    <path
                      d="M 130 200 L 160 195 L 180 200 L 185 215 L 175 225 L 155 230 L 140 225 L 130 215 Z"
                      fill={FRAUD_MAP_DATA.find((d) => d.code === "MX")?.color || "#e5e7eb"}
                      stroke="#fff"
                      strokeWidth="0.5"
                    />
                    {hoveredCountry === "MX" && (
                      <foreignObject x="120" y="205" width="150" height="60">
                        <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
                          <div className="font-semibold">Mexico</div>
                          <div className="text-gray-300">
                            {FRAUD_MAP_DATA.find((d) => d.code === "MX")?.count.toLocaleString()} incidents
                          </div>
                          <div className="text-gray-400">
                            {(
                              ((FRAUD_MAP_DATA.find((d) => d.code === "MX")?.count || 0) / totalFraudCount) *
                              100
                            ).toFixed(1)}
                            % of total
                          </div>
                        </div>
                      </foreignObject>
                    )}
                  </g>

                  {/* South America - Brazil */}
                  <g
                    onMouseEnter={() => setHoveredCountry("BR")}
                    onMouseLeave={() => setHoveredCountry(null)}
                    style={{ cursor: "pointer" }}
                  >
                    <path
                      d="M 260 260 L 290 255 L 310 265 L 320 285 L 315 310 L 300 330 L 280 340 L 260 345 L 245 335 L 240 315 L 245 290 Z"
                      fill={FRAUD_MAP_DATA.find((d) => d.code === "BR")?.color || "#e5e7eb"}
                      stroke="#fff"
                      strokeWidth="0.5"
                    />
                    {hoveredCountry === "BR" && (
                      <foreignObject x="245" y="290" width="150" height="60">
                        <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
                          <div className="font-semibold">Brazil</div>
                          <div className="text-gray-300">
                            {FRAUD_MAP_DATA.find((d) => d.code === "BR")?.count.toLocaleString()} incidents
                          </div>
                          <div className="text-gray-400">
                            {(
                              ((FRAUD_MAP_DATA.find((d) => d.code === "BR")?.count || 0) / totalFraudCount) *
                              100
                            ).toFixed(1)}
                            % of total
                          </div>
                        </div>
                      </foreignObject>
                    )}
                  </g>

                  {/* South America - Other */}
                  <path
                    d="M 220 280 L 245 275 L 250 295 L 240 310 L 225 315 L 215 305 Z"
                    fill="#e5e7eb"
                    stroke="#fff"
                    strokeWidth="0.5"
                  />

                  {/* Europe - Western */}
                  <path
                    d="M 470 100 L 490 95 L 505 100 L 510 115 L 505 130 L 490 135 L 475 130 L 470 115 Z"
                    fill="#e5e7eb"
                    stroke="#fff"
                    strokeWidth="0.5"
                  />

                  {/* Russia */}
                  <g
                    onMouseEnter={() => setHoveredCountry("RU")}
                    onMouseLeave={() => setHoveredCountry(null)}
                    style={{ cursor: "pointer" }}
                  >
                    <path
                      d="M 520 80 L 600 70 L 680 75 L 720 85 L 740 95 L 735 115 L 720 130 L 680 140 L 640 145 L 600 140 L 560 135 L 530 125 L 515 110 Z"
                      fill={FRAUD_MAP_DATA.find((d) => d.code === "RU")?.color || "#e5e7eb"}
                      stroke="#fff"
                      strokeWidth="0.5"
                    />
                    {hoveredCountry === "RU" && (
                      <foreignObject x="580" y="100" width="150" height="60">
                        <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
                          <div className="font-semibold">Russia</div>
                          <div className="text-gray-300">
                            {FRAUD_MAP_DATA.find((d) => d.code === "RU")?.count.toLocaleString()} incidents
                          </div>
                          <div className="text-gray-400">
                            {(
                              ((FRAUD_MAP_DATA.find((d) => d.code === "RU")?.count || 0) / totalFraudCount) *
                              100
                            ).toFixed(1)}
                            % of total
                          </div>
                        </div>
                      </foreignObject>
                    )}
                  </g>

                  {/* Africa - North */}
                  <path
                    d="M 480 200 L 520 195 L 540 205 L 545 225 L 535 240 L 510 245 L 485 240 L 475 225 Z"
                    fill="#e5e7eb"
                    stroke="#fff"
                    strokeWidth="0.5"
                  />

                  {/* Nigeria */}
                  <g
                    onMouseEnter={() => setHoveredCountry("NG")}
                    onMouseLeave={() => setHoveredCountry(null)}
                    style={{ cursor: "pointer" }}
                  >
                    <path
                      d="M 490 250 L 510 245 L 520 255 L 515 270 L 500 275 L 485 270 Z"
                      fill={FRAUD_MAP_DATA.find((d) => d.code === "NG")?.color || "#e5e7eb"}
                      stroke="#fff"
                      strokeWidth="0.5"
                    />
                    {hoveredCountry === "NG" && (
                      <foreignObject x="450" y="255" width="150" height="60">
                        <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
                          <div className="font-semibold">Nigeria</div>
                          <div className="text-gray-300">
                            {FRAUD_MAP_DATA.find((d) => d.code === "NG")?.count.toLocaleString()} incidents
                          </div>
                          <div className="text-gray-400">
                            {(
                              ((FRAUD_MAP_DATA.find((d) => d.code === "NG")?.count || 0) / totalFraudCount) *
                              100
                            ).toFixed(1)}
                            % of total
                          </div>
                        </div>
                      </foreignObject>
                    )}
                  </g>

                  {/* Africa - South */}
                  <path
                    d="M 510 300 L 540 295 L 555 310 L 550 330 L 530 340 L 510 335 L 505 320 Z"
                    fill="#e5e7eb"
                    stroke="#fff"
                    strokeWidth="0.5"
                  />

                  {/* Middle East */}
                  <path
                    d="M 550 180 L 580 175 L 595 185 L 590 200 L 570 205 L 555 195 Z"
                    fill="#e5e7eb"
                    stroke="#fff"
                    strokeWidth="0.5"
                  />

                  {/* India */}
                  <g
                    onMouseEnter={() => setHoveredCountry("IN")}
                    onMouseLeave={() => setHoveredCountry(null)}
                    style={{ cursor: "pointer" }}
                  >
                    <path
                      d="M 620 210 L 645 205 L 655 220 L 650 240 L 630 250 L 615 245 L 615 225 Z"
                      fill={FRAUD_MAP_DATA.find((d) => d.code === "IN")?.color || "#e5e7eb"}
                      stroke="#fff"
                      strokeWidth="0.5"
                    />
                    {hoveredCountry === "IN" && (
                      <foreignObject x="580" y="220" width="150" height="60">
                        <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
                          <div className="font-semibold">India</div>
                          <div className="text-gray-300">
                            {FRAUD_MAP_DATA.find((d) => d.code === "IN")?.count.toLocaleString()} incidents
                          </div>
                          <div className="text-gray-400">
                            {(
                              ((FRAUD_MAP_DATA.find((d) => d.code === "IN")?.count || 0) / totalFraudCount) *
                              100
                            ).toFixed(1)}
                            % of total
                          </div>
                        </div>
                      </foreignObject>
                    )}
                  </g>

                  {/* China */}
                  <g
                    onMouseEnter={() => setHoveredCountry("CN")}
                    onMouseLeave={() => setHoveredCountry(null)}
                    style={{ cursor: "pointer" }}
                  >
                    <path
                      d="M 660 150 L 720 145 L 750 155 L 760 175 L 750 195 L 720 205 L 680 210 L 655 200 L 655 175 Z"
                      fill={FRAUD_MAP_DATA.find((d) => d.code === "CN")?.color || "#e5e7eb"}
                      stroke="#fff"
                      strokeWidth="0.5"
                    />
                    {hoveredCountry === "CN" && (
                      <foreignObject x="680" y="170" width="150" height="60">
                        <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
                          <div className="font-semibold">China</div>
                          <div className="text-gray-300">
                            {FRAUD_MAP_DATA.find((d) => d.code === "CN")?.count.toLocaleString()} incidents
                          </div>
                          <div className="text-gray-400">
                            {(
                              ((FRAUD_MAP_DATA.find((d) => d.code === "CN")?.count || 0) / totalFraudCount) *
                              100
                            ).toFixed(1)}
                            % of total
                          </div>
                        </div>
                      </foreignObject>
                    )}
                  </g>

                  {/* Vietnam */}
                  <g
                    onMouseEnter={() => setHoveredCountry("VN")}
                    onMouseLeave={() => setHoveredCountry(null)}
                    style={{ cursor: "pointer" }}
                  >
                    <path
                      d="M 710 220 L 725 215 L 730 235 L 722 250 L 710 245 Z"
                      fill={FRAUD_MAP_DATA.find((d) => d.code === "VN")?.color || "#e5e7eb"}
                      stroke="#fff"
                      strokeWidth="0.5"
                    />
                    {hoveredCountry === "VN" && (
                      <foreignObject x="670" y="225" width="150" height="60">
                        <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
                          <div className="font-semibold">Vietnam</div>
                          <div className="text-gray-300">
                            {FRAUD_MAP_DATA.find((d) => d.code === "VN")?.count.toLocaleString()} incidents
                          </div>
                          <div className="text-gray-400">
                            {(
                              ((FRAUD_MAP_DATA.find((d) => d.code === "VN")?.count || 0) / totalFraudCount) *
                              100
                            ).toFixed(1)}
                            % of total
                          </div>
                        </div>
                      </foreignObject>
                    )}
                  </g>

                  {/* Philippines */}
                  <g
                    onMouseEnter={() => setHoveredCountry("PH")}
                    onMouseLeave={() => setHoveredCountry(null)}
                    style={{ cursor: "pointer" }}
                  >
                    <path
                      d="M 760 230 L 775 225 L 780 240 L 772 252 L 760 248 Z"
                      fill={FRAUD_MAP_DATA.find((d) => d.code === "PH")?.color || "#e5e7eb"}
                      stroke="#fff"
                      strokeWidth="0.5"
                    />
                    {hoveredCountry === "PH" && (
                      <foreignObject x="720" y="230" width="150" height="60">
                        <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
                          <div className="font-semibold">Philippines</div>
                          <div className="text-gray-300">
                            {FRAUD_MAP_DATA.find((d) => d.code === "PH")?.count.toLocaleString()} incidents
                          </div>
                          <div className="text-gray-400">
                            {(
                              ((FRAUD_MAP_DATA.find((d) => d.code === "PH")?.count || 0) / totalFraudCount) *
                              100
                            ).toFixed(1)}
                            % of total
                          </div>
                        </div>
                      </foreignObject>
                    )}
                  </g>

                  {/* Indonesia */}
                  <g
                    onMouseEnter={() => setHoveredCountry("ID")}
                    onMouseLeave={() => setHoveredCountry(null)}
                    style={{ cursor: "pointer" }}
                  >
                    <path
                      d="M 690 280 L 730 275 L 760 285 L 765 300 L 750 310 L 720 312 L 690 305 Z"
                      fill={FRAUD_MAP_DATA.find((d) => d.code === "ID")?.color || "#e5e7eb"}
                      stroke="#fff"
                      strokeWidth="0.5"
                    />
                    {hoveredCountry === "ID" && (
                      <foreignObject x="680" y="285" width="150" height="60">
                        <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
                          <div className="font-semibold">Indonesia</div>
                          <div className="text-gray-300">
                            {FRAUD_MAP_DATA.find((d) => d.code === "ID")?.count.toLocaleString()} incidents
                          </div>
                          <div className="text-gray-400">
                            {(
                              ((FRAUD_MAP_DATA.find((d) => d.code === "ID")?.count || 0) / totalFraudCount) *
                              100
                            ).toFixed(1)}
                            % of total
                          </div>
                        </div>
                      </foreignObject>
                    )}
                  </g>

                  {/* Australia */}
                  <path
                    d="M 780 330 L 840 325 L 870 340 L 875 365 L 860 385 L 820 390 L 785 380 L 775 360 Z"
                    fill="#e5e7eb"
                    stroke="#fff"
                    strokeWidth="0.5"
                  />

                  {/* Japan */}
                  <path
                    d="M 800 180 L 820 175 L 830 190 L 825 210 L 810 215 L 800 205 Z"
                    fill="#e5e7eb"
                    stroke="#fff"
                    strokeWidth="0.5"
                  />

                  {/* Greenland */}
                  <path
                    d="M 340 30 L 380 25 L 410 35 L 415 55 L 400 70 L 365 75 L 340 65 Z"
                    fill="#e5e7eb"
                    stroke="#fff"
                    strokeWidth="0.5"
                  />
                </svg>
              </div>

              {/* Country Rankings List */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Top Countries by Bad Traffic
                </div>
                {FRAUD_MAP_DATA.slice(0, 8).map((item, index) => {
                  const percentage = ((item.count / totalFraudCount) * 100).toFixed(0)
                  return (
                    <div
                      key={item.country}
                      className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">
                          {index + 1}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
                          <span className="text-sm font-medium text-gray-900">{item.country}</span>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-600">{percentage}%</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
}
