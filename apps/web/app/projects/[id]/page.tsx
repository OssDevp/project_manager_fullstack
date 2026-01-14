"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { AppHeader } from "@/components/app-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getProjectById, getUserById } from "@/lib/mock-data"
import { TaskDetailDialog } from "@/components/task-detail-dialog"
import { TaskEditorDialog } from "@/components/task-editor-dialog"
import { TaskCompletionIndicator } from "@/components/task-completion-indicator"
import type { Project, Milestone, Task } from "@/lib/types"
import {
  Calendar,
  Users,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  BarChart3,
  ListTodo,
  Target,
  Plus,
} from "lucide-react"
import Link from "next/link"

export default function ProjectDetailPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const refreshProject = () => {
    const projectId = params.id as string
    const foundProject = getProjectById(projectId)
    if (foundProject) {
      setProject({ ...foundProject })
    }
    setRefreshKey((k) => k + 1)
  }

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    refreshProject()
  }, [isAuthenticated, router, params.id])

  if (!project || !user) return null

  const canEdit = user.role === "admin" || user.role === "project-manager"

  const getMilestoneStatusColor = (status: Milestone["status"]) => {
    switch (status) {
      case "in-progress":
        return "bg-chart-1 text-primary-foreground"
      case "completed":
        return "bg-chart-3 text-primary-foreground"
      case "not-started":
        return "bg-muted text-muted-foreground"
      case "delayed":
        return "bg-destructive text-destructive-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getMilestoneStatusText = (status: Milestone["status"]) => {
    switch (status) {
      case "in-progress":
        return "En Progreso"
      case "completed":
        return "Completado"
      case "not-started":
        return "No Iniciado"
      case "delayed":
        return "Retrasado"
      default:
        return status
    }
  }

  const getTaskStatusColor = (status: Task["status"]) => {
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

  const getTaskStatusText = (status: Task["status"]) => {
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
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Dashboard
            </Button>
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="mb-2 text-balance text-3xl font-bold tracking-tight">{project.name}</h1>
              <p className="text-pretty text-muted-foreground">{project.description}</p>
            </div>
            <Link href={`/projects/${project.id}/gantt`}>
              <Button>
                <BarChart3 className="mr-2 h-4 w-4" />
                Ver Diagrama de Gantt
              </Button>
            </Link>
          </div>
        </div>

        {/* Project Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progreso General</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{project.progress}%</div>
              <Progress value={project.progress} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hitos</CardTitle>
              <ListTodo className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{project.milestones.length}</div>
              <p className="text-xs text-muted-foreground">
                {project.milestones.filter((m) => m.status === "completed").length} completados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tareas Totales</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{project.milestones.reduce((acc, m) => acc + m.tasks.length, 0)}</div>
              <p className="text-xs text-muted-foreground">
                {project.milestones.reduce((acc, m) => acc + m.tasks.filter((t) => t.status === "completed").length, 0)}{" "}
                completadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Miembros</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{project.members.length}</div>
              <div className="mt-2 flex -space-x-2">
                {project.members.slice(0, 4).map((member) => {
                  const memberUser = getUserById(member.userId)
                  if (!memberUser) return null
                  const initials = memberUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                  return (
                    <Avatar key={memberUser.id} className="h-6 w-6 border-2 border-background">
                      <AvatarImage src={memberUser.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                    </Avatar>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="milestones" className="space-y-4">
          <TabsList>
            <TabsTrigger value="milestones">
              <Target className="mr-2 h-4 w-4" />
              Hitos y Tareas
            </TabsTrigger>
            <TabsTrigger value="team">
              <Users className="mr-2 h-4 w-4" />
              Equipo
            </TabsTrigger>
          </TabsList>

          {/* Milestones Tab */}
          <TabsContent value="milestones" className="space-y-4">
            {project.milestones.map((milestone) => (
              <Card key={milestone.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-balance">{milestone.title}</CardTitle>
                        {canEdit && (
                          <TaskEditorDialog
                            milestoneId={milestone.id}
                            projectId={project.id}
                            onUpdate={refreshProject}
                            mode="create"
                            trigger={
                              <Button variant="outline" size="sm">
                                <Plus className="mr-1 h-3 w-3" />
                                Agregar Tarea
                              </Button>
                            }
                          />
                        )}
                      </div>
                      <CardDescription className="text-pretty">{milestone.description}</CardDescription>
                    </div>
                    <Badge className={getMilestoneStatusColor(milestone.status)}>
                      {getMilestoneStatusText(milestone.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(milestone.startDate).toLocaleDateString("es-ES", {
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        -{" "}
                        {new Date(milestone.endDate).toLocaleDateString("es-ES", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ListTodo className="h-4 w-4" />
                      <span>{milestone.tasks.length} tareas</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progreso del hito</span>
                      <span className="font-medium">{milestone.progress}%</span>
                    </div>
                    <Progress value={milestone.progress} />
                  </div>

                  <div className="space-y-2">
                    {milestone.tasks.map((task) => {
                      const statusIcons = {
                        pending: <Clock className="h-4 w-4 text-muted-foreground" />,
                        "in-progress": <Clock className="h-4 w-4 text-chart-1" />,
                        completed: <CheckCircle2 className="h-4 w-4 text-chart-3" />,
                        blocked: <AlertCircle className="h-4 w-4 text-destructive" />,
                      }

                      const assignedUsers = task.assignedTo.map((userId) => getUserById(userId)).filter(Boolean)
                      const hasMultipleAssignees = task.assignedTo.length > 1

                      return (
                        <div
                          key={task.id}
                          className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-muted/50"
                        >
                          <TaskDetailDialog task={task} milestoneName={milestone.title} projectName={project.name}>
                            <div className="flex flex-1 cursor-pointer items-center gap-3">
                              {statusIcons[task.status]}
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium">{task.title}</p>
                                  <Badge className={`text-xs ${getTaskStatusColor(task.status)}`}>
                                    {getTaskStatusText(task.status)}
                                  </Badge>
                                  <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                                    {getPriorityText(task.priority)}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(task.endDate).toLocaleDateString("es-ES", {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                  {" • "}
                                  {task.description.substring(0, 60)}
                                  {task.description.length > 60 && "..."}
                                </p>
                              </div>
                            </div>
                          </TaskDetailDialog>

                          <div className="flex items-center gap-3">
                            {hasMultipleAssignees && task.userCompletions && (
                              <TaskCompletionIndicator
                                userCompletions={task.userCompletions}
                                assignedTo={task.assignedTo}
                                variant="compact"
                              />
                            )}

                            <div className="flex -space-x-1">
                              {assignedUsers.map((u) => {
                                if (!u) return null
                                const initials = u.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                return (
                                  <Avatar key={u.id} className="h-6 w-6 border-2 border-background">
                                    <AvatarImage src={u.avatar || "/placeholder.svg"} />
                                    <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                                  </Avatar>
                                )
                              })}
                            </div>

                            {canEdit && (
                              <TaskEditorDialog
                                task={task}
                                milestoneId={milestone.id}
                                projectId={project.id}
                                onUpdate={refreshProject}
                                mode="edit"
                              />
                            )}
                          </div>
                        </div>
                      )
                    })}

                    {milestone.tasks.length === 0 && (
                      <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                        No hay tareas en este hito
                        {canEdit && (
                          <div className="mt-2">
                            <TaskEditorDialog
                              milestoneId={milestone.id}
                              projectId={project.id}
                              onUpdate={refreshProject}
                              mode="create"
                              trigger={
                                <Button variant="outline" size="sm">
                                  <Plus className="mr-1 h-3 w-3" />
                                  Crear primera tarea
                                </Button>
                              }
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team">
            <Card>
              <CardHeader>
                <CardTitle>Equipo del Proyecto</CardTitle>
                <CardDescription>Miembros y sus roles en este proyecto</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {project.members.map((member) => {
                    const memberUser = getUserById(member.userId)
                    if (!memberUser) return null

                    const roleText = {
                      admin: "Administrador",
                      "project-manager": "Gestor de Proyecto",
                      developer: "Desarrollador",
                      viewer: "Visualizador",
                    }

                    const initials = memberUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")

                    return (
                      <div key={memberUser.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={memberUser.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{memberUser.name}</p>
                            <p className="text-sm text-muted-foreground">{memberUser.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">{roleText[member.role]}</Badge>
                          <div className="mt-1 flex gap-2 text-xs text-muted-foreground">
                            {member.canEdit && <span>Editar</span>}
                            {member.canAssignTasks && <span>• Asignar</span>}
                            {member.canDelete && <span>• Eliminar</span>}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
