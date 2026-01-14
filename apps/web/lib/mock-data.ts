import type { User, Project, Milestone, Task, ProjectMember, TaskUserCompletion, UserTaskStatus } from "./types"

// Mock Users
export const mockUsers: User[] = [
  {
    id: "1",
    name: "Ana García",
    email: "ana@example.com",
    avatar: "/diverse-woman-portrait.png",
    role: "admin",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    name: "Carlos Rodríguez",
    email: "carlos@example.com",
    avatar: "/man.jpg",
    role: "project-manager",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "3",
    name: "María López",
    email: "maria@example.com",
    avatar: "/diverse-woman-portrait.png",
    role: "developer",
    createdAt: new Date("2024-02-01"),
  },
  {
    id: "4",
    name: "Juan Martínez",
    email: "juan@example.com",
    avatar: "/man.jpg",
    role: "developer",
    createdAt: new Date("2024-02-01"),
  },
  {
    id: "5",
    name: "Laura Sánchez",
    email: "laura@example.com",
    avatar: "/diverse-woman-portrait.png",
    role: "developer",
    createdAt: new Date("2024-02-15"),
  },
]

const createUserCompletions = (
  assignedTo: string[],
  completedUsers: string[] = [],
  statusMap: Record<string, UserTaskStatus> = {},
): TaskUserCompletion[] => {
  return assignedTo.map((userId) => ({
    userId,
    isCompleted: completedUsers.includes(userId),
    completedAt: completedUsers.includes(userId) ? new Date() : undefined,
    userStatus: statusMap[userId] || (completedUsers.includes(userId) ? "completed" : "pending"),
  }))
}

