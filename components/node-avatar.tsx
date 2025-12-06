"use client"

import { generateAvatar } from "@/lib/utils"

interface NodeAvatarProps {
  id: string
  name: string
  size?: "sm" | "md" | "lg"
}

export function NodeAvatar({ id, name, size = "md" }: NodeAvatarProps) {
  const { bgColor, initials } = generateAvatar(id)

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-lg",
  }

  return (
    <div
      className={`rounded-full flex items-center justify-center font-semibold text-white ${sizeClasses[size]}`}
      style={{ backgroundColor: bgColor }}
      title={name}
    >
      {initials}
    </div>
  )
}