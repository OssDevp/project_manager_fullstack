"use client"

import type React from "react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Circle, PlayCircle, PauseCircle, CheckCircle2 } from "lucide-react"
import type { UserTaskStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

interface UserTaskStatusSelectorProps {
  currentStatus: UserTaskStatus
  onStatusChange: (status: UserTaskStatus) => void
  disabled?: boolean
}

const statusOptions: {
  value: UserTaskStatus
  label: string
  icon: React.ElementType
  color: string
  description: string
}[] = [
  {
    value: "pending",
    label: "Pendiente",
    icon: Circle,
    color: "text-muted-foreground",
    description: "Aún no has comenzado esta tarea",
  },
  {
    value: "in-progress",
    label: "En Progreso",
    icon: PlayCircle,
    color: "text-chart-1",
    description: "Estás trabajando activamente en esta tarea",
  },
  {
    value: "paused",
    label: "En Pausa",
    icon: PauseCircle,
    color: "text-chart-4",
    description: "Has pausado temporalmente el trabajo",
  },
  {
    value: "completed",
    label: "Completada",
    icon: CheckCircle2,
    color: "text-chart-3",
    description: "Has terminado tu parte de la tarea",
  },
]

export function UserTaskStatusSelector({ currentStatus, onStatusChange, disabled }: UserTaskStatusSelectorProps) {
  const currentOption = statusOptions.find((opt) => opt.value === currentStatus)
  const CurrentIcon = currentOption?.icon || Circle

  return (
    <Select
      value={currentStatus}
      onValueChange={(value) => onStatusChange(value as UserTaskStatus)}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue>
          <div className="flex items-center gap-2">
            <CurrentIcon className={cn("h-4 w-4", currentOption?.color)} />
            <span>{currentOption?.label}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option) => {
          const Icon = option.icon
          return (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                <Icon className={cn("h-4 w-4", option.color)} />
                <div className="flex flex-col">
                  <span className="font-medium">{option.label}</span>
                  <span className="text-xs text-muted-foreground">{option.description}</span>
                </div>
              </div>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