// Mock Tasks - Agregando userCompletions a cada tarea
const createMockTasks = (): Task[] => [
  {
    id: "t1",
    title: "Diseño de arquitectura",
    description:
      "Definir la arquitectura del sistema incluyendo patrones de diseño, estructura de carpetas y flujo de datos",
    status: "completed",
    assignedTo: ["2", "3"],
    userCompletions: createUserCompletions(["2", "3"], ["2", "3"], { "2": "completed", "3": "completed" }),
    milestoneId: "m1",
    priority: "high",
    startDate: new Date("2024-11-01"),
    endDate: new Date("2024-11-15"),
    createdAt: new Date("2024-11-01"),
    updatedAt: new Date("2024-11-15"),
    createdBy: "1",
  },
  {
    id: "t2",
    title: "Configuración de base de datos",
    description: "Configurar PostgreSQL con todos los esquemas necesarios, índices y relaciones entre tablas",
    status: "completed",
    assignedTo: ["3"],
    userCompletions: createUserCompletions(["3"], ["3"], { "3": "completed" }),
    milestoneId: "m1",
    priority: "high",
    startDate: new Date("2024-11-10"),
    endDate: new Date("2024-11-20"),
    createdAt: new Date("2024-11-10"),
    updatedAt: new Date("2024-11-20"),
    createdBy: "2",
  },
  {
    id: "t3",
    title: "Implementar autenticación",
    description:
      "Sistema completo de login y registro de usuarios con JWT, validación de emails y recuperación de contraseñas",
    status: "in-progress",
    assignedTo: ["3", "4"],
    userCompletions: createUserCompletions(["3", "4"], ["3"], { "3": "completed", "4": "in-progress" }),
    milestoneId: "m2",
    priority: "critical",
    startDate: new Date("2024-11-16"),
    endDate: new Date("2024-12-05"),
    createdAt: new Date("2024-11-16"),
    updatedAt: new Date("2024-12-01"),
    createdBy: "2",
  },
  {
    id: "t4",
    title: "API de usuarios",
    description: "Crear todos los endpoints REST para gestión de usuarios: CRUD completo, perfiles y preferencias",
    status: "in-progress",
    assignedTo: ["4"],
    userCompletions: createUserCompletions(["4"], [], { "4": "in-progress" }),
    milestoneId: "m2",
    priority: "high",
    startDate: new Date("2024-11-20"),
    endDate: new Date("2024-12-10"),
    createdAt: new Date("2024-11-20"),
    updatedAt: new Date("2024-11-28"),
    createdBy: "2",
  },
  {
    id: "t5",
    title: "Dashboard principal",
    description: "Diseñar e implementar la interfaz principal del usuario con métricas, gráficos y accesos rápidos",
    status: "pending",
    assignedTo: ["5"],
    userCompletions: createUserCompletions(["5"], [], { "5": "pending" }),
    milestoneId: "m3",
    priority: "medium",
    startDate: new Date("2024-12-01"),
    endDate: new Date("2024-12-20"),
    createdAt: new Date("2024-11-25"),
    updatedAt: new Date("2024-11-25"),
    createdBy: "2",
  },
  {
    id: "t6",
    title: "Componentes UI",
    description:
      "Crear biblioteca de componentes reutilizables: botones, formularios, tablas, modales y notificaciones",
    status: "in-progress",
    assignedTo: ["5"],
    userCompletions: createUserCompletions(["5"], [], { "5": "in-progress" }),
    milestoneId: "m3",
    priority: "medium",
    startDate: new Date("2024-12-01"),
    endDate: new Date("2024-12-15"),
    createdAt: new Date("2024-11-28"),
    updatedAt: new Date("2024-12-01"),
    createdBy: "2",
  },
  {
    id: "t7",
    title: "Integración frontend-backend",
    description: "Conectar el frontend con la API mediante hooks personalizados, manejo de estados y caché",
    status: "pending",
    assignedTo: ["3", "5"],
    userCompletions: createUserCompletions(["3", "5"], [], { "3": "paused", "5": "pending" }),
    milestoneId: "m4",
    priority: "high",
    startDate: new Date("2024-12-10"),
    endDate: new Date("2024-12-25"),
    createdAt: new Date("2024-11-30"),
    updatedAt: new Date("2024-11-30"),
    createdBy: "2",
  },
  {
    id: "t8",
    title: "Testing unitario",
    description: "Escribir tests unitarios para todos los componentes críticos con cobertura mínima del 80%",
    status: "pending",
    assignedTo: ["4"],
    userCompletions: createUserCompletions(["4"], [], { "4": "pending" }),
    milestoneId: "m4",
    priority: "medium",
    startDate: new Date("2024-12-15"),
    endDate: new Date("2024-12-30"),
    createdAt: new Date("2024-12-01"),
    updatedAt: new Date("2024-12-01"),
    createdBy: "2",
  },
  {
    id: "t9",
    title: "Optimización de rendimiento",
    description: "Mejorar tiempos de carga, implementar lazy loading, optimizar consultas y reducir bundle size",
    status: "pending",
    assignedTo: ["3"],
    userCompletions: createUserCompletions(["3"], [], { "3": "pending" }),
    milestoneId: "m5",
    priority: "low",
    startDate: new Date("2025-01-05"),
    endDate: new Date("2025-01-15"),
    createdAt: new Date("2024-12-05"),
    updatedAt: new Date("2024-12-05"),
    createdBy: "1",
  },
  {
    id: "t10",
    title: "Documentación técnica",
    description: "Escribir documentación completa del proyecto: API docs, guías de instalación y manual de usuario",
    status: "pending",
    assignedTo: ["2", "3", "4", "5"],
    userCompletions: createUserCompletions(["2", "3", "4", "5"], ["2"], {
      "2": "completed",
      "3": "in-progress",
      "4": "pending",
      "5": "paused",
    }),
    milestoneId: "m5",
    priority: "medium",
    startDate: new Date("2025-01-10"),
    endDate: new Date("2025-01-25"),
    createdAt: new Date("2024-12-10"),
    updatedAt: new Date("2024-12-10"),
    createdBy: "1",
  },
]

// Mock Project Members
const mockProjectMembers: ProjectMember[] = [
  {
    userId: "1",
    projectId: "p1",
    role: "admin",
    canEdit: true,
    canDelete: true,
    canAssignTasks: true,
    joinedAt: new Date("2024-10-20"),
  },
  {
    userId: "2",
    projectId: "p1",
    role: "project-manager",
    canEdit: true,
    canDelete: false,
    canAssignTasks: true,
    joinedAt: new Date("2024-10-20"),
  },
  {
    userId: "3",
    projectId: "p1",
    role: "developer",
    canEdit: true,
    canDelete: false,
    canAssignTasks: false,
    joinedAt: new Date("2024-10-25"),
  },
  {
    userId: "4",
    projectId: "p1",
    role: "developer",
    canEdit: true,
    canDelete: false,
    canAssignTasks: false,
    joinedAt: new Date("2024-10-25"),
  },
  {
    userId: "5",
    projectId: "p1",
    role: "developer",
    canEdit: true,
    canDelete: false,
    canAssignTasks: false,
    joinedAt: new Date("2024-11-01"),
  },
]

