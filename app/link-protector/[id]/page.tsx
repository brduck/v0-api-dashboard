"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Copy, ExternalLink, Pause, Play, Settings, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { getProjectById, updateProject, deleteProject, type Project } from "@/lib/project-storage"

export default function LinkProtectorDetails() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { toast } = useToast()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      const projectData = getProjectById(id)
      setProject(projectData || null)
      setLoading(false)
    }
  }, [id])

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link)
    toast({
      title: "Link copied to clipboard",
      description: "The link has been copied to your clipboard.",
    })
  }

  const handleToggleStatus = () => {
    if (!project) return

    const updatedProject = {
      ...project,
      status: project.status === "active" ? "paused" : "active",
    } as Project

    updateProject(updatedProject)
    setProject(updatedProject)

    toast({
      title: `Link protector ${updatedProject.status === "active" ? "activated" : "paused"}`,
      description: `${project.name} has been ${updatedProject.status === "active" ? "activated" : "paused"}.`,
    })
  }

  const handleDelete = () => {
    if (!project) return

    if (confirm(`Are you sure you want to delete "${project.name}"? This action cannot be undone.`)) {
      deleteProject(project.id)
      toast({
        title: "Link protector deleted",
        description: `${project.name} has been deleted.`,
      })
      router.push("/link-protectors")
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-xl font-bold">Loading link protector details...</h1>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-xl font-bold">Link protector not found</h1>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/link-protectors")}>
          Back to Link Protectors
        </Button>
      </div>
    )
  }

  const blockRate = project.totalParticipants > 0 ? (project.trafficBlocked / project.totalParticipants) * 100 : 0

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col gap-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <Button variant="ghost" size="sm" className="gap-1" onClick={() => router.push("/link-protectors")}>
            <ArrowLeft className="h-4 w-4" />
            Back to Link Protectors
          </Button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <p className="text-gray-500">Link protector details and analytics</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleToggleStatus} className="flex items-center gap-2">
              {project.status === "active" ? (
                <>
                  <Pause className="h-4 w-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Activate
                </>
              )}
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleDelete} className="text-red-500 hover:text-red-700">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge
                className={project.status === "active" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}
              >
                {project.status === "active" ? "Active" : "Paused"}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{project.totalParticipants.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Traffic Blocked</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{project.trafficBlocked.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Block Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{blockRate.toFixed(1)}%</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Entry Link</label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="flex-1 p-2 bg-gray-100 rounded text-sm break-all">{project.securityLink}</code>
                  <Button variant="outline" size="sm" onClick={() => handleCopyLink(project.securityLink || "")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Protected Link</label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="flex-1 p-2 bg-gray-100 rounded text-sm break-all">{project.protectedLink}</code>
                  <Button variant="outline" size="sm" onClick={() => window.open(project.protectedLink, "_blank")}>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Termination Link</label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="flex-1 p-2 bg-gray-100 rounded text-sm break-all">{project.terminationLink}</code>
                  <Button variant="outline" size="sm" onClick={() => handleCopyLink(project.terminationLink || "")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Traffic Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Blocked: {project.trafficBlocked.toLocaleString()}</span>
                  <span>Allowed: {(project.totalParticipants - project.trafficBlocked).toLocaleString()}</span>
                </div>
                <Progress value={blockRate} className="h-3 bg-gray-100" indicatorClassName="bg-red-600" />
              </div>

              <div className="pt-2 border-t">
                <div className="text-sm text-gray-500">Last Participant</div>
                <div className="font-medium">{project.lastActive}</div>
              </div>

              <div>
                <div className="text-sm text-gray-500">Created</div>
                <div className="font-medium">{new Date(project.createdAt).toLocaleDateString()}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
