"use client"

import {
  Calendar,
  Download,
  ExternalLink,
  RefreshCw,
  Lock,
  BarChart3,
  Code,
  KeyRound,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Pie, PieChart, Cell } from "recharts"
import React from "react"
import { useTrialTest } from "@/components/trial-test-context"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export default function UsagePage() {
  const { settings } = useTrialTest()
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("bad") // Declare activeTab and setActiveTab

  const handleRequestAccess = () => {
    setShowSuccessMessage(true)
  }

  if (!settings.hasApiAccess) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
          {showSuccessMessage && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-900">Request Submitted Successfully</AlertTitle>
              <AlertDescription className="text-green-800">
                Thank you for your interest! Our sales team will review your request and get in touch with you soon to
                enable API access on your account.
              </AlertDescription>
            </Alert>
          )}

          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
              <Code className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Unlock API Access</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Scale your fraud detection with direct API integration. Access real-time data, automate workflows, and
              build custom solutions.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Advanced Analytics</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Access detailed usage metrics, security check breakdowns, and comprehensive reporting through our
                  dashboard.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Lock className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Custom Workflows</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Integrate dtect's security checks directly into your application flow. Configure rules, and build
                  tailored fraud prevention workflows.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-2 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 space-y-2">
                  <h3 className="text-xl font-semibold">Ready to automate?</h3>
                  <p className="text-sm text-muted-foreground">
                    Streamline your workflow with direct API integration. Request access today to unlock volume
                    discounts and enable API keys on your account.
                  </p>
                </div>
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white gap-2"
                  onClick={handleRequestAccess}
                >
                  <KeyRound className="h-4 w-4" />
                  Request Access
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const pieData = [
    { name: "Suspicious", value: 108427, color: "rgb(20, 184, 166)" },
    { name: "Bad", value: 230408, color: "rgb(239, 68, 68)" },
  ]

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col gap-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">API Usage</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Calendar className="h-4 w-4" />
              <span>Mar 01, 2025 - Mar 31, 2025</span>
            </Button>
            <Button variant="default" className="flex items-center gap-2 bg-black text-white hover:bg-gray-800">
              <Download className="h-4 w-4" />
              <span>Download</span>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Starts</CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <RefreshCw className="h-4 w-4 text-gray-500" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,355,345</div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-2 border border-gray-100 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-sm font-medium">dtect Score</CardTitle>
                <p className="text-xs text-gray-500">Score for participants</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ExternalLink className="h-4 w-4 text-gray-500" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex-1 flex items-start justify-start gap-8">
                  <div className="flex flex-col items-start">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-4 w-4 rounded-full bg-red-100 flex items-center justify-center">
                        <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div>
                      </div>
                      <span className="text-red-500 text-sm font-medium">Bad</span>
                    </div>
                    <div className="text-2xl font-bold">230,408</div>
                  </div>

                  <div className="h-12 w-px bg-gray-200"></div>

                  <div className="flex flex-col items-start">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-4 w-4 rounded-full bg-teal-100 flex items-center justify-center">
                        <div className="h-1.5 w-1.5 rounded-full bg-teal-500"></div>
                      </div>
                      <span className="text-teal-500 text-sm font-medium">Suspicious</span>
                    </div>
                    <div className="text-2xl font-bold">108,427</div>
                  </div>

                  <div className="h-12 w-px bg-gray-200"></div>

                  <div className="flex flex-col items-start">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-4 w-4 rounded-full bg-green-100 flex items-center justify-center">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                      </div>
                      <span className="text-green-500 text-sm font-medium">Good</span>
                    </div>
                    <div className="text-2xl font-bold">1,016,508</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Suspicious vs Bad</CardTitle>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <RefreshCw className="h-4 w-4 text-gray-500" />
              </Button>
            </CardHeader>
            <CardContent className="flex flex-row items-center justify-between">
              <div className="flex-shrink-0">
                <PieChart width={88} height={88}>
                  <Pie
                    data={pieData}
                    cx={44}
                    cy={44}
                    innerRadius={25}
                    outerRadius={40}
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </div>
              <div className="flex flex-col gap-1 text-sm">
                {pieData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                    <span>{entry.name}</span>
                    <span className="font-medium">{entry.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-sm font-medium">Security Checks</CardTitle>
              <p className="text-xs text-gray-500">
                Participants are flagged on security checks below. One participant can be flagged on multiple security
                checks
              </p>
            </div>
            <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
              <button
                onClick={() => setActiveTab("bad")}
                className={`px-4 py-1.5 text-sm font-medium transition-colors min-w-[80px] ${
                  activeTab === "bad" ? "bg-black text-white" : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Bad
              </button>
              <button
                onClick={() => setActiveTab("suspicious")}
                className={`px-4 py-1.5 text-sm font-medium transition-colors min-w-[80px] ${
                  activeTab === "suspicious" ? "bg-black text-white" : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Suspicious
              </button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {activeTab === "bad" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">IP Deduplication</span>
                      <span className="text-sm font-medium">198,742</span>
                    </div>
                    <Progress value={85} className="h-2 bg-gray-100" indicatorClassName="bg-black" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Device Deduplication</span>
                      <span className="text-sm font-medium">175,631</span>
                    </div>
                    <Progress value={75} className="h-2 bg-gray-100" indicatorClassName="bg-black" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">ID Deduplication</span>
                      <span className="text-sm font-medium">92,163</span>
                    </div>
                    <Progress value={40} className="h-2 bg-gray-100" indicatorClassName="bg-black" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Location Lock</span>
                      <span className="text-sm font-medium">45,872</span>
                    </div>
                    <Progress value={20} className="h-2 bg-gray-100" indicatorClassName="bg-black" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Location Validation</span>
                      <span className="text-sm font-medium">26,427</span>
                    </div>
                    <Progress value={12} className="h-2 bg-gray-100" indicatorClassName="bg-black" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Automation Detection</span>
                      <span className="text-sm font-medium">18,935</span>
                    </div>
                    <Progress value={8} className="h-2 bg-gray-100" indicatorClassName="bg-black" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">IP Blocklist</span>
                      <span className="text-sm font-medium">15,246</span>
                    </div>
                    <Progress value={7} className="h-2 bg-gray-100" indicatorClassName="bg-black" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Untrusted Browser/OS</span>
                      <span className="text-sm font-medium">9,874</span>
                    </div>
                    <Progress value={4} className="h-2 bg-gray-100" indicatorClassName="bg-black" />
                  </div>
                </div>
              )}

              {activeTab === "suspicious" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">VPN Usage</span>
                      <span className="text-sm font-medium">87,521</span>
                    </div>
                    <Progress value={65} className="h-2 bg-gray-100" indicatorClassName="bg-black" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Device Tampering</span>
                      <span className="text-sm font-medium">62,438</span>
                    </div>
                    <Progress value={48} className="h-2 bg-gray-100" indicatorClassName="bg-black" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Virtual Machine</span>
                      <span className="text-sm font-medium">54,219</span>
                    </div>
                    <Progress value={40} className="h-2 bg-gray-100" indicatorClassName="bg-black" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Developer Tools Usage</span>
                      <span className="text-sm font-medium">43,762</span>
                    </div>
                    <Progress value={32} className="h-2 bg-gray-100" indicatorClassName="bg-black" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Privacy-Focused Settings</span>
                      <span className="text-sm font-medium">38,945</span>
                    </div>
                    <Progress value={29} className="h-2 bg-gray-100" indicatorClassName="bg-black" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Tor Usage</span>
                      <span className="text-sm font-medium">21,873</span>
                    </div>
                    <Progress value={16} className="h-2 bg-gray-100" indicatorClassName="bg-black" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Public Proxy</span>
                      <span className="text-sm font-medium">18,542</span>
                    </div>
                    <Progress value={14} className="h-2 bg-gray-100" indicatorClassName="bg-black" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">High-Activity Device</span>
                      <span className="text-sm font-medium">15,327</span>
                    </div>
                    <Progress value={11} className="h-2 bg-gray-100" indicatorClassName="bg-black" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Incognito Usage</span>
                      <span className="text-sm font-medium">12,984</span>
                    </div>
                    <Progress value={10} className="h-2 bg-gray-100" indicatorClassName="bg-black" />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
