export type UserRole = "admin" | "project-manager" | "developer" | "viewer"

export type UserTaskStatus = "pending" | "in-progress" | "paused" | "completed"

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: UserRole
  createdAt: Date
}

export interface ProjectMember {
  userId: string
  projectId: string
  role: UserRole
  canEdit: boolean
  canDelete: boolean
  canAssignTasks: boolean
  joinedAt: Date
}

export interface TaskUserCompletion {
  userId: string
  completedAt?: Date
  isCompleted: boolean
  userStatus: UserTaskStatus
}

export interface Task {
  id: string
  title: string
  description: string
  status: "pending" | "in-progress" | "completed" | "blocked"
  assignedTo: string[] // User IDs
  userCompletions?: TaskUserCompletion[]
  milestoneId: string
  priority: "low" | "medium" | "high" | "critical"
  startDate: Date
  endDate: Date
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

export interface Milestone {
  id: string
  title: string
  description: string
  projectId: string
  tasks: Task[]
  startDate: Date
  endDate: Date
  progress: number // 0-100
  status: "not-started" | "in-progress" | "completed" | "delayed"
  createdAt: Date
}

export interface Project {
  id: string
  name: string
  description: string
  startDate: Date
  endDate: Date
  estimatedHours: number
  status: "planning" | "in-progress" | "on-hold" | "completed" | "cancelled"
  progress: number // 0-100
  milestones: Milestone[]
  members: ProjectMember[]
  createdBy: string
  createdAt: Date
  updatedAt: Date
}
