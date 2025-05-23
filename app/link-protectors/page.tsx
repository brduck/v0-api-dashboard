"use client"

import type React from "react"
import type { Project } from "@/lib/project-storage"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Filter, Grid, List, Plus, Search, Shield, SlidersHorizontal } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { getProjects } from "@/lib/project-storage"
import { PricingModal } from "@/components/pricing-modal"

const TRIAL_LIMITS = {
  MAX_PROTECTORS: 3,
  MAX_PARTICIPANTS_PER_PROTECTOR: 100,
}

export default function LinkProtectors() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [viewMode, setViewMode] = useState<"list" | "table">("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("lastActive")
  const { toast } = useToast()
  const [showProjects, setShowProjects] = useState(true)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  // Load projects from localStorage
  useEffect(() => {
    const projects = getProjects()
    console.log("Loaded link protectors:", projects)
    setProjects(projects)
  }, [])

  // Filter projects based on search query and status filter
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Sort projects based on selected sort option
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "participants":
        return b.totalParticipants - a.totalParticipants
      case "blocked":
        return b.trafficBlocked - a.trafficBlocked
      case "blockRate":
        return b.trafficBlocked / b.totalParticipants - a.trafficBlocked / a.totalParticipants
      case "createdAt":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "lastActive":
      default:
        // Simple sort by lastActive string (in a real app, would use actual dates)
        return a.lastActive.includes("hour") || a.lastActive.includes("Just") ? -1 : 1
    }
  })

  const handleCopyLink = (link: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    navigator.clipboard.writeText(link)
    toast({
      title: "Link copied to clipboard",
      description: "The link has been copied to your clipboard.",
    })
  }

  const toggleProjectsVisibility = () => {
    setShowProjects(!showProjects)
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col gap-6 max-w-7xl mx-auto">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Link Protectors</h1>
          <p className="text-gray-500">Create, manage, and monitor your link protectors</p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search link protectors..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Protectors</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-gray-500" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lastActive">Last Active</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="participants">Participants</SelectItem>
                    <SelectItem value="blocked">Blocked Traffic</SelectItem>
                    <SelectItem value="blockRate">Block Rate</SelectItem>
                    <SelectItem value="createdAt">Created Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center border rounded-md overflow-hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`rounded-none px-3 ${viewMode === "list" ? "bg-gray-100" : ""}`}
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`rounded-none px-3 ${viewMode === "table" ? "bg-gray-100" : ""}`}
                  onClick={() => setViewMode("table")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>

              {projects.length >= TRIAL_LIMITS.MAX_PROTECTORS ? (
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100"
                  onClick={() => setShowUpgradeModal(true)}
                >
                  <Plus className="h-4 w-4" />
                  <span>Upgrade to Create More</span>
                </Button>
              ) : (
                <Link href="/protector/create">
                  <Button variant="default" className="flex items-center gap-2 bg-black text-white hover:bg-gray-800">
                    <Plus className="h-4 w-4" />
                    <span>Create Protector</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Trial Limitations Banner */}
          {projects.length >= TRIAL_LIMITS.MAX_PROTECTORS && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-100 p-2 rounded-full">
                    <Shield className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-amber-800">Free Trial Limitations</h3>
                    <p className="text-sm text-amber-700">
                      You're using {projects.length} of {TRIAL_LIMITS.MAX_PROTECTORS} link protectors. Each protector is
                      limited to {TRIAL_LIMITS.MAX_PARTICIPANTS_PER_PROTECTOR} participants.
                    </p>
                  </div>
                </div>
                <Button
                  variant="default"
                  size="sm"
                  className="bg-amber-600 text-white hover:bg-amber-700"
                  onClick={() => setShowUpgradeModal(true)}
                >
                  Upgrade Now
                </Button>
              </div>
            </div>
          )}
        </div>

        {viewMode === "list" ? (
          <div className="space-y-6">
            {!showProjects ? (
              <div className="flex flex-col items-center justify-center py-16 border rounded-lg bg-gray-50">
                <div className="max-w-md text-center space-y-4">
                  <h3 className="text-xl font-semibold">Create your first Link Protector</h3>
                  <p className="text-gray-500">
                    Get started by creating your first Link Protector. Link Protectors help you filter out bad traffic
                    and ensure data quality.
                  </p>
                  <div className="flex justify-center mt-4">
                    <Link href="/protector/create">
                      <Button
                        variant="default"
                        className="flex items-center gap-2 bg-black text-white hover:bg-gray-800"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Create Link Protector</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : sortedProjects.length === 0 ? (
              <div className="text-center py-12 border rounded-lg">
                <p className="text-gray-500">No link protectors found matching your criteria</p>
              </div>
            ) : (
              sortedProjects.map((project) => {
                const participantProgress =
                  (project.totalParticipants / TRIAL_LIMITS.MAX_PARTICIPANTS_PER_PROTECTOR) * 100
                const isNearLimit = participantProgress >= 80
                const isAtLimit = project.totalParticipants >= TRIAL_LIMITS.MAX_PARTICIPANTS_PER_PROTECTOR

                return (
                  <Link href={`/link-protector/${project.id}`} key={project.id}>
                    <Card className="overflow-hidden transition-all hover:shadow-md cursor-pointer mb-2">
                      <CardContent className="p-0">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                          <div className="p-4 md:col-span-4 border-b md:border-b-0 md:border-r">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium">{project.name}</h3>
                                <Badge
                                  className={
                                    project.status === "active"
                                      ? "bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900 transition-colors"
                                      : "bg-amber-100 text-amber-800 hover:bg-amber-200 hover:text-amber-900 transition-colors"
                                  }
                                >
                                  {project.status === "active"
                                    ? "Active"
                                    : isAtLimit
                                      ? "Paused - Limit Reached"
                                      : "Paused"}
                                </Badge>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs flex items-center gap-1.5 h-7"
                                onClick={(e) => handleCopyLink(project.securityLink || "", e)}
                              >
                                <Shield className="h-3.5 w-3.5 text-blue-500" />
                                Copy Entry Link
                              </Button>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>Last Participant: {project.lastActive}</span>
                              </div>

                              {/* Participant Limit Progress */}
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span className={isNearLimit ? "text-amber-600 font-medium" : "text-gray-500"}>
                                    Participants: {project.totalParticipants} /{" "}
                                    {TRIAL_LIMITS.MAX_PARTICIPANTS_PER_PROTECTOR}
                                  </span>
                                  {isAtLimit && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-5 px-2 text-xs text-amber-600 hover:text-amber-700"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        setShowUpgradeModal(true)
                                      }}
                                    >
                                      {project.status === "paused" ? "Upgrade to Activate" : "Upgrade"}
                                    </Button>
                                  )}
                                </div>
                                <Progress
                                  value={participantProgress}
                                  className="h-1.5"
                                  indicatorClassName={
                                    isAtLimit ? "bg-red-500" : isNearLimit ? "bg-amber-500" : "bg-blue-500"
                                  }
                                />
                              </div>
                            </div>
                          </div>
                          <div className="p-4 md:col-span-8">
                            <div className="space-y-3">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-4">
                                  <div className="text-left">
                                    <div className="text-sm text-gray-500">Participants</div>
                                    <div className="font-bold">{project.totalParticipants.toLocaleString()}</div>
                                  </div>
                                  <div className="text-left">
                                    <div className="text-sm text-gray-500">Blocked</div>
                                    <div className="font-bold">{project.trafficBlocked.toLocaleString()}</div>
                                  </div>
                                  <div className="text-left">
                                    <div className="text-sm text-gray-500">Block Rate</div>
                                    <div className="font-bold">
                                      {project.totalParticipants > 0
                                        ? ((project.trafficBlocked / project.totalParticipants) * 100).toFixed(1)
                                        : "0.0"}
                                      %
                                    </div>
                                  </div>
                                </div>
                                <Button variant="outline" size="sm" className="shrink-0">
                                  View Details
                                </Button>
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span>Blocked: {project.trafficBlocked.toLocaleString()}</span>
                                  <span>
                                    Allowed: {(project.totalParticipants - project.trafficBlocked).toLocaleString()}
                                  </span>
                                </div>
                                <Progress
                                  value={
                                    project.totalParticipants > 0
                                      ? (project.trafficBlocked / project.totalParticipants) * 100
                                      : 0
                                  }
                                  className="h-2 bg-gray-100"
                                  indicatorClassName="bg-red-500"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })
            )}
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            {!showProjects ? (
              <div className="flex flex-col items-center justify-center py-16 bg-gray-50">
                <div className="max-w-md text-center space-y-4">
                  <h3 className="text-xl font-semibold">Create your first Link Protector</h3>
                  <p className="text-gray-500">
                    Get started by creating your first Link Protector. Link Protectors help you filter out bad traffic
                    and ensure quality data.
                  </p>
                  <div className="flex justify-center mt-4">
                    <Link href="/protector/create">
                      <Button
                        variant="default"
                        className="mt-2 flex items-center gap-2 bg-black text-white hover:bg-gray-800"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Create Link Protector</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Link Protector</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Participants</TableHead>
                    <TableHead className="text-right">Blocked</TableHead>
                    <TableHead className="text-right">Block Rate</TableHead>
                    <TableHead>Last Participant</TableHead>
                    <TableHead>Entry Link</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedProjects.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        No link protectors found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedProjects.map((project) => {
                      const participantProgress =
                        (project.totalParticipants / TRIAL_LIMITS.MAX_PARTICIPANTS_PER_PROTECTOR) * 100
                      const isAtLimit = project.totalParticipants >= TRIAL_LIMITS.MAX_PARTICIPANTS_PER_PROTECTOR

                      return (
                        <TableRow key={project.id}>
                          <TableCell>
                            <div className="font-medium">{project.name}</div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                project.status === "active"
                                  ? "bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900 transition-colors"
                                  : "bg-amber-100 text-amber-800 hover:bg-amber-200 hover:text-amber-900 transition-colors"
                              }
                            >
                              {project.status === "active" ? "Active" : isAtLimit ? "Paused - Limit Reached" : "Paused"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="space-y-1">
                              <div className="font-medium">
                                {project.totalParticipants.toLocaleString()} /{" "}
                                {TRIAL_LIMITS.MAX_PARTICIPANTS_PER_PROTECTOR}
                              </div>
                              <Progress
                                value={participantProgress}
                                className="h-1.5 w-20 ml-auto"
                                indicatorClassName={
                                  isAtLimit ? "bg-red-500" : participantProgress >= 80 ? "bg-amber-500" : "bg-blue-500"
                                }
                              />
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {project.trafficBlocked.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {project.totalParticipants > 0
                              ? ((project.trafficBlocked / project.totalParticipants) * 100).toFixed(1)
                              : "0.0"}
                            %
                          </TableCell>
                          <TableCell>{project.lastActive}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs flex items-center gap-1.5 h-7"
                              onClick={(e) => handleCopyLink(project.securityLink || "", e)}
                            >
                              <Shield className="h-3.5 w-3.5 text-blue-500" />
                              Copy Entry Link
                            </Button>
                          </TableCell>
                          <TableCell className="text-right">
                            <Link href={`/link-protector/${project.id}`}>
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        )}
        {/* Floating toggle button */}
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            variant="outline"
            className="rounded-full shadow-md border-gray-300 bg-white px-4 py-2 hover:bg-gray-100"
            onClick={toggleProjectsVisibility}
          >
            {showProjects ? "Hide Link Protectors" : "Show Link Protectors"}
          </Button>
        </div>
        <PricingModal open={showUpgradeModal} onOpenChange={setShowUpgradeModal} />
      </div>
    </div>
  )
}
