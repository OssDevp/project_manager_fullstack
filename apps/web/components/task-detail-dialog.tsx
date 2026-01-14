"use client"

import type React from "react"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getUserById } from "@/lib/mock-data"
import type { Task } from "@/lib/types"
import { Calendar, User, Target, FileText, CheckCircle2, Circle } from "lucide-react"

interface TaskDetailDialogProps {
  task: Task
  milestoneName?: string
  projectName?: string
  children: React.ReactNode
}

export function TaskDetailDialog({ task, milestoneName, projectName, children }: TaskDetailDialogProps) {
  const [open, setOpen] = useState(false)

  const assignedUsers = task.assignedTo.map((userId) => getUserById(userId)).filter(Boolean)
  const hasMultipleAssignees = task.assignedTo.length > 1

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

  // Calcular progreso del equipo
  const completedCount = task.userCompletions?.filter((uc) => uc.isCompleted).length || 0
  const totalAssigned = task.assignedTo.length
  const teamProgress = totalAssigned > 0 ? Math.round((completedCount / totalAssigned) * 100) : 0

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Badge className={status.color}>{status.text}</Badge>
            <Badge variant="outline" className={priority.color}>
              {priority.text}
            </Badge>
          </div>
          <DialogTitle className="text-balance text-xl">{task.title}</DialogTitle>
          <DialogDescription className="text-pretty">{task.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Descripción detallada */}
          <div className="space-y-2 rounded-lg border p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span className="font-medium">Descripción detallada</span>
            </div>
            <p className="text-sm leading-relaxed">{task.description}</p>
          </div>

          {/* Información del proyecto y hito */}
          <div className="grid gap-4 md:grid-cols-2">
            {projectName && (
              <div className="space-y-1 rounded-lg border p-3">
                <span className="text-xs text-muted-foreground">Proyecto</span>
                <p className="font-medium">{projectName}</p>
              </div>
            )}
            {milestoneName && (
              <div className="space-y-1 rounded-lg border p-3">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Target className="h-3 w-3" />
                  Hito
                </div>
                <p className="font-medium">{milestoneName}</p>
              </div>
            )}
          </div>

          {/* Fechas */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1 rounded-lg border p-3">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                Fecha de inicio
              </div>
              <p className="text-sm font-medium">
                {new Date(task.startDate).toLocaleDateString("es-ES", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="space-y-1 rounded-lg border p-3">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                Fecha de finalización
              </div>
              <p className="text-sm font-medium">
                {new Date(task.endDate).toLocaleDateString("es-ES", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Progreso del equipo */}
          {hasMultipleAssignees && (
            <div className="space-y-3 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progreso del Equipo</span>
                <span className="text-sm font-semibold">{teamProgress}%</span>
              </div>
              <Progress value={teamProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {completedCount} de {totalAssigned} desarrolladores han completado su parte
              </p>
            </div>
          )}

          {/* Usuarios asignados con estado */}
          <div className="space-y-3 rounded-lg border p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <User className="h-4 w-4" />
              Asignados ({assignedUsers.length})
            </div>
            <div className="space-y-2">
              {assignedUsers.map((assignedUser) => {
                if (!assignedUser) return null
                const initials = assignedUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                const userCompletion = task.userCompletions?.find((uc) => uc.userId === assignedUser.id)
                const isUserCompleted = userCompletion?.isCompleted || false

                return (
                  <div key={assignedUser.id} className="flex items-center justify-between rounded-md bg-muted/50 p-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={assignedUser.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{assignedUser.name}</p>
                        <p className="text-xs text-muted-foreground">{assignedUser.email}</p>
                      </div>
                    </div>
                    {hasMultipleAssignees && (
                      <div className="flex items-center gap-1">
                        {isUserCompleted ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-chart-3" />
                            <span className="text-xs font-medium text-chart-3">Completado</span>
                          </>
                        ) : (
                          <>
                            <Circle className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Pendiente</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Timestamps */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Creada: {new Date(task.createdAt).toLocaleDateString("es-ES")}</span>
            <span>Actualizada: {new Date(task.updatedAt).toLocaleDateString("es-ES")}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
