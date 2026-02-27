"use client"

import type { Project } from "@/lib/project-storage"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { AlertTriangle } from "lucide-react"

interface CloneLinkProtectorDialogProps {
  project: Project | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onClone: (newName: string) => Promise<Project | undefined>
}

export function CloneLinkProtectorDialog({
  project,
  open,
  onOpenChange,
  onClone,
}: CloneLinkProtectorDialogProps) {
  const [newName, setNewName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Update the pre-filled name when project changes
  useEffect(() => {
    if (project && open) {
      setNewName(`[CLONE] - ${project.name}`)
    }
  }, [project, open])

  const handleClone = async () => {
    if (!newName.trim()) {
      return
    }

    setIsLoading(true)
    try {
      await onClone(newName)
    } finally {
      setIsLoading(false)
      onOpenChange(false)
      setNewName("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            Clone Link Protector
          </DialogTitle>
          <DialogDescription>
            The cloned link protector will have a different entry link and security configuration. All security
            settings and features will be copied from the original.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="clone-name" className="text-sm font-medium">
              Name for the new Link Protector
            </label>
            <Input
              id="clone-name"
              placeholder="Enter new name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              disabled={isLoading}
              autoFocus
            />
            <p className="text-xs text-gray-500">
              The new link protector will have a unique security link and entry point.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="bg-transparent"
          >
            Cancel
          </Button>
          <Button onClick={handleClone} disabled={isLoading || !newName.trim()} className="bg-black hover:bg-gray-800">
            {isLoading ? "Cloning..." : "Clone Link Protector"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