// Mock Milestones
const createMockMilestones = (): Milestone[] => {
  const tasks = createMockTasks()
  return [
    {
      id: "m1",
      title: "Fase 1: Planificación",
      description: "Planificación inicial y diseño del sistema",
      projectId: "p1",
      tasks: tasks.filter((t) => t.milestoneId === "m1"),
      startDate: new Date("2024-11-01"),
      endDate: new Date("2024-11-20"),
      progress: 100,
      status: "completed",
      createdAt: new Date("2024-10-25"),
    },
    {
      id: "m2",
      title: "Fase 2: Backend",
      description: "Desarrollo del backend y APIs",
      projectId: "p1",
      tasks: tasks.filter((t) => t.milestoneId === "m2"),
      startDate: new Date("2024-11-16"),
      endDate: new Date("2024-12-10"),
      progress: 65,
      status: "in-progress",
      createdAt: new Date("2024-11-10"),
    },
    {
      id: "m3",
      title: "Fase 3: Frontend",
      description: "Desarrollo de la interfaz de usuario",
      projectId: "p1",
      tasks: tasks.filter((t) => t.milestoneId === "m3"),
      startDate: new Date("2024-12-01"),
      endDate: new Date("2024-12-20"),
      progress: 40,
      status: "in-progress",
      createdAt: new Date("2024-11-20"),
    },
    {
      id: "m4",
      title: "Fase 4: Integración",
      description: "Integración y testing",
      projectId: "p1",
      tasks: tasks.filter((t) => t.milestoneId === "m4"),
      startDate: new Date("2024-12-10"),
      endDate: new Date("2024-12-30"),
      progress: 0,
      status: "not-started",
      createdAt: new Date("2024-11-25"),
    },
    {
      id: "m5",
      title: "Fase 5: Lanzamiento",
      description: "Optimización y documentación final",
      projectId: "p1",
      tasks: tasks.filter((t) => t.milestoneId === "m5"),
      startDate: new Date("2025-01-05"),
      endDate: new Date("2025-01-25"),
      progress: 0,
      status: "not-started",
      createdAt: new Date("2024-12-01"),
    },
  ]
}

// Mock Projects
export const mockProjects: Project[] = [
  {
    id: "p1",
    name: "Plataforma E-Commerce",
    description: "Desarrollo de una plataforma de comercio electrónico completa",
    startDate: new Date("2024-11-01"),
    endDate: new Date("2025-01-25"),
    estimatedHours: 800,
    status: "in-progress",
    progress: 52,
    milestones: createMockMilestones(),
    members: mockProjectMembers,
    createdBy: "1",
    createdAt: new Date("2024-10-15"),
    updatedAt: new Date("2024-12-01"),
  },
]

// Helper functions
export const getCurrentUser = (): User => {
  return mockUsers[2]
}

export const getUserById = (id: string): User | undefined => {
  return mockUsers.find((user) => user.id === id)
}

export const getAllUsers = (): User[] => {
  return mockUsers
}

export const getProjectById = (id: string): Project | undefined => {
  return mockProjects.find((project) => project.id === id)
}

export const getAllProjects = (): Project[] => {
  return mockProjects
}

export const getUserProjects = (userId: string): Project[] => {
  return mockProjects.filter((project) => project.members.some((member) => member.userId === userId))
}

export const getUserTasks = (userId: string): Task[] => {
  const tasks: Task[] = []
  mockProjects.forEach((project) => {
    project.milestones.forEach((milestone) => {
      milestone.tasks.forEach((task) => {
        if (task.assignedTo.includes(userId)) {
          tasks.push(task)
        }
      })
    })
  })
  return tasks
}

export const getTaskById = (taskId: string): Task | undefined => {
  for (const project of mockProjects) {
    for (const milestone of project.milestones) {
      const task = milestone.tasks.find((t) => t.id === taskId)
      if (task) return task
    }
  }
  return undefined
}

