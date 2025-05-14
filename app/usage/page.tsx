"use client"

import { Calendar, Download, ExternalLink, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Pie, PieChart, Cell } from "recharts"

export default function Dashboard() {
  // Data for the pie chart
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Starts</CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <RefreshCw className="h-4 w-4 text-gray-500" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">1,355,345</div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-2 border border-gray-100 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg font-medium">dtect Score</CardTitle>
                <p className="text-sm text-gray-500">Score for participants</p>
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
                    <div className="text-3xl font-bold">230,408</div>
                  </div>

                  <div className="h-12 w-px bg-gray-200"></div>

                  <div className="flex flex-col items-start">
                    <div className="flex items-start gap-2 mb-1">
                      <div className="h-4 w-4 rounded-full bg-teal-100 flex items-center justify-center">
                        <div className="h-1.5 w-1.5 rounded-full bg-teal-500"></div>
                      </div>
                      <span className="text-teal-500 text-sm font-medium">Suspicious</span>
                    </div>
                    <div className="text-3xl font-bold">108,427</div>
                  </div>

                  <div className="h-12 w-px bg-gray-200"></div>

                  <div className="flex flex-col items-start">
                    <div className="flex items-start gap-2 mb-1">
                      <div className="h-4 w-4 rounded-full bg-green-100 flex items-center justify-center">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                      </div>
                      <span className="text-green-500 text-sm font-medium">Good</span>
                    </div>
                    <div className="text-3xl font-bold">1,016,508</div>
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
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Features Usage</CardTitle>
            <p className="text-xs text-gray-500">Participants flagged on security checks</p>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
