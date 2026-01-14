"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { AppHeader } from "@/components/app-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { getAllUsers, addUser, updateUser, deleteUser } from "@/lib/mock-data"
import type { User, UserRole } from "@/lib/types"
import { ArrowLeft, UserPlus, Pencil, Trash2, Users, ShieldCheck, Code, Eye, Crown } from "lucide-react"
import Link from "next/link"

export default function AdminUsersPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "developer" as UserRole,
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (user?.role !== "admin") {
      router.push("/dashboard")
      return
    }

    setUsers(getAllUsers())
  }, [isAuthenticated, user, router])

  if (!user || user.role !== "admin") return null

  const handleCreateUser = () => {
    if (formData.name && formData.email) {
      addUser({
        name: formData.name,
        email: formData.email,
        role: formData.role,
      })
      setUsers(getAllUsers())
      setFormData({ name: "", email: "", role: "developer" })
      setIsCreateDialogOpen(false)
    }
  }

  const handleUpdateUser = () => {
    if (editingUser && formData.name && formData.email) {
      updateUser(editingUser.id, {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      })
      setUsers(getAllUsers())
      setEditingUser(null)
      setFormData({ name: "", email: "", role: "developer" })
    }
  }

  const handleDeleteUser = (userId: string) => {
    if (userId !== user.id) {
      deleteUser(userId)
      setUsers(getAllUsers())
    }
  }

  const openEditDialog = (userToEdit: User) => {
    setEditingUser(userToEdit)
    setFormData({
      name: userToEdit.name,
      email: userToEdit.email,
      role: userToEdit.role,
    })
  }

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "admin":
        return <Crown className="h-4 w-4" />
      case "project-manager":
        return <ShieldCheck className="h-4 w-4" />
      case "developer":
        return <Code className="h-4 w-4" />
      case "viewer":
        return <Eye className="h-4 w-4" />
      default:
        return null
    }
  }

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "bg-chart-4 text-primary-foreground"
      case "project-manager":
        return "bg-chart-1 text-primary-foreground"
      case "developer":
        return "bg-chart-3 text-primary-foreground"
      case "viewer":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getRoleText = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "Administrador"
      case "project-manager":
        return "Gestor de Proyecto"
      case "developer":
        return "Desarrollador"
      case "viewer":
        return "Visualizador"
      default:
        return role
    }
  }

  const getRoleDescription = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "Acceso completo al sistema. Puede crear usuarios, proyectos y gestionar todos los aspectos."
      case "project-manager":
        return "Puede crear y editar proyectos, asignar tareas y gestionar equipos de trabajo."
      case "developer":
        return "Puede ver proyectos asignados, completar tareas y actualizar su progreso."
      case "viewer":
        return "Solo puede visualizar proyectos y tareas sin capacidad de edición."
      default:
        return ""
    }
  }

  const usersByRole = {
    admin: users.filter((u) => u.role === "admin"),
    "project-manager": users.filter((u) => u.role === "project-manager"),
    developer: users.filter((u) => u.role === "developer"),
    viewer: users.filter((u) => u.role === "viewer"),
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="container mx-auto max-w-6xl p-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Dashboard
          </Button>
        </Link>

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-balance text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
            <p className="text-pretty text-muted-foreground">
              Administra los usuarios del sistema y sus roles de acceso
            </p>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Nuevo Usuario
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                <DialogDescription>Ingresa los datos del nuevo usuario y asigna un rol.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input
                    id="name"
                    placeholder="Juan Pérez"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="juan@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Rol</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">
                        <div className="flex items-center gap-2">
                          <Crown className="h-4 w-4" />
                          Administrador
                        </div>
                      </SelectItem>
                      <SelectItem value="project-manager">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4" />
                          Gestor de Proyecto
                        </div>
                      </SelectItem>
                      <SelectItem value="developer">
                        <div className="flex items-center gap-2">
                          <Code className="h-4 w-4" />
                          Desarrollador
                        </div>
                      </SelectItem>
                      <SelectItem value="viewer">
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          Visualizador
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">{getRoleDescription(formData.role)}</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateUser}>Crear Usuario</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Administradores</CardTitle>
              <Crown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usersByRole.admin.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gestores</CardTitle>
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usersByRole["project-manager"].length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Desarrolladores</CardTitle>
              <Code className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usersByRole.developer.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Role descriptions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Roles y Permisos</CardTitle>
            <CardDescription>Descripción de los roles disponibles en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {(["admin", "project-manager", "developer", "viewer"] as UserRole[]).map((role) => (
                <div key={role} className="flex items-start gap-3 rounded-lg border p-4">
                  <div className={`rounded-full p-2 ${getRoleColor(role)}`}>{getRoleIcon(role)}</div>
                  <div>
                    <h4 className="font-medium">{getRoleText(role)}</h4>
                    <p className="text-sm text-muted-foreground">{getRoleDescription(role)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Users list */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Usuarios</CardTitle>
            <CardDescription>Todos los usuarios registrados en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {users.map((u) => {
                const initials = u.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")

                return (
                  <div key={u.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={u.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{u.name}</p>
                          {u.id === user.id && (
                            <Badge variant="outline" className="text-xs">
                              Tú
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{u.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Registrado: {new Date(u.createdAt).toLocaleDateString("es-ES")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge className={`gap-1 ${getRoleColor(u.role)}`}>
                        {getRoleIcon(u.role)}
                        {getRoleText(u.role)}
                      </Badge>

                      <div className="flex gap-2">
                        <Dialog
                          open={editingUser?.id === u.id}
                          onOpenChange={(open) => {
                            if (!open) {
                              setEditingUser(null)
                              setFormData({ name: "", email: "", role: "developer" })
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="icon" onClick={() => openEditDialog(u)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Editar Usuario</DialogTitle>
                              <DialogDescription>Modifica los datos del usuario.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-name">Nombre completo</Label>
                                <Input
                                  id="edit-name"
                                  value={formData.name}
                                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-email">Correo electrónico</Label>
                                <Input
                                  id="edit-email"
                                  type="email"
                                  value={formData.email}
                                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-role">Rol</Label>
                                <Select
                                  value={formData.role}
                                  onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="admin">Administrador</SelectItem>
                                    <SelectItem value="project-manager">Gestor de Proyecto</SelectItem>
                                    <SelectItem value="developer">Desarrollador</SelectItem>
                                    <SelectItem value="viewer">Visualizador</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setEditingUser(null)}>
                                Cancelar
                              </Button>
                              <Button onClick={handleUpdateUser}>Guardar Cambios</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
                              disabled={u.id === user.id}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Eliminar Usuario</AlertDialogTitle>
                              <AlertDialogDescription>
                                ¿Estás seguro de que deseas eliminar a {u.name}? Esta acción no se puede deshacer.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteUser(u.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
