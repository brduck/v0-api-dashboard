"use client"

import type React from "react"
import type { Project } from "@/lib/project-storage"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Filter, Grid, List, Plus, Search, Shield, SlidersHorizontal, AlertTriangle, Copy, Loader2, CheckCircle2, Info } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { getProjects, addProject } from "@/lib/project-storage"
import { useTrialTest } from "@/components/trial-test-context"
import { useSearchParams } from "next/navigation"
import { PaymentRequiredOverlay } from "@/components/payment-required-overlay"

export default function LinkProtectorsPage() {
  const router = useRouter()
  const { settings } = useTrialTest()
  const showProjects = settings.showLinkProtectors
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [projects, setProjects] = useState<Project[]>([])
  const [viewMode, setViewMode] = useState<"list" | "table">("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("lastActive")

  const [cloneModalOpen, setCloneModalOpen] = useState(false)
  const [projectToClone, setProjectToClone] = useState<Project | null>(null)
  const [cloneName, setCloneName] = useState("")
  const [isCloning, setIsCloning] = useState(false)

  // useEffect(() => {
  //   if (settings.isPaymentRequired) {
  //     router.push("/payment-required")
  //   }
  // }, [settings.isPaymentRequired, router])

  useEffect(() => {
    if (searchParams.get("payment") === "success") {
      toast({
        title: "Payment method verified",
        description: "Your payment method is valid and you can use Link Protector now.",
        duration: 5000,
      })
      // Clean up URL
      window.history.replaceState({}, "", "/link-protectors")
    }
  }, [searchParams, toast])

  // Load projects from localStorage
  useEffect(() => {
    const projects = getProjects()
    console.log("Loaded link protectors:", projects)
    setProjects(projects)
  }, [])

  // Check if any projects have test mode enabled
  const hasTestModeProjects = projects.some((project) => project.testMode === true)

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

  const handleCloneClick = (project: Project, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setProjectToClone(project)
    setCloneName(`[CLONE] - ${project.name}`)
    setCloneModalOpen(true)
  }

  const handleConfirmClone = async () => {
    if (!projectToClone) return
    setIsCloning(true)

    try {
      // Simulate brief network delay for UX
      await new Promise((resolve) => setTimeout(resolve, 500))

      const {
        id,
        totalParticipants,
        trafficBlocked,
        lastActive,
        status,
        createdAt,
        securityLink,
        terminationLink,
        ...rest
      } = projectToClone

      const newProjectData = {
        ...rest,
        name: cloneName,
        securityFeatures: { ...projectToClone.securityFeatures },
        advancedOptions: projectToClone.advancedOptions ? { ...projectToClone.advancedOptions } : undefined,
      } as Parameters<typeof addProject>[0]
      
      const newProject = addProject(newProjectData)
      
      setProjects((prev) => [newProject, ...prev])
      setCloneModalOpen(false)
      setProjectToClone(null)
      toast({
        title: "Link Protector cloned",
        description: `Successfully cloned as ${cloneName}`,
      })
      
      router.push(`/link-protector/${newProject.id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clone the Link Protector.",
        variant: "destructive",
      })
      setIsCloning(false)
    }
  }

  return (
    <div className="relative min-h-screen">
      {settings.isPaymentRequired && <PaymentRequiredOverlay />}

      <Dialog open={cloneModalOpen} onOpenChange={setCloneModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clone Link Protector</DialogTitle>
            <DialogDescription>
              Create a new Link Protector based on the current configuration.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 space-y-4">
              <div className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold text-gray-900">What will be copied?</span>
                  <p className="text-gray-500 mt-0.5">Security settings, Protected Link, and Termination Link.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Info className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold text-gray-900">What will be new?</span>
                  <p className="text-gray-500 mt-0.5">New Entry Link with no prior traffic history.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <label htmlFor="cloneName" className="text-sm font-medium">New Link Protector Name</label>
              <Input
                id="cloneName"
                value={cloneName}
                onChange={(e) => setCloneName(e.target.value)}
                placeholder="Name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCloneModalOpen(false)} disabled={isCloning}>Cancel</Button>
            <Button onClick={handleConfirmClone} disabled={isCloning}>
              {isCloning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cloning...
                </>
              ) : (
                "Clone Link Protector"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex h-full flex-col">
        <div className="p-4 md:p-6" style={{ "--progress-foreground": "rgb(220, 38, 38)" } as React.CSSProperties}>
          <div className="flex flex-col gap-6 max-w-7xl mx-auto">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold">Link Protectors</h1>
              <p className="text-gray-500">Create, manage, and monitor your link protectors</p>
            </div>

            {/* Test Mode Warning Banner */}
            {hasTestModeProjects && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-orange-800">Test Mode Active</h3>
                    <p className="text-sm text-orange-700 mt-1">
                      One or more link protectors are running in test mode. Traffic is being analyzed but not blocked.
                    </p>
                  </div>
                </div>
              </div>
            )}

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

                <Link href="/protector/create">
                  <Button variant="default" className="flex items-center gap-2 bg-black text-white hover:bg-gray-800">
                    <Plus className="h-4 w-4" />
                    <span>Create Protector</span>
                  </Button>
                </Link>
              </div>
            </div>

            {viewMode === "list" ? (
              <div className="space-y-6">
                {!showProjects ? (
                  <div className="flex flex-col items-center justify-center py-16 border rounded-lg bg-gray-50">
                    <div className="max-w-md text-center space-y-4">
                      <h3 className="text-xl font-semibold">Create your first Link Protector</h3>
                      <p className="text-gray-500">
                        Get started by creating your first Link Protector. Link Protectors help you filter out bad
                        traffic and ensure data quality.
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
                  sortedProjects.map((project) => (
                    <Link href={`/link-protector/${project.id}`} key={project.id}>
                      <Card className="overflow-hidden transition-all hover:shadow-md cursor-pointer mb-2">
                        <CardContent className="p-0">
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                            <div className="p-4 md:col-span-4 border-b md:border-b-0 md:border-r flex flex-col justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="font-medium">{project.name}</h3>
                                  </div>
                                  <div>
                                    {project?.advancedOptions?.testMode && (
                                      <Badge className="mr-2 bg-orange-100 text-orange-800 hover:bg-orange-200 text-xs">
                                        Test Mode
                                      </Badge>
                                    )}
                                    <Badge
                                      className={
                                        project.status === "active"
                                          ? "bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900 transition-colors"
                                          : "bg-amber-100 text-amber-800 hover:bg-amber-200 hover:text-amber-900 transition-colors"
                                      }
                                    >
                                      {project.status === "active" ? "Active" : "Paused"}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs flex items-center gap-1.5 h-7 bg-transparent mt-2"
                                onClick={(e) => handleCopyLink(project.securityLink || "", e)}
                              >
                                <Shield className="h-3.5 w-3.5 text-blue-500" />
                                Copy Entry Link
                              </Button>
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
                                  <div className="flex items-center gap-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="shrink-0 bg-transparent"
                                      onClick={(e) => handleCloneClick(project, e)}
                                    >
                                      <Copy className="h-4 w-4 mr-1 md:mr-2" />
                                      <span className="hidden md:inline">Clone</span>
                                    </Button>
                                    <Button variant="outline" size="sm" className="shrink-0 bg-transparent">
                                      View Details
                                    </Button>
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <div className="w-full">
                                    <div className="relative h-1 bg-gray-200 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-red-500 transition-all duration-300"
                                        style={{
                                          width: `${
                                            project.totalParticipants > 0
                                              ? (project.trafficBlocked / project.totalParticipants) * 100
                                              : 0
                                          }%`,
                                        }}
                                      />
                                      <div
                                        className="absolute top-0 right-0 h-full bg-green-500 transition-all duration-300"
                                        style={{
                                          width: `${
                                            project.totalParticipants > 0
                                              ? (
                                                  (project.totalParticipants - project.trafficBlocked) /
                                                    project.totalParticipants
                                                ) * 100
                                              : 0
                                          }%`,
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between text-xs">
                                    <span>Blocked: {project.trafficBlocked.toLocaleString()}</span>
                                    <span>
                                      Allowed: {(project.totalParticipants - project.trafficBlocked).toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                )}
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                {!showProjects ? (
                  <div className="flex flex-col items-center justify-center py-16 bg-gray-50">
                    <div className="max-w-md text-center space-y-4">
                      <h3 className="text-xl font-semibold">Create your first Link Protector</h3>
                      <p className="text-gray-500">
                        Get started by creating your first Link Protector. Link Protectors help you filter out bad
                        traffic and ensure quality data.
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
                        <TableHead>Entry Link</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedProjects.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            No link protectors found matching your criteria
                          </TableCell>
                        </TableRow>
                      ) : (
                        sortedProjects.map((project) => (
                          <TableRow key={project.id}>
                            <TableCell>
                              <div className="flex items-center gap-2 flex-wrap">
                                <div className="font-medium">{project.name}</div>
                                {project.testMode && (
                                  <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 text-xs">
                                    Test Mode
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  project.status === "active"
                                    ? "bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900 transition-colors"
                                    : "bg-amber-100 text-amber-800 hover:bg-amber-200 hover:text-amber-900 transition-colors"
                                }
                              >
                                {project.status === "active" ? "Active" : "Paused"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {project.totalParticipants.toLocaleString()}
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
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs flex items-center gap-1.5 h-7 bg-transparent"
                                onClick={(e) => handleCopyLink(project.securityLink || "", e)}
                              >
                                <Shield className="h-3.5 w-3.5 text-blue-500" />
                                Copy Entry Link
                              </Button>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end items-center gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={(e) => handleCloneClick(project, e)}
                                >
                                  Clone
                                </Button>
                                <Link href={`/link-protector/${project.id}`}>
                                  <Button variant="outline" size="sm">
                                    View
                                  </Button>
                                </Link>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
