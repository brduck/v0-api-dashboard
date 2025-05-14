import { Calendar, Download, ExternalLink, Moon, RefreshCw } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { DonutChart } from "./components/donut-chart"

export default function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="4" />
            </svg>
            <span className="ml-2 text-xl font-bold">dtect</span>
          </div>
        </div>
        <nav className="hidden md:flex md:items-center md:gap-6">
          <Link href="/dashboard" className="text-sm font-medium text-black">
            Dashboard
          </Link>
          <Link href="/projects" className="text-sm font-medium text-gray-500">
            Projects
          </Link>
          <Link href="#" className="text-sm font-medium text-gray-500">
            Settings
          </Link>
          <Link href="#" className="text-sm font-medium text-gray-500">
            Docs
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="outline" size="icon" className="rounded-full">
            <ExternalLink className="h-4 w-4" />
            <span className="sr-only">Sign Out</span>
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <Moon className="h-4 w-4" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Button variant="outline" className="hidden gap-2 md:flex">
            Sign Out
          </Button>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Dashboard</h1>
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
            <Card className="md:col-span-2">
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
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1 text-sm">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <span>Bad</span>
                    </div>
                    <div className="text-4xl font-bold">230,408</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1 text-sm">
                      <div className="h-3 w-3 rounded-full bg-teal-500"></div>
                      <span>Suspicious</span>
                    </div>
                    <div className="text-4xl font-bold">108,427</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1 text-sm">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span>Good</span>
                    </div>
                    <div className="text-4xl font-bold">1,016,508</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Bad vs Suspicious</CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <RefreshCw className="h-4 w-4 text-gray-500" />
                </Button>
              </CardHeader>
              <CardContent className="flex justify-center">
                <DonutChart
                  data={[
                    { name: "Suspicious", value: 108427, color: "rgb(20, 184, 166)" },
                    { name: "Bad", value: 230408, color: "rgb(239, 68, 68)" },
                  ]}
                />
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
      </main>
    </div>
  )
}
