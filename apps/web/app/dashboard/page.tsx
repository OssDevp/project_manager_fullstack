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
import { getUserProjects, getUserTasks } from "@/lib/mock-data"
import type { Project } from "@/lib/types"
import { Calendar, Users, LayoutGrid, CheckCircle2, Clock, AlertCircle, BarChart3, UserCog } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (user) {
      const userProjects = getUserProjects(user.id)
      setProjects(userProjects)
    }
  }, [isAuthenticated, user, router])

  if (!user) return null

  const isAdmin = user.role === "admin"
  const isAdminOrPM = user.role === "admin" || user.role === "project-manager"
  const userTasks = getUserTasks(user.id)
  const tasksInProgress = userTasks.filter((t) => t.status === "in-progress").length
  const tasksPending = userTasks.filter((t) => t.status === "pending").length
  const tasksCompleted = userTasks.filter((t) => t.status === "completed").length

  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "in-progress":
        return "bg-chart-1 text-primary-foreground"
      case "completed":
        return "bg-chart-3 text-primary-foreground"
      case "planning":
        return "bg-chart-2 text-primary-foreground"
      case "on-hold":
        return "bg-chart-4 text-primary-foreground"
      case "cancelled":
        return "bg-destructive text-destructive-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusText = (status: Project["status"]) => {
    switch (status) {
      case "in-progress":
        return "En Progreso"
      case "completed":
        return "Completado"
      case "planning":
        return "Planificación"
      case "on-hold":
        return "En Pausa"
      case "cancelled":
        return "Cancelado"
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="container mx-auto max-w-7xl p-6">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="mb-2 text-balance text-3xl font-bold tracking-tight text-foreground">
              Bienvenido, {user.name.split(" ")[0]}
            </h1>
            <p className="text-pretty text-muted-foreground">
              {isAdmin
                ? "Panel de administración del sistema"
                : isAdminOrPM
                  ? "Panel de administración de proyectos"
                  : "Panel de tareas y proyectos"}
            </p>
          </div>

          {isAdmin && (
            <Link href="/admin/users">
              <Button variant="outline">
                <UserCog className="mr-2 h-4 w-4" />
                Gestionar Usuarios
              </Button>
            </Link>
          )}
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Proyectos Activos</CardTitle>
              <LayoutGrid className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}</div>
              <p className="text-xs text-muted-foreground">Total de proyectos asignados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tareas en Progreso</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tasksInProgress}</div>
              <p className="text-xs text-muted-foreground">Tareas activas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tasksPending}</div>
              <p className="text-xs text-muted-foreground">Tareas por iniciar</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completadas</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tasksCompleted}</div>
              <p className="text-xs text-muted-foreground">Tareas finalizadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue={isAdminOrPM ? "projects" : "my-tasks"} className="space-y-4">
          <TabsList>
            <TabsTrigger value="projects">
              <LayoutGrid className="mr-2 h-4 w-4" />
              Proyectos
            </TabsTrigger>
            <TabsTrigger value="my-tasks">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Mis Tareas
            </TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Proyectos</h2>
              {isAdminOrPM && (
                <Button>
                  <Calendar className="mr-2 h-4 w-4" />
                  Nuevo Proyecto
                </Button>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {projects.map((project) => (
                <Card key={project.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-balance text-lg">{project.name}</CardTitle>
                        <CardDescription className="text-pretty">{project.description}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(project.status)}>{getStatusText(project.status)}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progreso</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} />
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(project.startDate).toLocaleDateString("es-ES", {
                              month: "short",
                              day: "numeric",
                            })}{" "}
                            -{" "}
                            {new Date(project.endDate).toLocaleDateString("es-ES", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{project.members.length} miembros</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/projects/${project.id}`} className="flex-1">
                          <Button variant="outline" className="w-full bg-transparent">
                            <LayoutGrid className="mr-2 h-4 w-4" />
                            Ver Detalles
                          </Button>
                        </Link>
                        <Link href={`/projects/${project.id}/gantt`} className="flex-1">
                          <Button variant="outline" className="w-full bg-transparent">
                            <BarChart3 className="mr-2 h-4 w-4" />
                            Gantt
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* My Tasks Tab */}
          <TabsContent value="my-tasks">
            <Card>
              <CardHeader>
                <CardTitle>Mis Tareas Asignadas</CardTitle>
                <CardDescription>Tareas que tienes asignadas en todos los proyectos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userTasks.length === 0 ? (
                    <p className="text-center text-muted-foreground">No tienes tareas asignadas</p>
                  ) : (
                    userTasks.map((task) => {
                      const project = projects.find((p) => p.milestones.some((m) => m.id === task.milestoneId))
                      const milestone = project?.milestones.find((m) => m.id === task.milestoneId)

                      const statusConfig = {
                        pending: { color: "bg-muted text-muted-foreground", text: "Pendiente" },
                        "in-progress": { color: "bg-chart-1 text-primary-foreground", text: "En Progreso" },
                        completed: { color: "bg-chart-3 text-primary-foreground", text: "Completada" },
                        blocked: { color: "bg-destructive text-destructive-foreground", text: "Bloqueada" },
                      }

                      const status = statusConfig[task.status]

                      return (
                        <div key={task.id} className="flex items-center justify-between rounded-lg border p-4">
                          <div className="flex-1">
                            <div className="mb-1 flex items-center gap-2">
                              <h4 className="font-medium">{task.title}</h4>
                              <Badge className={status.color}>{status.text}</Badge>
                            </div>
                            <p className="mb-2 text-sm text-muted-foreground">{task.description}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>Proyecto: {project?.name}</span>
                              <span>•</span>
                              <span>{milestone?.title}</span>
                              <span>•</span>
                              <span>
                                {new Date(task.endDate).toLocaleDateString("es-ES", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                          </div>
                          <Link href={`/my-tasks/${task.id}`}>
                            <Button variant="outline" size="sm">
                              Ver Detalles
                            </Button>
                          </Link>
                        </div>
                      )
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
