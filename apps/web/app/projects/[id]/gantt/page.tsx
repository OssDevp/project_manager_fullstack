"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { GanttChart } from "@/components/gantt-chart"
import { getProjectById } from "@/lib/mock-data"
import type { Project } from "@/lib/types"
import { ArrowLeft, Download, ZoomIn, ZoomOut } from "lucide-react"
import Link from "next/link"

export default function GanttPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [project, setProject] = useState<Project | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    const projectId = params.id as string
    const foundProject = getProjectById(projectId)
    if (foundProject) {
      setProject(foundProject)
    }
  }, [isAuthenticated, router, params.id])

  if (!project) return null

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="container mx-auto max-w-[1600px] p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link href={`/projects/${project.id}`}>
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al Proyecto
              </Button>
            </Link>
            <h1 className="text-balance text-3xl font-bold tracking-tight">Diagrama de Gantt</h1>
            <p className="text-pretty text-muted-foreground">{project.name}</p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>

        <GanttChart project={project} />

        <div className="mt-6 rounded-lg border bg-card p-4">
          <h3 className="mb-2 font-semibold">Información del Proyecto</h3>
          <div className="grid gap-2 text-sm md:grid-cols-3">
            <div>
              <span className="text-muted-foreground">Fecha de inicio:</span>
              <span className="ml-2 font-medium">
                {new Date(project.startDate).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Fecha de finalización:</span>
              <span className="ml-2 font-medium">
                {new Date(project.endDate).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Horas estimadas:</span>
              <span className="ml-2 font-medium">{project.estimatedHours}h</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
