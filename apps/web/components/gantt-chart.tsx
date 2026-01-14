"use client"

import { useMemo } from "react"
import type { Project, Milestone, Task } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface GanttChartProps {
  project: Project
}

export function GanttChart({ project }: GanttChartProps) {
  const { startDate: projectStartDate, endDate: projectEndDate, milestones } = project

  // Calculate the timeline
  const timelineData = useMemo(() => {
    const start = new Date(projectStartDate)
    const end = new Date(projectEndDate)
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

    // Generate months for the header
    const months: { name: string; days: number }[] = []
    const current = new Date(start)

    while (current <= end) {
      const monthStart = new Date(current)
      const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0)
      const lastDay = monthEnd > end ? end : monthEnd

      const daysInMonth = Math.ceil((lastDay.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24)) + 1

      months.push({
        name: monthStart.toLocaleDateString("es-ES", { month: "short", year: "numeric" }),
        days: daysInMonth,
      })

      current.setMonth(current.getMonth() + 1)
      current.setDate(1)
    }

    return { start, end, totalDays, months }
  }, [projectStartDate, projectEndDate])

  const calculateBarPosition = (itemStart: Date, itemEnd: Date) => {
    const start = new Date(itemStart)
    const end = new Date(itemEnd)
    const projectStart = timelineData.start

    const startOffset = Math.max(0, (start.getTime() - projectStart.getTime()) / (1000 * 60 * 60 * 24))
    const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)

    const leftPercent = (startOffset / timelineData.totalDays) * 100
    const widthPercent = (duration / timelineData.totalDays) * 100

    return {
      left: `${leftPercent}%`,
      width: `${Math.max(widthPercent, 1)}%`,
    }
  }

  const getMilestoneColor = (status: Milestone["status"]) => {
    switch (status) {
      case "completed":
        return "bg-chart-3"
      case "in-progress":
        return "bg-chart-1"
      case "not-started":
        return "bg-muted"
      case "delayed":
        return "bg-destructive"
      default:
        return "bg-muted"
    }
  }

  const getTaskColor = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return "bg-chart-3"
      case "in-progress":
        return "bg-chart-1"
      case "pending":
        return "bg-chart-4"
      case "blocked":
        return "bg-destructive"
      default:
        return "bg-muted"
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Diagrama de Gantt</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <div className="min-w-[1200px]">
            {/* Timeline Header */}
            <div className="sticky top-0 z-10 border-b bg-card">
              <div className="flex">
                <div className="w-80 shrink-0 border-r bg-muted/50 p-4 font-semibold">Tareas</div>
                <div className="flex flex-1">
                  {timelineData.months.map((month, idx) => (
                    <div
                      key={idx}
                      className="border-r bg-muted/50 p-2 text-center text-sm font-medium"
                      style={{ width: `${(month.days / timelineData.totalDays) * 100}%` }}
                    >
                      {month.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Gantt Content */}
            <div className="relative">
              {milestones.map((milestone, mIdx) => (
                <div key={milestone.id}>
                  {/* Milestone Row */}
                  <div className="flex border-b hover:bg-muted/30">
                    <div className="w-80 shrink-0 border-r p-4">
                      <div className="flex items-center gap-2">
                        <div className={cn("h-3 w-3 rounded", getMilestoneColor(milestone.status))} />
                        <span className="font-semibold">{milestone.title}</span>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {milestone.tasks.length} tareas • {milestone.progress}% completado
                      </div>
                    </div>
                    <div className="relative flex-1 p-2">
                      {/* Milestone Bar */}
                      <div
                        className={cn(
                          "absolute top-1/2 h-6 -translate-y-1/2 rounded",
                          getMilestoneColor(milestone.status),
                        )}
                        style={calculateBarPosition(milestone.startDate, milestone.endDate)}
                      >
                        <div className="flex h-full items-center justify-center px-2">
                          <span className="text-xs font-medium text-white">{milestone.progress}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tasks Rows */}
                  {milestone.tasks.map((task) => (
                    <div key={task.id} className="flex border-b bg-muted/10 hover:bg-muted/30">
                      <div className="w-80 shrink-0 border-r p-4 pl-8">
                        <div className="flex items-center gap-2">
                          <div className={cn("h-2 w-2 rounded-full", getTaskColor(task.status))} />
                          <span className="text-sm">{task.title}</span>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge
                            variant="outline"
                            className={cn(
                              "h-5 text-[10px]",
                              task.priority === "critical" && "border-destructive text-destructive",
                              task.priority === "high" && "border-chart-4 text-chart-4",
                            )}
                          >
                            {task.priority === "critical"
                              ? "Crítica"
                              : task.priority === "high"
                                ? "Alta"
                                : task.priority === "medium"
                                  ? "Media"
                                  : "Baja"}
                          </Badge>
                          <span>
                            {new Date(task.startDate).toLocaleDateString("es-ES", { day: "numeric", month: "short" })} -{" "}
                            {new Date(task.endDate).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                          </span>
                        </div>
                      </div>
                      <div className="relative flex-1 p-3">
                        {/* Task Bar */}
                        <div
                          className={cn(
                            "absolute top-1/2 h-4 -translate-y-1/2 rounded-sm shadow-sm transition-all hover:shadow-md",
                            getTaskColor(task.status),
                          )}
                          style={calculateBarPosition(task.startDate, task.endDate)}
                        >
                          <div className="h-full w-full rounded-sm bg-gradient-to-r from-transparent to-black/10" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="border-t bg-muted/30 p-4">
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <span className="font-semibold text-muted-foreground">Estado:</span>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-chart-3" />
              <span>Completado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-chart-1" />
              <span>En Progreso</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-chart-4" />
              <span>Pendiente</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-destructive" />
              <span>Bloqueado/Retrasado</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
