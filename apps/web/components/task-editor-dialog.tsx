"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { getAllUsers, updateTask, deleteTask, addTask } from "@/lib/mock-data"
import type { Task } from "@/lib/types"
import { Pencil, Trash2, Plus } from "lucide-react"

interface TaskEditorDialogProps {
  task?: Task
  milestoneId: string
  projectId: string
  onUpdate: () => void
  mode: "edit" | "create"
  trigger?: React.ReactNode
}

export function TaskEditorDialog({ task, milestoneId, projectId, onUpdate, mode, trigger }: TaskEditorDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending" as Task["status"],
    priority: "medium" as Task["priority"],
    assignedTo: [] as string[],
    startDate: "",
    endDate: "",
  })

  const allUsers = getAllUsers().filter((u) => u.role === "developer" || u.role === "project-manager")

  useEffect(() => {
    if (task && mode === "edit") {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assignedTo: task.assignedTo,
        startDate: new Date(task.startDate).toISOString().split("T")[0],
        endDate: new Date(task.endDate).toISOString().split("T")[0],
      })
    } else if (mode === "create") {
      setFormData({
        title: "",
        description: "",
        status: "pending",
        priority: "medium",
        assignedTo: [],
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      })
    }
  }, [task, mode, open])

  const handleSave = () => {
    if (!formData.title || !formData.description) return

    if (mode === "edit" && task) {
      updateTask(task.id, {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        assignedTo: formData.assignedTo,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
      })
    } else if (mode === "create") {
      addTask(milestoneId, {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        assignedTo: formData.assignedTo,
        milestoneId: milestoneId,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        createdBy: "1", // En una app real, sería el usuario actual
      })
    }

    onUpdate()
    setOpen(false)
  }

  const handleDelete = () => {
    if (task) {
      deleteTask(task.id)
      onUpdate()
      setOpen(false)
    }
  }

  const toggleUserAssignment = (userId: string) => {
    setFormData((prev) => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(userId)
        ? prev.assignedTo.filter((id) => id !== userId)
        : [...prev.assignedTo, userId],
    }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant={mode === "create" ? "default" : "outline"} size={mode === "create" ? "default" : "icon"}>
            {mode === "create" ? (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Nueva Tarea
              </>
            ) : (
              <Pencil className="h-4 w-4" />
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Crear Nueva Tarea" : "Editar Tarea"}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Ingresa los detalles de la nueva tarea."
              : "Modifica los detalles de la tarea seleccionada."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título de la tarea</Label>
            <Input
              id="title"
              placeholder="Nombre descriptivo de la tarea"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Describe qué se debe hacer en esta tarea..."
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as Task["status"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="in-progress">En Progreso</SelectItem>
                  <SelectItem value="completed">Completada</SelectItem>
                  <SelectItem value="blocked">Bloqueada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Prioridad</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value as Task["priority"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="critical">Crítica</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">Fecha de inicio</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Fecha de finalización</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Asignar a usuarios</Label>
            <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg border p-3">
              {allUsers.map((u) => {
                const initials = u.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                const isAssigned = formData.assignedTo.includes(u.id)

                return (
                  <div
                    key={u.id}
                    className="flex cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-muted/50"
                    onClick={() => toggleUserAssignment(u.id)}
                  >
                    <Checkbox checked={isAssigned} onChange={() => toggleUserAssignment(u.id)} />
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={u.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {u.role === "project-manager" ? "PM" : "Dev"}
                    </Badge>
                  </div>
                )
              })}
            </div>
            <p className="text-xs text-muted-foreground">{formData.assignedTo.length} usuario(s) seleccionado(s)</p>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          {mode === "edit" && task && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="mr-auto">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Eliminar Tarea</AlertDialogTitle>
                  <AlertDialogDescription>
                    ¿Estás seguro de que deseas eliminar esta tarea? Esta acción no se puede deshacer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>{mode === "create" ? "Crear Tarea" : "Guardar Cambios"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
