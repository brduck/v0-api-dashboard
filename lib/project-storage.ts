// Project type definition
export interface Project {
  id: string
  name: string
  description?: string
  protectedLink: string
  terminationType: "default" | "custom"
  customTerminationLink?: string
  securityFeatures: {
    deviceDeduplication: boolean
    ipDeduplication: boolean
    automationDetection: boolean
    trustedBrowsers: boolean
    audienceValidation: boolean
    aiDetection: boolean
    locationLock: boolean
    locationValidation: boolean
    suspiciousUsers: boolean
    duplicateId: boolean
  }
  advancedOptions?: {
    maskParticipantId: boolean
  }
  totalParticipants: number
  trafficBlocked: number
  lastActive: string // This represents the Last Participant timestamp
  status: "active" | "paused"
  createdAt: string
  securityLink?: string
  surveyLink?: string
  terminationLink?: string
  features?: Array<{ name: string; percentage: number }>
}

// Default sample projects
const sampleProjects: Project[] = [
  {
    id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    name: "E-commerce Verification",
    description: "Verification system for online shopping platform",
    protectedLink: "https://example-ecommerce.com",
    terminationType: "default",
    securityFeatures: {
      deviceDeduplication: true,
      ipDeduplication: true,
      automationDetection: true,
      trustedBrowsers: false,
      audienceValidation: false,
      aiDetection: false,
      locationLock: false,
      locationValidation: false,
      suspiciousUsers: true,
      duplicateId: true,
    },
    advancedOptions: {
      maskParticipantId: false,
    },
    totalParticipants: 100,
    trafficBlocked: 32456,
    lastActive: "2 hours ago",
    status: "active",
    createdAt: "2025-01-15",
  },
  {
    id: "7e9d5eb6-8a42-4f1c-b3cb-1a4c24d8ef1d",
    name: "Financial Services",
    description: "Security layer for banking applications",
    protectedLink: "https://example-finance.com",
    terminationType: "default",
    securityFeatures: {
      deviceDeduplication: true,
      ipDeduplication: true,
      automationDetection: true,
      trustedBrowsers: true,
      audienceValidation: false,
      aiDetection: false,
      locationLock: false,
      locationValidation: false,
      suspiciousUsers: true,
      duplicateId: true,
    },
    advancedOptions: {
      maskParticipantId: true,
    },
    totalParticipants: 87,
    trafficBlocked: 45231,
    lastActive: "5 hours ago",
    status: "active",
    createdAt: "2025-02-03",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    name: "Gaming Platform",
    description: "User verification for gaming community",
    protectedLink: "https://example-gaming.com",
    terminationType: "default",
    securityFeatures: {
      deviceDeduplication: true,
      ipDeduplication: true,
      automationDetection: true,
      trustedBrowsers: false,
      audienceValidation: true,
      aiDetection: true,
      locationLock: false,
      locationValidation: false,
      suspiciousUsers: true,
      duplicateId: true,
    },
    advancedOptions: {
      maskParticipantId: false,
    },
    totalParticipants: 33,
    trafficBlocked: 78562,
    lastActive: "1 day ago",
    status: "active",
    createdAt: "2024-12-20",
  },
]

// Get all studies from localStorage or initialize with sample data
export function getProjects(): Project[] {
  if (typeof window === "undefined") {
    return []
  }

  try {
    const storedProjects = localStorage.getItem("dtect_projects")
    if (!storedProjects) {
      // Initialize with sample studies on first load
      const projectsWithLinks = sampleProjects.map((project) => ({
        ...project,
        securityLink: `https://participation.dtect.io?uref=17313db1-800f-4de4-9db0-e61610a1246b&id=PARTICIPANT_ID_HERE`,
        terminationLink: `https://participation.dtect.io/test-supplier?status=security_terminate&id=${project.id}`,
      }))
      localStorage.setItem("dtect_projects", JSON.stringify(projectsWithLinks))
      return projectsWithLinks
    }

    // Update existing studies with the new link formats
    const projects = JSON.parse(storedProjects)
    const updatedProjects = projects.map((project: Project) => ({
      ...project,
      securityLink: `https://participation.dtect.io?uref=17313db1-800f-4de4-9db0-e61610a1246b&id=PARTICIPANT_ID_HERE`,
      terminationLink:
        project.terminationLink ||
        `https://participation.dtect.io/test-supplier?status=security_terminate&id=${project.id}`,
      // Add default advanced options if they don't exist
      advancedOptions: project.advancedOptions || { maskParticipantId: false },
    }))

    // Save the updated studies back to localStorage
    localStorage.setItem("dtect_projects", JSON.stringify(updatedProjects))

    return updatedProjects
  } catch (error) {
    console.error("Error loading studies:", error)
    return []
  }
}

// Get a single project by ID
export function getProjectById(id: string): Project | undefined {
  const projects = getProjects()
  return projects.find((project) => project.id === id)
}

// Add a new project
export function addProject(
  project: Omit<
    Project,
    | "id"
    | "totalParticipants"
    | "trafficBlocked"
    | "lastActive"
    | "status"
    | "createdAt"
    | "securityLink"
    | "terminationLink"
  >,
): Project {
  const projects = getProjects()
  const newId = crypto.randomUUID()

  // Create a new project with default values
  const newProject: Project = {
    ...project,
    id: newId,
    totalParticipants: 0,
    trafficBlocked: 0,
    lastActive: "Just now",
    status: "active",
    createdAt: new Date().toISOString().split("T")[0],
    advancedOptions: project.advancedOptions || { maskParticipantId: false },
  }

  // Add security link and termination link with the new formats
  newProject.securityLink = `https://participation.dtect.io?uref=17313db1-800f-4de4-9db0-e61610a1246b&id=PARTICIPANT_ID_HERE`
  newProject.terminationLink = `https://participation.dtect.io/test-supplier?status=security_terminate&id=${newId}`

  // Save to localStorage
  localStorage.setItem("dtect_projects", JSON.stringify([newProject, ...projects]))

  return newProject
}

// Update a project
export function updateProject(project: Project): void {
  const projects = getProjects()
  const updatedProjects = projects.map((p) => (p.id === project.id ? project : p))
  localStorage.setItem("dtect_projects", JSON.stringify(updatedProjects))
}

// Delete a project
export function deleteProject(id: string): void {
  const projects = getProjects()
  const updatedProjects = projects.filter((p) => p.id !== id)
  localStorage.setItem("dtect_projects", JSON.stringify(updatedProjects))
}
