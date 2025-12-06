import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate avatar from node ID hash
export function generateAvatar(id: string) {
  const hash = id.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)

  const colors = [
    '#f9961e', '#116b61', '#3b82f6', '#8b5cf6', '#ec4899',
    '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16'
  ]

  const colorIndex = Math.abs(hash) % colors.length
  const bgColor = colors[colorIndex]

  // Generate initials from ID
  const initials = id.substring(0, 2).toUpperCase()

  return { bgColor, initials }
}
