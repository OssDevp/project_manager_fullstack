"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { AppHeader } from "@/components/app-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getUserTasks, getUserById, getProjectById, updateUserTaskStatus } from "@/lib/mock-data"
import { TaskCompletionIndicator } from "@/components/task-completion-indicator"
import { UserTaskStatusSelector } from "@/components/user-task-status-selector"
import type { Task, UserTaskStatus } from "@/lib/types"
import {
  ArrowLeft,
  Calendar,
  User,
  Target,
  LayoutGrid,
  FileText,
  CheckCircle2,
  Circle,
  PlayCircle,
  PauseCircle,
} from "lucide-react"
import Link from "next/link"

const userStatusConfig: Record<
  UserTaskStatus,
  { icon: React.ElementType; color: string; bgColor: string; text: string }
> = {
  pending: { icon: Circle, color: "text-muted-foreground", bgColor: "", text: "Pendiente" },
  "in-progress": { icon: PlayCircle, color: "text-chart-1", bgColor: "bg-chart-1/10", text: "En Progreso" },
  paused: { icon: PauseCircle, color: "text-chart-4", bgColor: "bg-chart-4/10", text: "En Pausa" },
  completed: { icon: CheckCircle2, color: "text-chart-3", bgColor: "bg-chart-3/10", text: "Completado" },
}

export default function TaskDetailPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [task, setTask] = useState<Task | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (user) {
      const taskId = params.id as string
      const userTasks = getUserTasks(user.id)
      const foundTask = userTasks.find((t) => t.id === taskId)
      if (foundTask) {
        setTask(foundTask)
      }
    }
  }, [isAuthenticated, user, router, params.id])

  if (!task || !user) return null

  const handleUserStatusChange = (newStatus: UserTaskStatus) => {
    updateUserTaskStatus(task.id, user.id, newStatus)
    const userTasks = getUserTasks(user.id)
    const updatedTask = userTasks.find((t) => t.id === task.id)
    if (updatedTask) {
      setTask(updatedTask)
    }
  }

  // Find project and milestone dynamically
  const allProjects = [getProjectById("p1")].filter(Boolean)
  let project = null
  let milestone = null

  for (const p of allProjects) {
    if (!p) continue
    const m = p.milestones.find((m) => m.id === task.milestoneId)
    if (m) {
      project = p
      milestone = m
      break
    }
  }

  const assignedUsers = task.assignedTo.map((userId) => getUserById(userId)).filter(Boolean)
  const hasMultipleAssignees = task.assignedTo.length > 1
  const myCompletion = task.userCompletions?.find((uc) => uc.userId === user.id)
  const myStatus = myCompletion?.userStatus || "pending"

  const statusConfig = {
    pending: { color: "bg-muted text-muted-foreground", text: "Pendiente" },
    "in-progress": { color: "bg-chart-1 text-primary-foreground", text: "En Progreso" },
    completed: { color: "bg-chart-3 text-primary-foreground", text: "Completada" },
    blocked: { color: "bg-destructive text-destructive-foreground", text: "Bloqueada" },
  }

  const priorityConfig = {
    critical: { color: "border-destructive text-destructive", text: "Crítica" },
    high: { color: "border-chart-4 text-chart-4", text: "Alta" },
    medium: { color: "border-chart-1 text-chart-1", text: "Media" },
    low: { color: "border-muted-foreground text-muted-foreground", text: "Baja" },
  }

  const status = statusConfig[task.status]
  const priority = priorityConfig[task.priority]

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="container mx-auto max-w-4xl p-6">
        <Link href="/my-tasks">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Mis Tareas
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-3 flex items-center gap-2">
                  <Badge className={status.color}>{status.text}</Badge>
                  <Badge variant="outline" className={priority.color}>
                    {priority.text}
                  </Badge>
                </div>
                <CardTitle className="text-balance text-2xl">{task.title}</CardTitle>
                <CardDescription className="text-pretty">{task.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2 rounded-lg border p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span className="font-medium">Descripción de la tarea:</span>
              </div>
              <p className="text-sm leading-relaxed">{task.description}</p>
              <div className="mt-3 rounded-md bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">
                  <strong>Qué se espera:</strong> Esta tarea requiere que completes tu parte del trabajo asignado.
                  {hasMultipleAssignees &&
                    " Como hay múltiples desarrolladores asignados, la tarea se marcará como completada cuando todos hayan terminado su parte."}
                </p>
              </div>
            </div>

            <div className="space-y-3 rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {hasMultipleAssignees ? "Mi estado en esta tarea:" : "Estado de la tarea:"}
                </span>
                {myStatus === "completed" && <Badge className="bg-chart-3 text-primary-foreground">Completado</Badge>}
              </div>
              <UserTaskStatusSelector currentStatus={myStatus} onStatusChange={handleUserStatusChange} />
              <p className="text-xs text-muted-foreground">
                Selecciona el estado que mejor describe tu progreso actual en esta tarea.
              </p>
            </div>

            {hasMultipleAssignees && task.userCompletions && (
              <TaskCompletionIndicator
                userCompletions={task.userCompletions}
                assignedTo={task.assignedTo}
                variant="detailed"
              />
            )}

            {/* Task Details */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Fecha de inicio:</span>
                </div>
                <p className="text-sm">
                  {new Date(task.startDate).toLocaleDateString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Fecha de finalización:</span>
                </div>
                <p className="text-sm">
                  {new Date(task.endDate).toLocaleDateString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Project Info */}
            {project && (
              <div className="space-y-2 rounded-lg border p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <LayoutGrid className="h-4 w-4" />
                  <span className="font-medium">Proyecto:</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{project.name}</p>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                  </div>
                  <Link href={`/projects/${project.id}`}>
                    <Button variant="outline" size="sm">
                      Ver Proyecto
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Milestone Info */}
            {milestone && (
              <div className="space-y-2 rounded-lg border p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Target className="h-4 w-4" />
                  <span className="font-medium">Hito:</span>
                </div>
                <p className="font-medium">{milestone.title}</p>
                <p className="text-sm text-muted-foreground">{milestone.description}</p>
              </div>
            )}

            {/* Assigned Users - Mostrar estado individual de cada usuario */}
            <div className="space-y-3 rounded-lg border p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="font-medium">Asignado a ({assignedUsers.length}):</span>
              </div>
              <div className="space-y-2">
                {assignedUsers.map((assignedUser) => {
                  if (!assignedUser) return null
                  const initials = assignedUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                  const userCompletion = task.userCompletions?.find((uc) => uc.userId === assignedUser.id)
                  const userTaskStatus = userCompletion?.userStatus || "pending"
                  const statusInfo = userStatusConfig[userTaskStatus]
                  const StatusIcon = statusInfo.icon

                  return (
                    <div
                      key={assignedUser.id}
                      className={`flex items-center justify-between rounded-md border p-2 ${statusInfo.bgColor}`}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={assignedUser.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {assignedUser.name}
                            {assignedUser.id === user.id && (
                              <span className="ml-2 text-xs text-muted-foreground">(Tú)</span>
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">{assignedUser.email}</p>
                        </div>
                      </div>
                      <div className={`flex items-center gap-1 ${statusInfo.color}`}>
                        <StatusIcon className="h-4 w-4" />
                        <span className="text-xs font-medium">{statusInfo.text}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