export const updateUserTaskStatus = (taskId: string, userId: string, newStatus: UserTaskStatus): void => {
  mockProjects.forEach((project) => {
    project.milestones.forEach((milestone) => {
      const task = milestone.tasks.find((t) => t.id === taskId)
      if (task) {
        if (!task.userCompletions) {
          task.userCompletions = task.assignedTo.map((uid) => ({
            userId: uid,
            isCompleted: false,
            userStatus: "pending" as UserTaskStatus,
          }))
        }

        const userCompletion = task.userCompletions.find((uc) => uc.userId === userId)
        if (userCompletion) {
          userCompletion.userStatus = newStatus
          userCompletion.isCompleted = newStatus === "completed"
          userCompletion.completedAt = newStatus === "completed" ? new Date() : undefined
        }

        // Actualizar estado general de la tarea basado en los estados individuales
        const allCompleted = task.userCompletions.every((uc) => uc.userStatus === "completed")
        const anyInProgress = task.userCompletions.some((uc) => uc.userStatus === "in-progress")
        const allPaused = task.userCompletions.every((uc) => uc.userStatus === "paused")

        if (allCompleted) {
          task.status = "completed"
        } else if (allPaused) {
          task.status = "blocked"
        } else if (anyInProgress) {
          task.status = "in-progress"
        } else {
          task.status = "pending"
        }

        task.updatedAt = new Date()

        // Actualizar progreso del hito
        const completedTasks = milestone.tasks.filter((t) => t.status === "completed").length
        milestone.progress = Math.round((completedTasks / milestone.tasks.length) * 100)

        // Actualizar progreso del proyecto
        const totalTasks = project.milestones.reduce((acc, m) => acc + m.tasks.length, 0)
        const totalCompleted = project.milestones.reduce(
          (acc, m) => acc + m.tasks.filter((t) => t.status === "completed").length,
          0,
        )
        project.progress = Math.round((totalCompleted / totalTasks) * 100)
      }
    })
  })
}

export const updateUserTaskCompletion = (taskId: string, userId: string, isCompleted: boolean): void => {
  updateUserTaskStatus(taskId, userId, isCompleted ? "completed" : "pending")
}

export const addUser = (user: Omit<User, "id" | "createdAt">): User => {
  const newUser: User = {
    ...user,
    id: `${mockUsers.length + 1}`,
    createdAt: new Date(),
  }
  mockUsers.push(newUser)
  return newUser
}

export const updateUser = (userId: string, updates: Partial<User>): void => {
  const userIndex = mockUsers.findIndex((u) => u.id === userId)
  if (userIndex !== -1) {
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates }
  }
}

export const deleteUser = (userId: string): void => {
  const userIndex = mockUsers.findIndex((u) => u.id === userId)
  if (userIndex !== -1) {
    mockUsers.splice(userIndex, 1)
  }
}

export const addTask = (milestoneId: string, task: Omit<Task, "id" | "createdAt" | "updatedAt">): Task | null => {
  for (const project of mockProjects) {
    const milestone = project.milestones.find((m) => m.id === milestoneId)
    if (milestone) {
      const newTask: Task = {
        ...task,
        id: `t${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        userCompletions: task.assignedTo.map((userId) => ({
          userId,
          isCompleted: false,
          userStatus: "pending" as UserTaskStatus,
        })),
      }
      milestone.tasks.push(newTask)
      return newTask
    }
  }
  return null
}

export const updateTask = (taskId: string, updates: Partial<Task>): void => {
  mockProjects.forEach((project) => {
    project.milestones.forEach((milestone) => {
      const taskIndex = milestone.tasks.findIndex((t) => t.id === taskId)
      if (taskIndex !== -1) {
        milestone.tasks[taskIndex] = {
          ...milestone.tasks[taskIndex],
          ...updates,
          updatedAt: new Date(),
        }
      }
    })
  })
}

export const deleteTask = (taskId: string): void => {
  mockProjects.forEach((project) => {
    project.milestones.forEach((milestone) => {
      const taskIndex = milestone.tasks.findIndex((t) => t.id === taskId)
      if (taskIndex !== -1) {
        milestone.tasks.splice(taskIndex, 1)
      }
    })
  })
}
