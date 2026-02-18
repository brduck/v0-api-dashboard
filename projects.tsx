import { ExternalLink, Moon, Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

// Sample project data
const projects = [
  {
    id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    name: "E-commerce Verification",
    totalUsers: 245789,
    trafficBlocked: 32456,
    lastActive: "2 hours ago",
  },
  {
    id: "7e9d5eb6-8a42-4f1c-b3cb-1a4c24d8ef1d",
    name: "Financial Services",
    totalUsers: 189632,
    trafficBlocked: 45231,
    lastActive: "5 hours ago",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    name: "Gaming Platform",
    totalUsers: 523147,
    trafficBlocked: 78562,
    lastActive: "1 day ago",
  },
  {
    id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    name: "Social Media App",
    totalUsers: 325478,
    trafficBlocked: 52369,
    lastActive: "3 days ago",
  },
  {
    id: "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
    name: "Healthcare Portal",
    totalUsers: 125789,
    trafficBlocked: 12547,
    lastActive: "1 week ago",
  },
]

export default function Projects() {
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
          <Link href="/dashboard" className="text-sm font-medium text-gray-500">
            Dashboard
          </Link>
          <Link href="/projects" className="text-sm font-medium text-black">
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
            <h1 className="text-2xl font-bold">Projects</h1>
            <Button variant="default" className="flex items-center gap-2 bg-black text-white hover:bg-gray-800">
              <Plus className="h-4 w-4" />
              <span>Create Project</span>
            </Button>
          </div>

          <div className="space-y-4">
            {projects.map((project) => (
              <Link href={`/dashboard?project=${project.id}`} key={project.id}>
                <Card className="overflow-hidden transition-all hover:shadow-md cursor-pointer">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-3">
                      <div className="p-4 md:col-span-1 border-b md:border-b-0 md:border-r">
                        <div className="space-y-1">
                          <h3 className="font-medium">{project.name}</h3>
                          <p className="text-xs text-gray-500">ID: {project.id}</p>
                          <p className="text-xs text-gray-500">Last active: {project.lastActive}</p>
                        </div>
                      </div>
                      <div className="p-4 md:col-span-2">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Total Users vs Traffic Blocked</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>{project.totalUsers.toLocaleString()} users</span>
                            <span>{project.trafficBlocked.toLocaleString()} blocked</span>
                          </div>
                          <Progress
                            value={(project.trafficBlocked / project.totalUsers) * 100}
                            className="h-2 bg-gray-100"
                            indicatorClassName="bg-red-500"
                          />
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>
                              Allowed: {(project.totalUsers - project.trafficBlocked).toLocaleString()}
                            </span>
                            <span>
                              Blocked: {((project.trafficBlocked / project.totalUsers) * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
