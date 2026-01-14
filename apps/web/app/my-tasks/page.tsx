"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { AppHeader } from "@/components/app-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getUserTasks, getUserProjects, updateUserTaskStatus } from "@/lib/mock-data"
import { TaskCompletionIndicator } from "@/components/task-completion-indicator"
import { UserTaskStatusSelector } from "@/components/user-task-status-selector"
import type { Task, Project, UserTaskStatus } from "@/lib/types"
import {
  Calendar,
  CheckCircle2,
  Clock,
  Target,
  LayoutGrid,
  Filter,
  TrendingUp,
  ListTodo,
  Users,
  PlayCircle,
  PauseCircle,
} from "lucide-react"
import Link from "next/link"

export default function MyTasksPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterPriority, setFilterPriority] = useState<string>("all")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (user) {
      const userTasks = getUserTasks(user.id)
      const userProjects = getUserProjects(user.id)
      setTasks(userTasks)
      setProjects(userProjects)
    }
  }, [isAuthenticated, user, router])

  if (!user) return null

  const handleUserStatusChange = (taskId: string, newStatus: UserTaskStatus) => {
    updateUserTaskStatus(taskId, user.id, newStatus)
    const updatedTasks = getUserTasks(user.id)
    setTasks(updatedTasks)
  }

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const statusMatch = filterStatus === "all" || task.status === filterStatus
    const priorityMatch = filterPriority === "all" || task.priority === filterPriority
    return statusMatch && priorityMatch
  })

  // Group tasks by status
  const tasksByStatus = {
    pending: filteredTasks.filter((t) => t.status === "pending"),
    "in-progress": filteredTasks.filter((t) => t.status === "in-progress"),
    completed: filteredTasks.filter((t) => t.status === "completed"),
    blocked: filteredTasks.filter((t) => t.status === "blocked"),
  }

  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.status === "completed").length
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const myStatusStats = {
    completed: tasks.filter((t) => t.userCompletions?.find((uc) => uc.userId === user.id)?.userStatus === "completed")
      .length,
    inProgress: tasks.filter(
      (t) => t.userCompletions?.find((uc) => uc.userId === user.id)?.userStatus === "in-progress",
    ).length,
    paused: tasks.filter((t) => t.userCompletions?.find((uc) => uc.userId === user.id)?.userStatus === "paused").length,
    pending: tasks.filter((t) => t.userCompletions?.find((uc) => uc.userId === user.id)?.userStatus === "pending")
      .length,
  }

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "pending":
        return "bg-muted text-muted-foreground"
      case "in-progress":
        return "bg-chart-1 text-primary-foreground"
      case "completed":
        return "bg-chart-3 text-primary-foreground"
      case "blocked":
        return "bg-destructive text-destructive-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusText = (status: Task["status"]) => {
    switch (status) {
      case "pending":
        return "Pendiente"
      case "in-progress":
        return "En Progreso"
      case "completed":
        return "Completada"
      case "blocked":
        return "Bloqueada"
      default:
        return status
    }
  }

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "critical":
        return "border-destructive text-destructive"
      case "high":
        return "border-chart-4 text-chart-4"
      case "medium":
        return "border-chart-1 text-chart-1"
      case "low":
        return "border-muted-foreground text-muted-foreground"
      default:
        return "border-muted text-muted-foreground"
    }
  }

  const getPriorityText = (priority: Task["priority"]) => {
    switch (priority) {
      case "critical":
        return "Crítica"
      case "high":
        return "Alta"
      case "medium":
        return "Media"
      case "low":
        return "Baja"
      default:
        return priority
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="container mx-auto max-w-7xl p-6">
        <div className="mb-8">
          <h1 className="mb-2 text-balance text-3xl font-bold tracking-tight">Mis Tareas</h1>
          <p className="text-pretty text-muted-foreground">Gestiona tus tareas asignadas y visualiza tu progreso</p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Tareas</CardTitle>
              <ListTodo className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTasks}</div>
              <p className="text-xs text-muted-foreground">Asignadas a ti</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Progreso</CardTitle>
              <PlayCircle className="h-4 w-4 text-chart-1" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-1">{myStatusStats.inProgress}</div>
              <p className="text-xs text-muted-foreground">Trabajando activamente</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Pausa</CardTitle>
              <PauseCircle className="h-4 w-4 text-chart-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-4">{myStatusStats.paused}</div>
              <p className="text-xs text-muted-foreground">Pausadas temporalmente</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completadas</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-chart-3" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-3">{myStatusStats.completed}</div>
              <p className="text-xs text-muted-foreground">de {totalTasks} tareas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mi Progreso</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalTasks > 0 ? Math.round((myStatusStats.completed / totalTasks) * 100) : 0}%
              </div>
              <Progress
                value={totalTasks > 0 ? Math.round((myStatusStats.completed / totalTasks) * 100) : 0}
                className="mt-2"
              />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">
                <ListTodo className="mr-2 h-4 w-4" />
                Todas ({filteredTasks.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                <Clock className="mr-2 h-4 w-4" />
                Pendientes ({tasksByStatus.pending.length})
              </TabsTrigger>
              <TabsTrigger value="in-progress">
                <Target className="mr-2 h-4 w-4" />
                En Progreso ({tasksByStatus["in-progress"].length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Completadas ({tasksByStatus.completed.length})
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las prioridades</SelectItem>
                  <SelectItem value="critical">Crítica</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="low">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* All Tasks Tab */}
          <TabsContent value="all">
            <TaskList
              tasks={filteredTasks}
              projects={projects}
              currentUserId={user.id}
              onUserStatusChange={handleUserStatusChange}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              getPriorityColor={getPriorityColor}
              getPriorityText={getPriorityText}
            />
          </TabsContent>

          {/* Pending Tasks Tab */}
          <TabsContent value="pending">
            <TaskList
              tasks={tasksByStatus.pending}
              projects={projects}
              currentUserId={user.id}
              onUserStatusChange={handleUserStatusChange}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              getPriorityColor={getPriorityColor}
              getPriorityText={getPriorityText}
            />
          </TabsContent>

          {/* In Progress Tasks Tab */}
          <TabsContent value="in-progress">
            <TaskList
              tasks={tasksByStatus["in-progress"]}
              projects={projects}
              currentUserId={user.id}
              onUserStatusChange={handleUserStatusChange}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              getPriorityColor={getPriorityColor}
              getPriorityText={getPriorityText}
            />
          </TabsContent>

          {/* Completed Tasks Tab */}
          <TabsContent value="completed">
            <TaskList
              tasks={tasksByStatus.completed}
              projects={projects}
              currentUserId={user.id}
              onUserStatusChange={handleUserStatusChange}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              getPriorityColor={getPriorityColor}
              getPriorityText={getPriorityText}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

interface TaskListProps {
  tasks: Task[]
  projects: Project[]
  currentUserId: string
  onUserStatusChange: (taskId: string, status: UserTaskStatus) => void
  getStatusColor: (status: Task["status"]) => string
  getStatusText: (status: Task["status"]) => string
  getPriorityColor: (priority: Task["priority"]) => string
  getPriorityText: (priority: Task["priority"]) => string
}

function TaskList({
  tasks,
  projects,
  currentUserId,
  onUserStatusChange,
  getStatusColor,
  getStatusText,
  getPriorityColor,
  getPriorityText,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="flex min-h-[200px] items-center justify-center">
          <p className="text-muted-foreground">No hay tareas en esta categoría</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const project = projects.find((p) => p.milestones.some((m) => m.id === task.milestoneId))
        const milestone = project?.milestones.find((m) => m.id === task.milestoneId)

        const myCompletion = task.userCompletions?.find((uc) => uc.userId === currentUserId)
        const myStatus = myCompletion?.userStatus || "pending"
        const hasMultipleAssignees = task.assignedTo.length > 1

        return (
          <Card key={task.id} className="overflow-hidden transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <CardTitle className="text-balance">{task.title}</CardTitle>
                    <Badge className={getStatusColor(task.status)}>{getStatusText(task.status)}</Badge>
                    <Badge variant="outline" className={getPriorityColor(task.priority)}>
                      {getPriorityText(task.priority)}
                    </Badge>
                    {hasMultipleAssignees && (
                      <Badge variant="secondary" className="gap-1">
                        <Users className="h-3 w-3" />
                        {task.assignedTo.length} asignados
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-pretty">{task.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <LayoutGrid className="h-4 w-4" />
                    <span>{project?.name}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    <span>{milestone?.title}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(task.startDate).toLocaleDateString("es-ES", {
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      -{" "}
                      {new Date(task.endDate).toLocaleDateString("es-ES", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {hasMultipleAssignees && task.userCompletions && (
                  <TaskCompletionIndicator
                    userCompletions={task.userCompletions}
                    assignedTo={task.assignedTo}
                    variant="detailed"
                  />
                )}

                <div className="flex items-center justify-between gap-4 rounded-lg border bg-muted/50 p-3">
                  <div className="flex-1">
                    <p className="mb-1 text-sm font-medium">
                      {hasMultipleAssignees ? "Mi estado en esta tarea:" : "Estado de la tarea:"}
                    </p>
                    <UserTaskStatusSelector
                      currentStatus={myStatus}
                      onStatusChange={(status) => onUserStatusChange(task.id, status)}
                    />
                  </div>

                  {project && (
                    <Link href={`/my-tasks/${task.id}`}>
                      <Button variant="outline" size="sm">
                        Ver Detalles
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
