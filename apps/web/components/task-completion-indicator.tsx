"use client"

import type React from "react"

import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle2, Circle, PlayCircle, PauseCircle } from "lucide-react"
import { getUserById } from "@/lib/mock-data"
import type { TaskUserCompletion, UserTaskStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

interface TaskCompletionIndicatorProps {
  userCompletions: TaskUserCompletion[]
  assignedTo: string[]
  variant?: "compact" | "detailed"
}

const statusConfig: Record<UserTaskStatus, { icon: React.ElementType; color: string; text: string }> = {
  pending: { icon: Circle, color: "text-muted-foreground", text: "Pendiente" },
  "in-progress": { icon: PlayCircle, color: "text-chart-1", text: "En Progreso" },
  paused: { icon: PauseCircle, color: "text-chart-4", text: "En Pausa" },
  completed: { icon: CheckCircle2, color: "text-chart-3", text: "Completado" },
}

export function TaskCompletionIndicator({
  userCompletions,
  assignedTo,
  variant = "compact",
}: TaskCompletionIndicatorProps) {
  const completedCount = userCompletions?.filter((uc) => uc.userStatus === "completed").length || 0
  const inProgressCount = userCompletions?.filter((uc) => uc.userStatus === "in-progress").length || 0
  const pausedCount = userCompletions?.filter((uc) => uc.userStatus === "paused").length || 0
  const totalAssigned = assignedTo.length
  const progress = totalAssigned > 0 ? Math.round((completedCount / totalAssigned) * 100) : 0

  if (totalAssigned <= 1) {
    return null
  }

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
          <span className={cn(completedCount === totalAssigned ? "text-chart-3" : "text-muted-foreground")}>
            {completedCount} de {totalAssigned}
          </span>
          {inProgressCount > 0 && (
            <span className="text-chart-1">
              ({inProgressCount} activo{inProgressCount > 1 ? "s" : ""})
            </span>
          )}
          {pausedCount > 0 && (
            <span className="text-chart-4">
              ({pausedCount} pausado{pausedCount > 1 ? "s" : ""})
            </span>
          )}
        </div>
        <div className="w-16">
          <Progress value={progress} className="h-1.5" />
        </div>
      </div>
    )
  }

  // Variant: detailed
  return (
    <div className="space-y-3 rounded-lg border bg-muted/30 p-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Progreso del equipo</span>
        <span
          className={cn("text-sm font-semibold", completedCount === totalAssigned ? "text-chart-3" : "text-foreground")}
        >
          {completedCount} de {totalAssigned} completaron
        </span>
      </div>

      <Progress value={progress} className="h-2" />

      <div className="flex flex-wrap gap-2 text-xs">
        {inProgressCount > 0 && (
          <span className="flex items-center gap-1 text-chart-1">
            <PlayCircle className="h-3 w-3" />
            {inProgressCount} en progreso
          </span>
        )}
        {pausedCount > 0 && (
          <span className="flex items-center gap-1 text-chart-4">
            <PauseCircle className="h-3 w-3" />
            {pausedCount} en pausa
          </span>
        )}
      </div>

      <div className="space-y-2">
        {assignedTo.map((userId) => {
          const user = getUserById(userId)
          const completion = userCompletions?.find((uc) => uc.userId === userId)
          const userStatus = completion?.userStatus || "pending"
          const config = statusConfig[userStatus]
          const StatusIcon = config.icon

          if (!user) return null

          const initials = user.name
            .split(" ")
            .map((n) => n[0])
            .join("")

          return (
            <div
              key={userId}
              className={cn(
                "flex items-center justify-between rounded-md px-2 py-1.5 transition-colors",
                userStatus === "completed"
                  ? "bg-chart-3/10"
                  : userStatus === "in-progress"
                    ? "bg-chart-1/10"
                    : userStatus === "paused"
                      ? "bg-chart-4/10"
                      : "bg-background",
              )}
            >
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{user.name}</span>
              </div>

              <div className={cn("flex items-center gap-1", config.color)}>
                <StatusIcon className="h-4 w-4" />
                <span className="text-xs font-medium">{config.text}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
