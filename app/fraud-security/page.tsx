"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, RefreshCw, AlertTriangle, CheckCircle2, Info } from "lucide-react"
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Mock data for security checks
const SECURITY_CHECKS = [
  {
    name: "IP Deduplication",
    status: "pass",
    flagged: 2847,
    total: 45230,
    description: "Detects repeated access attempts from the same IP address",
  },
  {
    name: "Device Deduplication",
    status: "pass",
    flagged: 1923,
    total: 45230,
    description: "Identifies multiple attempts from the same device",
  },
  {
    name: "Location Validation",
    status: "fail",
    flagged: 12847,
    total: 45230,
    description: "Verifies claimed location matches actual location",
    details: {
      timezoneMismatch: 8340,
      countryMismatch: 4507,
      avgTimezoneOffset: 6.5,
    },
  },
  {
    name: "Automation Detection",
    status: "pass",
    flagged: 892,
    total: 45230,
    description: "Identifies bot-like behavior and automated scripts",
  },
  {
    name: "VPN Usage",
    status: "fail",
    flagged: 18234,
    total: 45230,
    description: "Detects virtual private network and proxy usage",
    details: {
      publicDataCenter: 9850, // High risk
      consumerVPN: 6720, // Medium risk
      privacyRelay: 1664, // Low risk (Apple iCloud, etc.)
      causalityInsight: "72% of VPN failures resulted in an automatic Location Validation fail",
    },
  },
  {
    name: "Trusted Browser/OS",
    status: "pass",
    flagged: 567,
    total: 45230,
    description: "Detects suspicious or modified browsers and operating systems",
  },
]

export default function FraudSecurityDashboard() {
  return (
    <TooltipProvider>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Fraud Report</h1>
            <p className="text-muted-foreground mt-1">Real-time fraud detection and security monitoring</p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Calendar className="h-4 w-4" />
              Last 30 days
            </Button>
            <Button size="sm" variant="outline" className="gap-2 bg-transparent">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* PASS/FAIL Summary Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SECURITY_CHECKS.map((check) => {
            const failureRate = ((check.flagged / check.total) * 100).toFixed(1)
            const isPassing = check.status === "pass"

            return (
              <Card
                key={check.name}
                className={`border-2 transition-all hover:shadow-md ${
                  isPassing ? "border-green-200 bg-green-50/30" : "border-red-200 bg-red-50/30"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-base font-semibold">{check.name}</CardTitle>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-gray-400 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="text-sm">{check.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                    <Badge
                      variant={isPassing ? "default" : "destructive"}
                      className={`font-semibold ${
                        isPassing ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {isPassing ? (
                        <>
                          <CheckCircle2 className="h-3 w-3 mr-1" /> PASS
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="h-3 w-3 mr-1" /> FAIL
                        </>
                      )}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Primary Stats */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">{check.flagged.toLocaleString()}</span>
                    <span className="text-sm text-gray-500">/ {check.total.toLocaleString()}</span>
                  </div>
                  <div className="text-sm text-gray-600">{failureRate}% failure rate</div>

                  {/* Secondary Evidence - Location Validation Details */}
                  {check.name === "Location Validation" && check.details && (
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Failure Breakdown
                      </div>

                      {/* Horizontal Bar Chart */}
                      <div className="space-y-2">
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-700">Timezone Mismatch</span>
                            <span className="font-medium text-gray-900">
                              {check.details.timezoneMismatch.toLocaleString()}
                            </span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-red-500 rounded-full transition-all"
                              style={{
                                width: `${(check.details.timezoneMismatch / check.flagged) * 100}%`,
                              }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-700">Country Mismatch</span>
                            <span className="font-medium text-gray-900">
                              {check.details.countryMismatch.toLocaleString()}
                            </span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-orange-500 rounded-full transition-all"
                              style={{
                                width: `${(check.details.countryMismatch / check.flagged) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Data Callout */}
                      <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                        <Info className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        <span className="text-xs text-blue-900">
                          <strong>Avg. Timezone Offset:</strong> {check.details.avgTimezoneOffset} hrs
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Secondary Evidence - VPN Usage Details */}
                  {check.name === "VPN Usage" && check.details && (
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Connection Composition
                      </div>

                      {/* Donut Chart */}
                      <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                          <Pie
                            data={[
                              { name: "Public Data Center", value: check.details.publicDataCenter, color: "#ef4444" },
                              { name: "Consumer VPN", value: check.details.consumerVPN, color: "#f97316" },
                              { name: "Privacy Relay", value: check.details.privacyRelay, color: "#3b82f6" },
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={70}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {[
                              { name: "Public Data Center", value: check.details.publicDataCenter, color: "#ef4444" },
                              { name: "Consumer VPN", value: check.details.consumerVPN, color: "#f97316" },
                              { name: "Privacy Relay", value: check.details.privacyRelay, color: "#3b82f6" },
                            ].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <RechartsTooltip
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #e5e7eb",
                              borderRadius: "8px",
                              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                              fontSize: "13px",
                              padding: "8px 12px",
                            }}
                            formatter={(value: number) => [
                              `${value.toLocaleString()} (${((value / check.flagged) * 100).toFixed(1)}%)`,
                              "",
                            ]}
                          />
                        </PieChart>
                      </ResponsiveContainer>

                      {/* Legend */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <span className="text-gray-700">Public Data Center</span>
                            <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                              High Risk
                            </Badge>
                          </div>
                          <span className="font-medium text-gray-900">
                            {check.details.publicDataCenter.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-orange-500" />
                            <span className="text-gray-700">Consumer VPN</span>
                            <Badge
                              variant="secondary"
                              className="text-[10px] px-1.5 py-0 bg-orange-100 text-orange-700"
                            >
                              Med Risk
                            </Badge>
                          </div>
                          <span className="font-medium text-gray-900">
                            {check.details.consumerVPN.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                            <span className="text-gray-700">Privacy Relay</span>
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-blue-100 text-blue-700">
                              Low Risk
                            </Badge>
                          </div>
                          <span className="font-medium text-gray-900">
                            {check.details.privacyRelay.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Causality Insight Footer */}
                      <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="text-xs text-amber-900">
                          <strong className="block mb-0.5">Multi-Signal Context:</strong>
                          {check.details.causalityInsight}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </TooltipProvider>
  )
}
